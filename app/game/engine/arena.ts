import { BOT_NAMES, randomGuestName } from "../data/names";
import {
  MAP_H,
  MAP_W,
  PLACE_NAME,
  SOLIDS,
  SPAWNS,
  WEAPON_SPAWNS,
} from "../data/lobby";
import { MAX_HEALTH, WEAPONS } from "../data/weapons";
import type {
  BloodSplat,
  GroundWeapon,
  HudSnapshot,
  KillEvent,
  Player,
  Projectile,
  Rect,
  SlamFx,
  WeaponId,
} from "../types";
import { PLAYER_RADIUS } from "./draw";
import { findPath, followPath, lineClear, steerAround } from "./nav";

const BASE_SPEED = 315;
const RESPAWN = 2.2;
const WEAPON_RESPAWN = 16;
const ROUND_TIME = 5 * 60;
const BOT_COLORS = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];

export class Arena {
  players: Player[] = [];
  youId = "you";
  weapons: GroundWeapon[] = [];
  projectiles: Projectile[] = [];
  slams: SlamFx[] = [];
  blood: BloodSplat[] = [];
  feed: KillEvent[] = [];
  time = 0;
  timeLeft = ROUND_TIME;
  scoreboard = false;
  attacking = false;
  keys = new Set<string>();
  mouse = { x: MAP_W / 2, y: MAP_H / 2 };
  camera = { x: 0, y: 0 };
  feedSeq = 0;
  ping = 18 + Math.floor(Math.random() * 20);
  place: string;
  playerName: string;
  botNames: string[];

  constructor(opts?: { playerName?: string; place?: string; botNames?: string[] }) {
    this.place = opts?.place ?? PLACE_NAME;
    this.playerName = opts?.playerName ?? "";
    this.botNames = opts?.botNames?.length ? opts.botNames : BOT_NAMES.slice(0, 4);
    this.reset(true);
  }

  reset(freshNames = false) {
    const youName =
      this.playerName ||
      (freshNames ? randomGuestName() : (this.you()?.name ?? randomGuestName()));
    this.players = [];
    this.projectiles = [];
    this.slams = [];
    this.blood = [];
    this.feed = [];
    this.time = 0;
    this.timeLeft = ROUND_TIME;

    this.players.push(this.makePlayer(this.youId, youName, "#111111", false, 0));
    const bots = this.botNames.slice(0, 4);
    bots.forEach((name, i) => {
      this.players.push(
        this.makePlayer(`bot-${i}`, name, BOT_COLORS[i % BOT_COLORS.length], true, i + 1),
      );
    });

    this.weapons = WEAPON_SPAWNS.map((spawn, i) => ({
      id: `w-${i}`,
      weapon: spawn.weapon,
      x: spawn.x,
      y: spawn.y,
      hiddenUntil: 0,
    }));
  }

  you() {
    return this.players.find((p) => p.id === this.youId);
  }

  makePlayer(id: string, name: string, color: string, isBot: boolean, spawnIndex: number): Player {
    const spawn = openSpot(SPAWNS[spawnIndex % SPAWNS.length]);
    return {
      id,
      name,
      color,
      x: spawn.x,
      y: spawn.y,
      lastX: spawn.x,
      lastY: spawn.y,
      angle: Math.random() * Math.PI * 2,
      health: MAX_HEALTH,
      maxHealth: MAX_HEALTH,
      weapon: "fists",
      cooldown: 0,
      isBot,
      dead: false,
      deathTimer: 0,
      spawnGuard: 2,
      kills: 0,
      deaths: 0,
      walkPhase: 0,
      attackFlash: 0,
      targetId: null,
      aiTimer: 0.4 + Math.random() * 0.8,
      aiStrafe: Math.random() < 0.5 ? 1 : -1,
      aiLunge: 0,
      aiPath: [],
      aiPathAge: 0,
    };
  }

  setMouse(worldX: number, worldY: number) {
    this.mouse.x = worldX;
    this.mouse.y = worldY;
  }

  update(dt: number) {
    this.time += dt;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft <= 0) {
      this.reset();
      return;
    }

    for (const player of this.players) {
      if (player.dead) {
        player.deathTimer -= dt;
        if (player.deathTimer <= 0) this.respawn(player);
        continue;
      }

      player.cooldown = Math.max(0, player.cooldown - dt);
      player.spawnGuard = Math.max(0, player.spawnGuard - dt);
      player.attackFlash = Math.max(0, player.attackFlash - dt);
      this.unstuck(player);

      if (player.isBot) this.updateBot(player, dt);
      else this.updateHuman(player, dt);

      this.unstuck(player);
      this.pickupWeapons(player);
      player.lastX = player.x;
      player.lastY = player.y;
    }

    this.separatePlayers();
    this.updateProjectiles(dt);
    this.blood = this.blood.filter((b) => (b.life -= dt) > 0);
    this.slams = this.slams.filter((s) => (s.age += dt) < s.life);
    this.feed = this.feed.filter((f) => (f.age += dt) < 5);

    const you = this.you();
    if (you) {
      this.camera.x = you.x;
      this.camera.y = you.y;
    }
  }

  updateHuman(player: Player, dt: number) {
    let mx = 0;
    let my = 0;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) my -= 1;
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) my += 1;
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) mx -= 1;
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) mx += 1;
    const len = Math.hypot(mx, my) || 1;
    const speed = BASE_SPEED * WEAPONS[player.weapon].speed;
    this.movePlayer(player, (mx / len) * speed * dt, (my / len) * speed * dt);
    if (mx || my) player.walkPhase += dt * 10;
    player.angle = Math.atan2(this.mouse.y - player.y, this.mouse.x - player.x);

    if (this.attacking || this.keys.has("Space") || this.keys.has("Numpad0")) {
      this.tryAttack(player);
    }
  }

  updateBot(player: Player, dt: number) {
    player.aiTimer -= dt;
    if (player.aiTimer <= 0) {
      player.aiStrafe = Math.random() < 0.22 ? player.aiStrafe : -player.aiStrafe;
      player.aiTimer = 0.35 + Math.random() * 0.7;
    }

    const enemies = this.players.filter((p) => !p.dead && p.id !== player.id);
    const nearest = enemies.sort((a, b) => dist(player, a) - dist(player, b))[0];
    const grounded = this.weapons.filter((w) => w.hiddenUntil <= this.time);
    const nearbyGun = grounded.sort((a, b) => dist(player, a) - dist(player, b))[0];
    const fighting = nearest && dist(player, nearest) < 420;
    const grabWeapon =
      !fighting &&
      nearbyGun &&
      (player.weapon === "fists" || WEAPONS[player.weapon].damage < 13);

    const def = WEAPONS[player.weapon];
    const speed = BASE_SPEED * def.speed * 0.9;
    let mx = 0;
    let my = 0;

    if (grabWeapon && nearbyGun) {
      const step = this.botStepToward(player, nearbyGun.x, nearbyGun.y, dt);
      mx = step.x;
      my = step.y;
      player.angle = Math.atan2(nearbyGun.y - player.y, nearbyGun.x - player.x);
    } else if (nearest) {
      player.targetId = nearest.id;
      const toEnemy = Math.atan2(nearest.y - player.y, nearest.x - player.x);
      player.angle = toEnemy;
      const gap = dist(player, nearest);
      const strikeRange = def.meleeReach + PLAYER_RADIUS;
      const holdMin = def.ranged ? 170 : strikeRange * 0.55;
      const holdMax = def.ranged ? 340 : strikeRange * 0.78;
      const overlap = PLAYER_RADIUS * 2 + 6;
      const canSee = lineClear(player.x, player.y, nearest.x, nearest.y, PLAYER_RADIUS + 2);

      const fx = Math.cos(toEnemy);
      const fy = Math.sin(toEnemy);
      const sx = -fy * player.aiStrafe;
      const sy = fx * player.aiStrafe;

      player.aiLunge = Math.max(0, player.aiLunge - dt);
      if (
        !def.ranged &&
        player.aiLunge <= 0 &&
        player.cooldown <= 0 &&
        gap < 160 &&
        gap > overlap &&
        canSee
      ) {
        player.aiLunge = 0.28 + Math.random() * 0.12;
      }

      const lunging = !def.ranged && player.aiLunge > 0 && canSee;

      if (gap < overlap) {
        mx = -fx;
        my = -fy;
      } else if (!canSee || gap > holdMax + 24) {
        const step = this.botStepToward(player, nearest.x, nearest.y, dt);
        mx = step.x;
        my = step.y;
      } else if (lunging) {
        mx = fx;
        my = fy;
      } else if (gap < holdMin) {
        mx = -fx * 0.85 + sx * 0.7;
        my = -fy * 0.85 + sy * 0.7;
      } else {
        const weave = Math.sin(this.time * 7 + player.walkPhase) * 0.22;
        mx = sx + fx * weave;
        my = sy + fy * weave;
      }

      const canMelee = !def.ranged && gap <= strikeRange + 6;
      const canShoot = def.ranged && gap < 400 && canSee;
      if ((canMelee || canShoot) && Math.abs(angleDiff(player.angle, toEnemy)) < 0.85) {
        this.tryAttack(player);
        if (canMelee) player.aiLunge = 0;
      }
    }

    const len = Math.hypot(mx, my);
    if (len > 0.05) {
      const steered = steerAround(player.x, player.y, mx / len, my / len);
      this.movePlayer(player, steered.x * speed * dt, steered.y * speed * dt);
      player.walkPhase += dt * 10;
    }
  }

  botStepToward(player: Player, tx: number, ty: number, dt: number) {
    player.aiPathAge -= dt;
    const goalChanged =
      !player.aiPath.length ||
      dist(player.aiPath[player.aiPath.length - 1], { x: tx, y: ty }) > 90;
    if (player.aiPathAge <= 0 || goalChanged) {
      player.aiPath = findPath(player.x, player.y, tx, ty);
      player.aiPathAge = 0.28 + Math.random() * 0.12;
    }

    if (lineClear(player.x, player.y, tx, ty, PLAYER_RADIUS + 2)) {
      const ang = Math.atan2(ty - player.y, tx - player.x);
      return { x: Math.cos(ang), y: Math.sin(ang) };
    }

    const waypoint = followPath(player.aiPath, player.x, player.y);
    if (!waypoint) {
      const ang = Math.atan2(ty - player.y, tx - player.x);
      return { x: Math.cos(ang), y: Math.sin(ang) };
    }
    const ang = Math.atan2(waypoint.y - player.y, waypoint.x - player.x);
    return { x: Math.cos(ang), y: Math.sin(ang) };
  }

  separatePlayers() {
    const live = this.players.filter((p) => !p.dead);
    const minGap = PLAYER_RADIUS * 2 + 6;
    for (let i = 0; i < live.length; i++) {
      for (let j = i + 1; j < live.length; j++) {
        const a = live[i];
        const b = live[j];
        const gap = dist(a, b);
        if (gap >= minGap || gap < 0.001) continue;
        const push = (minGap - gap) / 2;
        const nx = (b.x - a.x) / gap;
        const ny = (b.y - a.y) / gap;
        this.movePlayer(a, -nx * push, -ny * push);
        this.movePlayer(b, nx * push, ny * push);
      }
    }
  }

  movePlayer(player: Player, dx: number, dy: number) {
    const nextX = clamp(player.x + dx, 24, MAP_W - 24);
    if (!collides(nextX, player.y, PLAYER_RADIUS)) player.x = nextX;
    const nextY = clamp(player.y + dy, 24, MAP_H - 24);
    if (!collides(player.x, nextY, PLAYER_RADIUS)) player.y = nextY;
    this.unstuck(player);
  }

  unstuck(player: Player) {
    for (let pass = 0; pass < 6; pass++) {
      let moved = false;
      for (const solid of SOLIDS) {
        const pushed = separateCircleRect(player.x, player.y, PLAYER_RADIUS, solid);
        if (!pushed) continue;
        player.x = clamp(pushed.x, 24, MAP_W - 24);
        player.y = clamp(pushed.y, 24, MAP_H - 24);
        moved = true;
      }
      if (!moved) break;
    }
  }

  pickupWeapons(player: Player) {
    for (const item of this.weapons) {
      if (item.hiddenUntil > this.time) continue;
      if (dist(player, item) < 34) {
        player.weapon = item.weapon;
        item.hiddenUntil = this.time + WEAPON_RESPAWN;
      }
    }
  }

  tryAttack(player: Player) {
    if (player.cooldown > 0 || player.dead) return;
    const def = WEAPONS[player.weapon];
    player.cooldown = def.reload;
    player.attackFlash = player.weapon === "sledge" ? 0.42 : 0.16;

    if (def.ranged) {
      if (player.weapon === "railgun") {
        if (player.isBot) player.angle += this.botRailMiss(player);
        this.fireRail(player, def.damage);
        return;
      }
      for (let i = 0; i < def.pellets; i++) {
        const spread = (Math.random() - 0.5) * def.spread * 2;
        const ang = player.angle + spread;
        const kind =
          player.weapon === "flamethrower"
            ? "flame"
            : def.pellets > 1
              ? "pellet"
              : "bullet";
        this.projectiles.push({
          x: player.x + Math.cos(player.angle) * 28,
          y: player.y + Math.sin(player.angle) * 28,
          vx: Math.cos(ang) * def.bulletSpeed,
          vy: Math.sin(ang) * def.bulletSpeed,
          life: def.range / def.bulletSpeed,
          damage: player.weapon === "shotgun" ? 7 : def.damage,
          ownerId: player.id,
          kind,
        });
      }
      return;
    }

    if (player.weapon === "sledge") {
      this.slams.push({
        x: player.x + Math.cos(player.angle) * 88,
        y: player.y + Math.sin(player.angle) * 88,
        angle: player.angle,
        age: 0,
        life: 0.42,
      });
    }
    this.melee(player, def.damage, def.meleeReach);
  }

  melee(player: Player, damage: number, reach: number) {
    const tesla = player.weapon === "tesla";
    const sledge = player.weapon === "sledge";
    const maxDist = reach + PLAYER_RADIUS * (sledge ? 2.4 : 1.35);
    const arc = tesla ? Math.PI : sledge ? 2.4 : 1.05;
    for (const other of this.players) {
      if (other.id === player.id || other.dead || other.spawnGuard > 0) continue;
      const d = dist(player, other);
      if (d > maxDist) continue;
      if (!tesla) {
        const to = Math.atan2(other.y - player.y, other.x - player.x);
        if (Math.abs(angleDiff(player.angle, to)) > arc) continue;
      }
      this.hurt(other, damage, player);
    }
  }

  botRailMiss(player: Player) {
    const target = this.players.find((p) => p.id === player.targetId && !p.dead);
    const moved = target ? Math.hypot(target.x - target.lastX, target.y - target.lastY) : 0;
    const sign = Math.random() < 0.5 ? -1 : 1;
    if (moved > 2.2) {
      return sign * (0.18 + Math.random() * 0.34);
    }
    return sign * (0.02 + Math.random() * 0.05);
  }

  fireRail(player: Player, damage: number) {
    const ox = player.x + Math.cos(player.angle) * 28;
    const oy = player.y + Math.sin(player.angle) * 28;
    const steps = 80;
    const step = 18;
    let x = ox;
    let y = oy;
    const hit = new Set<string>();
    for (let i = 0; i < steps; i++) {
      x += Math.cos(player.angle) * step;
      y += Math.sin(player.angle) * step;
      if (collides(x, y, 4)) {
        x -= Math.cos(player.angle) * 8;
        y -= Math.sin(player.angle) * 8;
        break;
      }
      for (const other of this.players) {
        if (other.id === player.id || other.dead || other.spawnGuard > 0) continue;
        if (hit.has(other.id)) continue;
        if (dist({ x, y }, other) < PLAYER_RADIUS + 8) {
          hit.add(other.id);
          this.hurt(other, damage, player);
        }
      }
    }
    this.projectiles.push({
      x,
      y,
      ox,
      oy,
      vx: 0,
      vy: 0,
      life: 0.22,
      damage: 0,
      ownerId: player.id,
      kind: "rail",
      length: Math.hypot(x - ox, y - oy),
    });
  }

  updateProjectiles(dt: number) {
    const next: Projectile[] = [];
    for (const p of this.projectiles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) continue;
      if (p.kind === "rail") {
        next.push(p);
        continue;
      }
      if (collides(p.x, p.y, 3)) continue;
      let hit = false;
      for (const other of this.players) {
        if (other.id === p.ownerId || other.dead || other.spawnGuard > 0) continue;
        if (dist(p, other) < PLAYER_RADIUS + 4) {
          const owner = this.players.find((pl) => pl.id === p.ownerId);
          if (owner && p.damage > 0) this.hurt(other, p.damage, owner);
          hit = true;
          break;
        }
      }
      if (!hit) next.push(p);
    }
    this.projectiles = next;
  }

  hurt(target: Player, damage: number, attacker: Player) {
    if (target.dead || target.spawnGuard > 0) return;
    target.health -= damage;
    this.blood.push(makeBlood(target.x, target.y));
    if (target.health <= 0) {
      target.health = 0;
      target.dead = true;
      target.deathTimer = RESPAWN;
      target.deaths += 1;
      attacker.kills += 1;
      target.weapon = "fists";
      const def = WEAPONS[attacker.weapon];
      const flavor = def.killFlavor ? `, ${def.killFlavor}` : "";
      this.feed.unshift({
        id: ++this.feedSeq,
        text: `${attacker.name} ${def.killVerb} ${target.name}${flavor}`,
        age: 0,
      });
      this.feed = this.feed.slice(0, 5);
    }
  }

  respawn(player: Player) {
    const spot = openSpot(SPAWNS[Math.floor(Math.random() * SPAWNS.length)]);
    player.x = spot.x;
    player.y = spot.y;
    player.health = MAX_HEALTH;
    player.dead = false;
    player.weapon = "fists";
    player.spawnGuard = 2;
    player.cooldown = 0;
  }

  hud(fps: number): HudSnapshot {
    const you = this.you();
    const ranked = [...this.players].sort((a, b) => b.kills - a.kills || a.deaths - b.deaths);
    const rank = you ? ranked.findIndex((p) => p.id === you.id) + 1 : 1;
    return {
      health: you?.health ?? 0,
      maxHealth: MAX_HEALTH,
      weapon: you?.weapon ?? "fists",
      place: this.place,
      rank,
      timeLeft: this.timeLeft,
      fps,
      ping: this.ping,
      scoreboard: this.scoreboard,
      players: ranked.map((p) => ({
        id: p.id,
        name: p.name,
        color: p.color,
        kills: p.kills,
        deaths: p.deaths,
        you: p.id === this.youId,
      })),
      feed: this.feed.map((f) => ({ id: f.id, text: f.text })),
    };
  }
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function angleDiff(a: number, b: number) {
  return Math.atan2(Math.sin(b - a), Math.cos(b - a));
}

function collides(x: number, y: number, r: number) {
  return SOLIDS.some((s) => circleRect(x, y, r, s));
}

function circleRect(cx: number, cy: number, r: number, rect: Rect) {
  const nx = clamp(cx, rect.x, rect.x + rect.w);
  const ny = clamp(cy, rect.y, rect.y + rect.h);
  return (cx - nx) ** 2 + (cy - ny) ** 2 < r * r;
}

function separateCircleRect(cx: number, cy: number, r: number, rect: Rect) {
  const nearestX = clamp(cx, rect.x, rect.x + rect.w);
  const nearestY = clamp(cy, rect.y, rect.y + rect.h);
  let dx = cx - nearestX;
  let dy = cy - nearestY;
  const inside = cx > rect.x && cx < rect.x + rect.w && cy > rect.y && cy < rect.y + rect.h;

  if (inside) {
    const left = cx - rect.x;
    const right = rect.x + rect.w - cx;
    const top = cy - rect.y;
    const bottom = rect.y + rect.h - cy;
    const closest = Math.min(left, right, top, bottom);
    if (closest === left) return { x: rect.x - r - 0.75, y: cy };
    if (closest === right) return { x: rect.x + rect.w + r + 0.75, y: cy };
    if (closest === top) return { x: cx, y: rect.y - r - 0.75 };
    return { x: cx, y: rect.y + rect.h + r + 0.75 };
  }

  const distSq = dx * dx + dy * dy;
  if (distSq >= r * r || distSq === 0) return null;
  const dist = Math.sqrt(distSq);
  const push = r - dist + 0.75;
  return { x: cx + (dx / dist) * push, y: cy + (dy / dist) * push };
}

function openSpot(preferred: { x: number; y: number }) {
  if (!collides(preferred.x, preferred.y, PLAYER_RADIUS + 2)) return preferred;
  for (let i = 0; i < 48; i++) {
    const ang = (i / 48) * Math.PI * 2;
    const r = 24 + i * 10;
    const x = preferred.x + Math.cos(ang) * r;
    const y = preferred.y + Math.sin(ang) * r;
    if (x < 30 || y < 30 || x > MAP_W - 30 || y > MAP_H - 30) continue;
    if (!collides(x, y, PLAYER_RADIUS + 2)) return { x, y };
  }
  return preferred;
}

function makeBlood(x: number, y: number): BloodSplat {
  const spots = Array.from({ length: 7 }, () => ({
    dx: (Math.random() - 0.5) * 34,
    dy: (Math.random() - 0.5) * 34,
    r: 4 + Math.random() * 10,
  }));
  return { x, y, spots, life: 18 };
}
