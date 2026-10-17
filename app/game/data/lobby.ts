import type { Furniture, Rect, WeaponId } from "../types";

export const SRC_W = 541;
export const SRC_H = 369;
export const SCALE = 8;
export const MAP_W = SRC_W * SCALE;
export const MAP_H = SRC_H * SCALE;
export const PLACE_NAME = "The Lobby";

function box(x: number, y: number, w: number, h: number): Rect {
  return { x: x * SCALE, y: y * SCALE, w: w * SCALE, h: h * SCALE };
}

function item(
  kind: Furniture["kind"],
  x: number,
  y: number,
  w: number,
  h: number,
  solid = true,
): Furniture {
  const walkThrough = kind === "chair" || kind === "plant";
  return { kind, ...box(x, y, w, h), solid: walkThrough ? false : solid };
}

function wallsFromRoom(
  x: number,
  y: number,
  w: number,
  h: number,
  t: number,
  gaps: { side: "n" | "s" | "e" | "w"; start: number; end: number }[],
): Rect[] {
  const edges: { side: "n" | "s" | "e" | "w"; x: number; y: number; w: number; h: number }[] =
    [
      { side: "n", x, y, w, h: t },
      { side: "s", x, y: y + h - t, w, h: t },
      { side: "w", x, y, w: t, h },
      { side: "e", x: x + w - t, y, w: t, h },
    ];

  const out: Rect[] = [];
  for (const edge of edges) {
    const edgeGaps = gaps
      .filter((g) => g.side === edge.side)
      .map((g) => ({ start: g.start, end: g.end }))
      .sort((a, b) => a.start - b.start);

    if (edge.side === "n" || edge.side === "s") {
      let cursor = 0;
      const spans = [...edgeGaps, { start: edge.w, end: edge.w }];
      for (const gap of spans) {
        const start = cursor;
        const end = gap.start;
        if (end - start > 2) {
          out.push(box(edge.x + start, edge.y, end - start, edge.h));
        }
        cursor = gap.end;
      }
    } else {
      let cursor = 0;
      const spans = [...edgeGaps, { start: edge.h, end: edge.h }];
      for (const gap of spans) {
        const start = cursor;
        const end = gap.start;
        if (end - start > 2) {
          out.push(box(edge.x, edge.y + start, edge.w, end - start));
        }
        cursor = gap.end;
      }
    }
  }
  return out;
}

const T = 16;

export const FLOORS: (Rect & { color: string })[] = [
  { ...box(0, 0, SRC_W, SRC_H), color: "#d8d8d8" },
  { ...box(16, 118, 268, 235), color: "#3a5c82" },
  { ...box(16, 88, 90, 40), color: "#3a5c82" },
  { ...box(148, 100, 130, 50), color: "#3a5c82" },
  { ...box(284, 72, 241, 281), color: "#c62828" },
  { ...box(400, 58, 125, 30), color: "#c62828" },
];

export const WALLS: Rect[] = [
  ...wallsFromRoom(0, 0, SRC_W, SRC_H, T, []),

  // Conference — east hall door plus a south door into the cubicles
  ...wallsFromRoom(0, 0, 136, 118, T, [
    { side: "e", start: 40, end: 92 },
    { side: "s", start: 78, end: 124 },
    { side: "n", start: 0, end: 136 },
    { side: "w", start: 0, end: 118 },
  ]),

  // Rec / gym — U open at the bottom so it connects to the office
  box(198, 0, 36, 100),
  box(348, 0, 36, 100),
  box(198, 100, 48, 18),
  box(300, 100, 84, 18),

  // Kitchen — west door into the north hall
  ...wallsFromRoom(428, 0, 113, 72, T, [
    { side: "n", start: 0, end: 113 },
    { side: "e", start: 0, end: 72 },
    { side: "w", start: 16, end: 60 },
  ]),

  // Small hall stub that does not seal the corridor
  box(186, 72, 12, 18),

  // Center T with a mid doorway and a south passage into the lounge
  box(250, 128, 28, 56),
  box(220, 184, 120, 20),
  box(250, 248, 28, 72),

  // Lounge alcove under the kitchen, with a walkable gap beside it
  box(412, 72, 16, 36),
];

export const FURNITURE: Furniture[] = [
  // Conference
  item("oval-table", 42, 38, 58, 44),
  item("chair", 28, 42, 12, 12),
  item("chair", 28, 64, 12, 12),
  item("chair", 102, 42, 12, 12),
  item("chair", 102, 64, 12, 12),
  item("chair", 56, 24, 12, 12),
  item("chair", 74, 24, 12, 12),
  item("cooler", 100, 22, 10, 10),
  item("cooler", 22, 70, 10, 10),
  item("cabinet", 20, 20, 22, 10),
  item("plant", 22, 92, 10, 10, false),

  // Rec / gym
  item("rect-table", 268, 22, 36, 14),
  item("weights", 310, 22, 28, 14),
  item("pingpong", 300, 44, 34, 20),
  item("counter", 248, 24, 16, 28),
  item("cooler", 380, 28, 10, 10),
  item("cooler", 246, 78, 10, 10),
  item("cabinet", 248, 22, 16, 20),
  item("cabinet", 338, 84, 16, 12),
  item("plant", 236, 96, 10, 10, false),

  // Kitchen
  item("sink", 500, 20, 22, 16),
  item("counter", 448, 20, 48, 12),
  item("cooler", 440, 40, 10, 10),
  item("plant", 512, 44, 10, 10, false),

  // Cubicle farm — west office
  item("desk", 36, 140, 28, 16),
  item("chair", 42, 158, 12, 10),
  item("desk", 72, 140, 28, 16),
  item("chair", 78, 158, 12, 10),
  item("desk", 36, 176, 28, 16),
  item("chair", 42, 194, 12, 10),
  item("desk", 72, 176, 28, 16),
  item("chair", 78, 194, 12, 10),

  item("desk", 128, 148, 28, 16),
  item("chair", 134, 166, 12, 10),
  item("desk", 164, 148, 28, 16),
  item("chair", 170, 166, 12, 10),
  item("desk", 128, 184, 28, 16),
  item("chair", 134, 202, 12, 10),

  item("desk", 36, 230, 28, 16),
  item("chair", 42, 248, 12, 10),
  item("desk", 72, 230, 28, 16),
  item("chair", 78, 248, 12, 10),
  item("desk", 108, 230, 28, 16),
  item("chair", 114, 248, 12, 10),
  item("desk", 36, 266, 28, 16),
  item("chair", 42, 284, 12, 10),
  item("desk", 72, 266, 28, 16),
  item("chair", 78, 284, 12, 10),
  item("desk", 108, 266, 28, 16),
  item("chair", 114, 284, 12, 10),

  item("desk", 36, 312, 28, 16),
  item("chair", 42, 330, 12, 10),
  item("desk", 72, 312, 28, 16),
  item("chair", 78, 330, 12, 10),
  item("desk", 128, 312, 28, 16),
  item("chair", 134, 330, 12, 10),
  item("desk", 164, 312, 28, 16),
  item("chair", 170, 330, 12, 10),
  item("desk", 196, 268, 22, 14),
  item("chair", 200, 284, 12, 10),

  item("cooler", 22, 210, 10, 10),
  item("cooler", 188, 210, 10, 10),
  item("cooler", 22, 300, 10, 10),
  item("plant", 198, 230, 10, 10, false),
  item("plant", 150, 290, 10, 10, false),
  item("cabinet", 210, 148, 12, 22),

  // Lounge — couches, reception, meeting set
  item("couch", 300, 160, 36, 16),
  item("couch", 300, 196, 16, 34),
  item("coffee", 322, 184, 16, 12, false),
  item("couch", 360, 210, 34, 16),
  item("coffee", 368, 230, 16, 10, false),
  item("reception", 430, 150, 50, 16),
  item("reception", 464, 150, 16, 46),
  item("chair", 438, 170, 12, 10),
  item("couch", 490, 210, 18, 70),
  item("couch", 430, 300, 40, 16),
  item("coffee", 440, 280, 18, 12, false),
  item("rect-table", 350, 300, 28, 18),
  item("chair", 336, 304, 12, 10),
  item("chair", 380, 304, 12, 10),
  item("chair", 356, 286, 12, 10),
  item("chair", 356, 322, 12, 10),
  item("cooler", 400, 250, 10, 10),
  item("plant", 310, 250, 10, 10, false),
  item("plant", 500, 300, 10, 10, false),
  item("plant", 300, 330, 10, 10, false),
  item("cabinet", 300, 86, 14, 22),
  item("cabinet", 500, 86, 18, 12),
];

export const SOLIDS: Rect[] = [
  ...WALLS,
  ...FURNITURE.filter((f) => f.solid !== false && f.kind !== "chair").map(
    ({ x, y, w, h }) => {
      const pad = Math.min(28, Math.min(w, h) * 0.18);
      return {
        x: x + pad,
        y: y + pad,
        w: Math.max(12, w - pad * 2),
        h: Math.max(12, h - pad * 2),
      };
    },
  ),
];

export const SPAWNS = [
  box(26, 56, 1, 1),
  box(100, 210, 1, 1),
  box(286, 80, 1, 1),
  box(458, 48, 1, 1),
  box(400, 128, 1, 1),
  box(400, 248, 1, 1),
  box(50, 345, 1, 1),
  box(176, 168, 1, 1),
].map((r) => ({ x: r.x, y: r.y }));

export const WEAPON_SPAWNS: { weapon: WeaponId; x: number; y: number }[] = [
  { weapon: "shotgun", ...point(64, 78) },
  { weapon: "glock", ...point(160, 50) },
  { weapon: "ak47", ...point(90, 200) },
  { weapon: "bat", ...point(150, 300) },
  { weapon: "katana", ...point(290, 70) },
  { weapon: "sledge", ...point(500, 330) },
  { weapon: "railgun", ...point(470, 40) },
  { weapon: "flamethrower", ...point(400, 100) },
  { weapon: "chainsaw", ...point(320, 50) },
  { weapon: "lasersword", ...point(400, 200) },
  { weapon: "tesla", ...point(50, 250) },
  { weapon: "chaingun", ...point(510, 180) },
];

function point(x: number, y: number) {
  return { x: x * SCALE, y: y * SCALE };
}
