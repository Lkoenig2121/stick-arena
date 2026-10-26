import { MAP_H, MAP_W, currentMap } from "../data/maps";
import type { Rect } from "../types";
import { PLAYER_RADIUS } from "./draw";

const CELL = 52;
const CLEAR_R = PLAYER_RADIUS + 6;

type Vec = { x: number; y: number };

const cols = Math.ceil(MAP_W / CELL);
const rows = Math.ceil(MAP_H / CELL);
const walk = new Uint8Array(cols * rows);
let ready = false;
let bakedFor = "";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function circleRect(cx: number, cy: number, r: number, rect: Rect) {
  const nx = clamp(cx, rect.x, rect.x + rect.w);
  const ny = clamp(cy, rect.y, rect.y + rect.h);
  return (cx - nx) ** 2 + (cy - ny) ** 2 < r * r;
}

export function blocked(x: number, y: number, r = CLEAR_R) {
  if (x < 24 || y < 24 || x > MAP_W - 24 || y > MAP_H - 24) return true;
  return currentMap().solids.some((solid) => circleRect(x, y, r, solid));
}

export function lineClear(ax: number, ay: number, bx: number, by: number, r = CLEAR_R) {
  const steps = Math.max(2, Math.ceil(Math.hypot(bx - ax, by - ay) / 22));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    if (blocked(ax + (bx - ax) * t, ay + (by - ay) * t, r)) return false;
  }
  return true;
}

function build() {
  const name = currentMap().name;
  if (ready && bakedFor === name) return;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const wx = x * CELL + CELL / 2;
      const wy = y * CELL + CELL / 2;
      walk[y * cols + x] = blocked(wx, wy) ? 0 : 1;
    }
  }
  bakedFor = name;
  ready = true;
}

function cellOf(x: number, y: number) {
  return {
    cx: clamp(Math.floor(x / CELL), 0, cols - 1),
    cy: clamp(Math.floor(y / CELL), 0, rows - 1),
  };
}

function nearestWalkable(x: number, y: number) {
  const start = cellOf(x, y);
  if (walk[start.cy * cols + start.cx]) {
    return { x: start.cx * CELL + CELL / 2, y: start.cy * CELL + CELL / 2, cx: start.cx, cy: start.cy };
  }
  for (let rad = 1; rad < 12; rad++) {
    for (let dy = -rad; dy <= rad; dy++) {
      for (let dx = -rad; dx <= rad; dx++) {
        if (Math.abs(dx) !== rad && Math.abs(dy) !== rad) continue;
        const cx = start.cx + dx;
        const cy = start.cy + dy;
        if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) continue;
        if (!walk[cy * cols + cx]) continue;
        return { x: cx * CELL + CELL / 2, y: cy * CELL + CELL / 2, cx, cy };
      }
    }
  }
  return { x, y, cx: start.cx, cy: start.cy };
}

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

export function findPath(sx: number, sy: number, tx: number, ty: number): Vec[] {
  build();
  const start = nearestWalkable(sx, sy);
  const goal = nearestWalkable(tx, ty);
  const startKey = start.cy * cols + start.cx;
  const goalKey = goal.cy * cols + goal.cx;
  if (startKey === goalKey) return [{ x: tx, y: ty }];

  const came = new Int32Array(cols * rows).fill(-1);
  const cost = new Float32Array(cols * rows).fill(1e9);
  const open: number[] = [startKey];
  cost[startKey] = 0;

  const heuristic = (key: number) => {
    const cx = key % cols;
    const cy = (key - cx) / cols;
    return Math.hypot(cx - goal.cx, cy - goal.cy);
  };

  while (open.length) {
    let best = 0;
    let bestScore = cost[open[0]] + heuristic(open[0]);
    for (let i = 1; i < open.length; i++) {
      const score = cost[open[i]] + heuristic(open[i]);
      if (score < bestScore) {
        best = i;
        bestScore = score;
      }
    }
    const current = open.splice(best, 1)[0];
    if (current === goalKey) break;
    const cx = current % cols;
    const cy = (current - cx) / cols;
    for (const [dx, dy] of DIRS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const next = ny * cols + nx;
      if (!walk[next]) continue;
      if (dx !== 0 && dy !== 0) {
        if (!walk[cy * cols + nx] || !walk[ny * cols + cx]) continue;
      }
      const step = dx === 0 || dy === 0 ? 1 : 1.414;
      const nextCost = cost[current] + step;
      if (nextCost >= cost[next]) continue;
      cost[next] = nextCost;
      came[next] = current;
      if (!open.includes(next)) open.push(next);
    }
  }

  if (came[goalKey] < 0 && startKey !== goalKey) return [];

  const cells: number[] = [];
  let cursor = goalKey;
  cells.push(cursor);
  while (cursor !== startKey && came[cursor] >= 0) {
    cursor = came[cursor];
    cells.push(cursor);
  }
  cells.reverse();

  const path = cells.map((key) => {
    const cx = key % cols;
    const cy = (key - cx) / cols;
    return { x: cx * CELL + CELL / 2, y: cy * CELL + CELL / 2 };
  });
  if (path.length) path[path.length - 1] = { x: tx, y: ty };
  return path;
}

export function followPath(path: Vec[], x: number, y: number): Vec | null {
  while (path.length > 1 && Math.hypot(path[0].x - x, path[0].y - y) < 40) {
    path.shift();
  }
  if (!path.length) return null;

  let visible = 0;
  for (let i = 0; i < path.length; i++) {
    if (lineClear(x, y, path[i].x, path[i].y, PLAYER_RADIUS + 2)) visible = i;
    else break;
  }
  return path[visible] ?? path[0];
}

export function steerAround(x: number, y: number, dx: number, dy: number) {
  const base = Math.atan2(dy, dx);
  const offsets = [0, 0.45, -0.45, 0.9, -0.9, 1.35, -1.35, 1.85, -1.85, Math.PI];
  for (const offset of offsets) {
    const ang = base + offset;
    const tx = Math.cos(ang);
    const ty = Math.sin(ang);
    if (!blocked(x + tx * 26, y + ty * 26, PLAYER_RADIUS + 1)) {
      return { x: tx, y: ty };
    }
  }
  return { x: dx, y: dy };
}
