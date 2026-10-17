import { FURNITURE, MAP_H, MAP_W, WALLS, FLOORS } from "../data/lobby";
import { WEAPONS } from "../data/weapons";
import type { Furniture, GroundWeapon, Player, Projectile, WeaponId } from "../types";

export const PLAYER_RADIUS = 14;

export function drawHeaven(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#7ec8ff");
  sky.addColorStop(0.28, "#c5ecff");
  sky.addColorStop(0.62, "#fff6d8");
  sky.addColorStop(1, "#ffd38a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  const sunX = width * 0.7;
  const sunY = height * 0.16;
  const glow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 280);
  glow.addColorStop(0, "rgba(255,255,240,0.95)");
  glow.addColorStop(0.35, "rgba(255,220,130,0.4)");
  glow.addColorStop(1, "rgba(255,210,120,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 280, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(sunX, sunY);
  ctx.rotate(time * 0.03);
  ctx.fillStyle = "rgba(255,248,220,0.12)";
  for (let i = 0; i < 10; i++) {
    ctx.rotate(Math.PI / 5);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(16, 520);
    ctx.lineTo(-16, 520);
    ctx.fill();
  }
  ctx.restore();

  const clouds = [
    { x: 0.12, y: 0.18, s: 1 },
    { x: 0.38, y: 0.28, s: 1.25 },
    { x: 0.58, y: 0.12, s: 0.9 },
    { x: 0.84, y: 0.32, s: 1.15 },
    { x: 0.22, y: 0.72, s: 1.3 },
    { x: 0.7, y: 0.78, s: 1.1 },
  ];
  for (const cloud of clouds) {
    const drift = Math.sin(time * 0.15 + cloud.x * 8) * 18;
    drawCloud(ctx, cloud.x * width + drift, cloud.y * height, 70 * cloud.s);
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.beginPath();
  ctx.ellipse(x, y, size, size * 0.45, 0, 0, Math.PI * 2);
  ctx.ellipse(x - size * 0.55, y + size * 0.08, size * 0.55, size * 0.38, 0, 0, Math.PI * 2);
  ctx.ellipse(x + size * 0.5, y + size * 0.1, size * 0.6, size * 0.36, 0, 0, Math.PI * 2);
  ctx.ellipse(x - size * 0.1, y - size * 0.28, size * 0.42, size * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function bakeMap() {
  const canvas = document.createElement("canvas");
  canvas.width = MAP_W;
  canvas.height = MAP_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = true;

  for (const floor of FLOORS) {
    ctx.fillStyle = floor.color;
    ctx.fillRect(floor.x, floor.y, floor.w, floor.h);
  }

  drawCarpetTexture(ctx);

  for (const piece of FURNITURE) {
    drawFurniture(ctx, piece);
  }

  for (const wall of WALLS) {
    drawWall(ctx, wall.x, wall.y, wall.w, wall.h);
  }

  return canvas;
}

function drawCarpetTexture(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = "#000";
  for (let y = 0; y < MAP_H; y += 24) {
    for (let x = 0; x < MAP_W; x += 24) {
      if ((x + y) % 48 === 0) ctx.fillRect(x, y, 12, 12);
    }
  }
  ctx.restore();
}

function drawWall(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = Math.min(18, w / 2, h / 2);
  ctx.fillStyle = "#efe8dc";
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.strokeStyle = "#d8cfc0";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  roundRect(ctx, x + 3, y + 3, Math.max(0, w - 6), Math.max(4, h * 0.18), r / 2);
  ctx.fill();
}

function drawFurniture(ctx: CanvasRenderingContext2D, piece: Furniture) {
  const { x, y, w, h, kind } = piece;
  ctx.save();
  switch (kind) {
    case "desk":
      ctx.fillStyle = "#8d86b8";
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.fillStyle = "#c5c0dc";
      ctx.fillRect(x + 8, y + 5, w * 0.28, h * 0.42);
      ctx.fillStyle = "#6f6896";
      ctx.fillRect(x + w * 0.55, y + 6, w * 0.28, h * 0.28);
      break;
    case "chair":
      ctx.fillStyle = "#6e6898";
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#3d3a58";
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h / 2, w * 0.22, h * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "oval-table":
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 4;
      ctx.stroke();
      break;
    case "rect-table":
      ctx.fillStyle = "#1c1c1c";
      roundRect(ctx, x, y, w, h, 8);
      ctx.fill();
      break;
    case "couch":
      ctx.fillStyle = "#1a1a1a";
      roundRect(ctx, x, y, w, h, 10);
      ctx.fill();
      ctx.fillStyle = "#2a2a2a";
      if (w > h) {
        const seat = h * 0.45;
        ctx.fillRect(x + 8, y + h - seat - 4, w - 16, seat);
      } else {
        const seat = w * 0.45;
        ctx.fillRect(x + 4, y + 8, seat, h - 16);
      }
      break;
    case "coffee":
      ctx.fillStyle = "#6b4423";
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.fillStyle = "#8a5a30";
      ctx.fillRect(x + 6, y + 4, w - 12, 5);
      break;
    case "reception":
      ctx.fillStyle = "#e8a87c";
      roundRect(ctx, x, y, w, h, 8);
      ctx.fill();
      ctx.fillStyle = "#f0c4a3";
      ctx.fillRect(x + 6, y + 4, w - 12, 6);
      break;
    case "counter":
      ctx.fillStyle = "#ece6dc";
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.strokeStyle = "#cfc6b8";
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    case "pingpong":
      ctx.fillStyle = "#2f9e57";
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y + 4);
      ctx.lineTo(x + w / 2, y + h - 4);
      ctx.stroke();
      break;
    case "weights":
      ctx.fillStyle = "#111";
      ctx.fillRect(x + 6, y + h / 2 - 3, w - 12, 6);
      ctx.beginPath();
      ctx.arc(x + 10, y + h / 2, 10, 0, Math.PI * 2);
      ctx.arc(x + w - 10, y + h / 2, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2ecc71";
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "cooler":
      ctx.fillStyle = "#3d8fd9";
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.fillStyle = "#f4f7fb";
      ctx.fillRect(x + 3, y + 2, w - 6, h * 0.38);
      ctx.fillStyle = "#2b6fb0";
      ctx.fillRect(x + w * 0.35, y + h * 0.55, w * 0.3, h * 0.28);
      break;
    case "plant":
      ctx.fillStyle = "#6b5344";
      ctx.fillRect(x + w * 0.3, y + h * 0.62, w * 0.4, h * 0.3);
      ctx.fillStyle = "#2f8f3e";
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h * 0.4, w * 0.42, h * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#246e30";
      ctx.beginPath();
      ctx.ellipse(x + w * 0.35, y + h * 0.42, w * 0.18, h * 0.22, -0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "cabinet":
      ctx.fillStyle = "#1b1b1b";
      roundRect(ctx, x, y, w, h, 5);
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    case "sink":
      ctx.fillStyle = "#e8e8e8";
      roundRect(ctx, x, y, w, h, 6);
      ctx.fill();
      ctx.fillStyle = "#bcd4e0";
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h / 2 + 2, w * 0.32, h * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#888";
      ctx.fillRect(x + w / 2 - 3, y + 3, 6, 8);
      break;
  }
  ctx.restore();
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  const { x, y, angle } = player;
  ctx.save();
  ctx.translate(x, y);

  if (player.dead) {
    ctx.rotate(0.7);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-18, 6);
    ctx.lineTo(16, -4);
    ctx.moveTo(-8, 14);
    ctx.lineTo(12, 10);
    ctx.stroke();
    ctx.restore();
    return;
  }

  if (player.spawnGuard > 0 && Math.floor(player.spawnGuard * 8) % 2 === 0) {
    ctx.globalAlpha = 0.45;
  }

  ctx.strokeStyle = player.color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 28, 0, Math.PI * 2);
  ctx.stroke();

  ctx.rotate(angle);

  const swing = player.attackFlash > 0 ? Math.sin(player.attackFlash * 18) * 0.45 : 0;
  const walk = Math.sin(player.walkPhase) * 0.28;

  ctx.strokeStyle = "#111";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(-7, 8);
  ctx.lineTo(-8 + walk * 6, 22);
  ctx.moveTo(7, 8);
  ctx.lineTo(8 - walk * 6, 22);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -2);
  ctx.lineTo(0, 10);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-16, 4 + swing * 8);
  ctx.moveTo(0, 0);
  ctx.lineTo(18, -2 - swing * 10);
  ctx.stroke();

  drawHeldWeapon(ctx, player.weapon, swing);

  ctx.fillStyle = "#f4f0e6";
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -10, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  ctx.save();
  ctx.font = "700 16px Nunito, Comic Sans MS, sans-serif";
  ctx.textAlign = "center";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.fillStyle = "#111";
  ctx.strokeText(player.name, x, y - 42);
  ctx.fillText(player.name, x, y - 42);
  ctx.restore();
}

function drawHeldWeapon(ctx: CanvasRenderingContext2D, weapon: WeaponId, swing: number) {
  ctx.save();
  ctx.translate(20, -4 - swing * 8);
  ctx.rotate(swing);
  drawWeaponGlyph(ctx, weapon, 1);
  ctx.restore();
}

export function drawGroundWeapon(ctx: CanvasRenderingContext2D, item: GroundWeapon, time: number) {
  if (item.hiddenUntil > time) return;
  const bob = Math.sin(time * 3 + item.x * 0.01) * 3;
  ctx.save();
  ctx.translate(item.x, item.y + bob);
  ctx.rotate(-0.35);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(2, 14, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  drawWeaponGlyph(ctx, item.weapon, 1.15);
  ctx.restore();
}

export function drawWeaponGlyph(
  ctx: CanvasRenderingContext2D,
  weapon: WeaponId,
  scale: number,
) {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (weapon) {
    case "fists":
      ctx.fillStyle = "#f4d0b0";
      ctx.beginPath();
      ctx.arc(-6, 0, 6, 0, Math.PI * 2);
      ctx.arc(6, 2, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "bat":
      ctx.strokeStyle = "#8b5a2b";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-16, 8);
      ctx.lineTo(20, -10);
      ctx.stroke();
      ctx.fillStyle = "#6b3f1a";
      ctx.beginPath();
      ctx.arc(20, -10, 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "katana":
      ctx.strokeStyle = "#dfe7ef";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-8, 6);
      ctx.lineTo(24, -12);
      ctx.stroke();
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-14, 10);
      ctx.lineTo(-6, 5);
      ctx.stroke();
      ctx.strokeStyle = "#b03a2e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-8, 8);
      ctx.lineTo(-2, 2);
      ctx.stroke();
      break;
    case "glock":
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(-4, -4, 22, 6);
      ctx.fillRect(-2, 2, 6, 10);
      ctx.fillStyle = "#444";
      ctx.fillRect(14, -3, 6, 4);
      break;
    case "ak47":
      ctx.fillStyle = "#2b2b2b";
      ctx.fillRect(-12, -3, 34, 6);
      ctx.fillRect(-8, 3, 6, 10);
      ctx.fillStyle = "#4a3728";
      ctx.fillRect(10, 2, 10, 5);
      ctx.fillRect(-16, -2, 8, 4);
      break;
    case "shotgun":
      ctx.fillStyle = "#3b2a1a";
      ctx.fillRect(-10, -3, 30, 6);
      ctx.fillStyle = "#222";
      ctx.fillRect(12, -4, 16, 8);
      ctx.fillRect(-6, 3, 6, 9);
      break;
    case "sledge":
      ctx.strokeStyle = "#5c4033";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-10, 10);
      ctx.lineTo(8, -8);
      ctx.stroke();
      ctx.fillStyle = "#2c2c2c";
      ctx.fillRect(4, -16, 16, 12);
      break;
    case "flamethrower":
      ctx.fillStyle = "#444";
      ctx.fillRect(-8, -4, 26, 6);
      ctx.fillStyle = "#c0392b";
      ctx.beginPath();
      ctx.arc(-10, 6, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f39c12";
      ctx.beginPath();
      ctx.moveTo(18, -6);
      ctx.lineTo(28, -2);
      ctx.lineTo(18, 2);
      ctx.fill();
      break;
    case "railgun":
      ctx.fillStyle = "#1f3a5f";
      ctx.fillRect(-16, -4, 40, 7);
      ctx.fillStyle = "#7fdbff";
      ctx.fillRect(8, -2, 20, 3);
      ctx.fillRect(-10, 3, 6, 8);
      break;
    case "chainsaw":
      ctx.fillStyle = "#f39c12";
      ctx.fillRect(-8, -6, 16, 12);
      ctx.fillStyle = "#bbb";
      ctx.fillRect(6, -4, 20, 7);
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(8 + i * 4, -4);
        ctx.lineTo(10 + i * 4, 3);
        ctx.stroke();
      }
      break;
    case "lasersword":
      ctx.strokeStyle = "#39ff14";
      ctx.shadowColor = "#39ff14";
      ctx.shadowBlur = 8;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-4, 6);
      ctx.lineTo(22, -14);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-10, 10);
      ctx.lineTo(-2, 4);
      ctx.stroke();
      break;
    case "tesla":
      ctx.fillStyle = "#555";
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#7fdbff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(8, -8);
      ctx.lineTo(16, -16);
      ctx.moveTo(10, 0);
      ctx.lineTo(20, 2);
      ctx.stroke();
      break;
    case "chaingun":
      ctx.fillStyle = "#333";
      ctx.fillRect(-8, -6, 18, 12);
      ctx.fillStyle = "#222";
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(10, -5 + i * 4, 16, 3);
      }
      break;
  }
  ctx.restore();
}

export function drawProjectile(ctx: CanvasRenderingContext2D, p: Projectile) {
  ctx.save();
  if (p.kind === "flame") {
    ctx.fillStyle = `rgba(255,${120 + Math.random() * 80},0,0.7)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
    ctx.fill();
  } else if (p.kind === "rail") {
    ctx.strokeStyle = "#7fdbff";
    ctx.lineWidth = 4;
    ctx.shadowColor = "#7fdbff";
    ctx.shadowBlur = 10;
    const ang = Math.atan2(p.vy, p.vx);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - Math.cos(ang) * (p.length ?? 80), p.y - Math.sin(ang) * (p.length ?? 80));
    ctx.stroke();
  } else {
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.kind === "pellet" ? 3 : 3.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function weaponLabel(id: WeaponId) {
  return WEAPONS[id].name;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
