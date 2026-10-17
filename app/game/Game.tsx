"use client";

import { useEffect, useRef, useState } from "react";
import { Hud } from "./components/Hud";
import { MAP_H, MAP_W } from "./data/lobby";
import { Arena } from "./engine/arena";
import {
  bakeMap,
  drawGroundWeapon,
  drawHeaven,
  drawPlayer,
  drawProjectile,
  PLAYER_RADIUS,
} from "./engine/draw";
import type { HudSnapshot } from "./types";

const EMPTY_HUD: HudSnapshot = {
  health: 60,
  maxHealth: 60,
  weapon: "fists",
  place: "The Lobby",
  rank: 1,
  timeLeft: 300,
  fps: 0,
  ping: 24,
  scoreboard: false,
  players: [],
  feed: [],
};

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ui, setUi] = useState<HudSnapshot>(EMPTY_HUD);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const arena = new Arena();
    const map = bakeMap();
    const keys = arena.keys;

    let raf = 0;
    let last = performance.now();
    let fps = 60;
    let fpsFrames = 0;
    let fpsStamp = last;
    let uiStamp = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const worldFromEvent = (event: PointerEvent) => {
      const camX = arena.camera.x - canvas.width / 2;
      const camY = arena.camera.y - canvas.height / 2;
      return { x: event.clientX + camX, y: event.clientY + camY };
    };

    const onKey = (event: KeyboardEvent, down: boolean) => {
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
      }
      if (down) keys.add(event.code);
      else keys.delete(event.code);
      if (event.code === "ShiftLeft" || event.code === "ShiftRight" || event.code === "KeyB" || event.code === "Digit1") {
        arena.scoreboard = down;
      }
    };

    const onDown = (event: PointerEvent) => {
      if (event.button === 0) arena.attacking = true;
      const w = worldFromEvent(event);
      arena.setMouse(w.x, w.y);
    };
    const onUp = (event: PointerEvent) => {
      if (event.button === 0) arena.attacking = false;
    };
    const onMove = (event: PointerEvent) => {
      const w = worldFromEvent(event);
      arena.setMouse(w.x, w.y);
    };

    const downKey = (event: KeyboardEvent) => onKey(event, true);
    const upKey = (event: KeyboardEvent) => onKey(event, false);
    const preventMenu = (event: Event) => event.preventDefault();

    window.addEventListener("resize", resize);
    window.addEventListener("keydown", downKey);
    window.addEventListener("keyup", upKey);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    canvas.addEventListener("contextmenu", preventMenu);

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      fpsFrames += 1;
      if (now - fpsStamp >= 500) {
        fps = Math.round((fpsFrames * 1000) / (now - fpsStamp));
        fpsFrames = 0;
        fpsStamp = now;
      }

      arena.update(dt);

      const camX = arena.camera.x - canvas.width / 2;
      const camY = arena.camera.y - canvas.height / 2;

      drawHeaven(ctx, canvas.width, canvas.height, arena.time);
      ctx.save();
      ctx.translate(-camX, -camY);
      ctx.drawImage(map, 0, 0, MAP_W, MAP_H);

      for (const stain of arena.blood) {
        ctx.globalAlpha = Math.min(1, stain.life / 6);
        ctx.fillStyle = "#7a0f16";
        for (const spot of stain.spots) {
          ctx.beginPath();
          ctx.arc(stain.x + spot.dx, stain.y + spot.dy, spot.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      for (const weapon of arena.weapons) {
        drawGroundWeapon(ctx, weapon, arena.time);
      }
      for (const projectile of arena.projectiles) {
        drawProjectile(ctx, projectile);
      }
      for (const player of arena.players) {
        drawPlayer(ctx, player);
        if (!player.dead && player.spawnGuard <= 0) {
          ctx.strokeStyle = "rgba(0,0,0,0.08)";
          ctx.beginPath();
          ctx.arc(player.x, player.y, PLAYER_RADIUS + 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();

      if (now - uiStamp > 50) {
        uiStamp = now;
        setUi(arena.hud(fps));
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", downKey);
      window.removeEventListener("keyup", upKey);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("contextmenu", preventMenu);
    };
  }, []);

  return (
    <div className="relative h-dvh w-dvw overflow-hidden bg-[#c5ecff]">
      <canvas ref={canvasRef} className="block h-full w-full touch-none" />
      <Hud ui={ui} />
    </div>
  );
}
