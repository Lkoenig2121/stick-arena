import type { Furniture, Rect, WeaponId } from "../types";
import {
  FURNITURE as LOBBY_FURNITURE,
  FLOORS as LOBBY_FLOORS,
  MAP_H,
  MAP_W,
  PLACE_NAME,
  SCALE,
  SOLIDS as LOBBY_SOLIDS,
  SPAWNS as LOBBY_SPAWNS,
  SRC_H,
  SRC_W,
  WALLS as LOBBY_WALLS,
  WEAPON_SPAWNS as LOBBY_WEAPONS,
} from "./lobby";

export { MAP_H, MAP_W, PLACE_NAME, SCALE, SRC_H, SRC_W };

export type ArenaMap = {
  name: string;
  wallColor: string;
  floors: (Rect & { color: string })[];
  walls: Rect[];
  furniture: Furniture[];
  solids: Rect[];
  spawns: { x: number; y: number }[];
  weapons: { weapon: WeaponId; x: number; y: number }[];
};

const WEAPON_IDS: WeaponId[] = [
  "shotgun",
  "glock",
  "ak47",
  "bat",
  "katana",
  "sledge",
  "railgun",
  "flamethrower",
  "chainsaw",
  "lasersword",
  "tesla",
  "chaingun",
];

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
  const edges: { side: "n" | "s" | "e" | "w"; x: number; y: number; w: number; h: number }[] = [
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

function point(x: number, y: number) {
  return { x: x * SCALE, y: y * SCALE };
}

function makeSolids(walls: Rect[], furniture: Furniture[]): Rect[] {
  return [
    ...walls,
    ...furniture
      .filter((piece) => piece.solid !== false && piece.kind !== "chair")
      .map(({ x, y, w, h }) => {
        const pad = Math.min(28, Math.min(w, h) * 0.18);
        return {
          x: x + pad,
          y: y + pad,
          w: Math.max(12, w - pad * 2),
          h: Math.max(12, h - pad * 2),
        };
      }),
  ];
}

function layout(
  name: string,
  wallColor: string,
  floors: (Rect & { color: string })[],
  walls: Rect[],
  furniture: Furniture[],
  spawns: [number, number][],
  weaponSpots: [number, number][],
): ArenaMap {
  return {
    name,
    wallColor,
    floors,
    walls,
    furniture,
    solids: makeSolids(walls, furniture),
    spawns: spawns.map(([x, y]) => point(x, y)),
    weapons: WEAPON_IDS.map((weapon, i) => {
      const spot = weaponSpots[i % weaponSpots.length];
      return { weapon, ...point(spot[0], spot[1]) };
    }),
  };
}

const T = 16;
const OUTER = wallsFromRoom(0, 0, SRC_W, SRC_H, T, []);

const lobby: ArenaMap = {
  name: PLACE_NAME,
  wallColor: "#efe8dc",
  floors: LOBBY_FLOORS,
  walls: LOBBY_WALLS,
  furniture: LOBBY_FURNITURE,
  solids: LOBBY_SOLIDS,
  spawns: LOBBY_SPAWNS,
  weapons: LOBBY_WEAPONS,
};

const foundation = layout(
  "The Foundation",
  "#c5c0b4",
  [
    { ...box(0, 0, SRC_W, SRC_H), color: "#6b6b6b" },
    { ...box(16, 16, 246, 152), color: "#7a7a7a" },
    { ...box(278, 16, 247, 152), color: "#5e5e5e" },
    { ...box(16, 184, 246, 169), color: "#555555" },
    { ...box(278, 184, 247, 169), color: "#6e6e6e" },
  ],
  [
    ...OUTER,
    box(262, 0, 16, 132),
    box(262, 228, 16, 141),
    box(0, 168, 190, 16),
    box(350, 168, 191, 16),
  ],
  [
    item("cabinet", 40, 36, 28, 40),
    item("cabinet", 80, 36, 28, 40),
    item("counter", 40, 90, 70, 16),
    item("cooler", 130, 36, 12, 12),
    item("rect-table", 320, 40, 50, 28),
    item("chair", 310, 48, 12, 12),
    item("chair", 372, 48, 12, 12),
    item("weights", 430, 36, 40, 16),
    item("cabinet", 40, 220, 22, 50),
    item("cabinet", 80, 220, 22, 50),
    item("cabinet", 40, 286, 22, 40),
    item("reception", 320, 230, 70, 18),
    item("chair", 340, 252, 12, 12),
    item("plant", 490, 220, 12, 12, false),
    item("plant", 30, 330, 12, 12, false),
  ],
  [
    [40, 60],
    [200, 80],
    [400, 70],
    [480, 40],
    [50, 250],
    [200, 300],
    [400, 280],
    [490, 330],
  ],
  [
    [60, 50],
    [200, 50],
    [400, 50],
    [500, 90],
    [50, 240],
    [200, 240],
    [400, 210],
    [500, 300],
    [120, 140],
    [300, 140],
    [80, 330],
    [450, 330],
  ],
);

const xgen = layout(
  "XGen HQ",
  "#dfe7f2",
  [
    { ...box(0, 0, SRC_W, SRC_H), color: "#d8e4f0" },
    { ...box(16, 148, 509, 72), color: "#c5d4e6" },
    { ...box(16, 16, 160, 132), color: "#eef4fb" },
    { ...box(190, 16, 160, 132), color: "#eef4fb" },
    { ...box(364, 16, 161, 132), color: "#eef4fb" },
    { ...box(16, 220, 160, 133), color: "#e8f0f8" },
    { ...box(190, 220, 160, 133), color: "#e8f0f8" },
    { ...box(364, 220, 161, 133), color: "#e8f0f8" },
  ],
  [
    ...OUTER,
    ...wallsFromRoom(0, 0, 176, 148, T, [
      { side: "n", start: 0, end: 176 },
      { side: "w", start: 0, end: 148 },
      { side: "s", start: 60, end: 116 },
    ]),
    ...wallsFromRoom(176, 0, 176, 148, T, [
      { side: "n", start: 0, end: 176 },
      { side: "s", start: 60, end: 116 },
    ]),
    ...wallsFromRoom(352, 0, 189, 148, T, [
      { side: "n", start: 0, end: 189 },
      { side: "e", start: 0, end: 148 },
      { side: "s", start: 70, end: 126 },
    ]),
    ...wallsFromRoom(0, 220, 176, 149, T, [
      { side: "s", start: 0, end: 176 },
      { side: "w", start: 0, end: 149 },
      { side: "n", start: 60, end: 116 },
    ]),
    ...wallsFromRoom(176, 220, 176, 149, T, [
      { side: "s", start: 0, end: 176 },
      { side: "n", start: 60, end: 116 },
    ]),
    ...wallsFromRoom(352, 220, 189, 149, T, [
      { side: "s", start: 0, end: 189 },
      { side: "e", start: 0, end: 149 },
      { side: "n", start: 70, end: 126 },
    ]),
  ],
  [
    item("oval-table", 50, 48, 70, 40),
    item("chair", 40, 56, 12, 12),
    item("chair", 118, 56, 12, 12),
    item("desk", 210, 36, 30, 16),
    item("chair", 216, 54, 12, 10),
    item("desk", 260, 36, 30, 16),
    item("chair", 266, 54, 12, 10),
    item("reception", 400, 40, 70, 18),
    item("chair", 424, 62, 12, 12),
    item("cooler", 490, 40, 12, 12),
    item("desk", 40, 250, 30, 16),
    item("chair", 46, 270, 12, 10),
    item("desk", 90, 250, 30, 16),
    item("chair", 96, 270, 12, 10),
    item("couch", 210, 260, 50, 18),
    item("coffee", 224, 286, 22, 12, false),
    item("rect-table", 400, 260, 40, 24),
    item("chair", 388, 266, 12, 12),
    item("chair", 442, 266, 12, 12),
    item("plant", 500, 300, 12, 12, false),
  ],
  [
    [70, 70],
    [250, 70],
    [450, 70],
    [80, 180],
    [270, 180],
    [450, 180],
    [70, 300],
    [270, 300],
  ],
  [
    [80, 40],
    [250, 40],
    [450, 40],
    [80, 180],
    [270, 180],
    [450, 180],
    [80, 300],
    [250, 300],
    [450, 300],
    [40, 180],
    [500, 180],
    [270, 90],
  ],
);

const office = layout(
  "Office Space",
  "#efe6d4",
  [
    { ...box(0, 0, SRC_W, SRC_H), color: "#dcc9a0" },
    { ...box(16, 16, 509, 337), color: "#e6d5b0" },
  ],
  [
    ...OUTER,
    box(170, 16, 12, 140),
    box(340, 16, 12, 140),
    box(170, 220, 12, 133),
    box(340, 220, 12, 133),
    box(16, 176, 140, 12),
    box(200, 176, 140, 12),
    box(380, 176, 145, 12),
  ],
  [
    item("desk", 36, 36, 28, 16),
    item("chair", 42, 54, 12, 10),
    item("desk", 80, 36, 28, 16),
    item("chair", 86, 54, 12, 10),
    item("desk", 36, 90, 28, 16),
    item("chair", 42, 108, 12, 10),
    item("desk", 80, 90, 28, 16),
    item("chair", 86, 108, 12, 10),
    item("desk", 200, 36, 28, 16),
    item("chair", 206, 54, 12, 10),
    item("desk", 244, 36, 28, 16),
    item("chair", 250, 54, 12, 10),
    item("desk", 200, 90, 28, 16),
    item("chair", 206, 108, 12, 10),
    item("desk", 244, 90, 28, 16),
    item("chair", 250, 108, 12, 10),
    item("desk", 370, 36, 28, 16),
    item("chair", 376, 54, 12, 10),
    item("desk", 414, 36, 28, 16),
    item("chair", 420, 54, 12, 10),
    item("cooler", 470, 36, 12, 12),
    item("plant", 500, 36, 12, 12, false),
    item("desk", 36, 220, 28, 16),
    item("chair", 42, 238, 12, 10),
    item("desk", 80, 220, 28, 16),
    item("chair", 86, 238, 12, 10),
    item("desk", 36, 280, 28, 16),
    item("chair", 42, 298, 12, 10),
    item("couch", 210, 250, 50, 18),
    item("coffee", 224, 276, 20, 12, false),
    item("reception", 390, 240, 70, 18),
    item("chair", 414, 262, 12, 12),
    item("cabinet", 480, 240, 20, 40),
  ],
  [
    [50, 70],
    [220, 70],
    [400, 70],
    [90, 150],
    [50, 260],
    [250, 200],
    [420, 280],
    [500, 330],
  ],
  [
    [50, 40],
    [220, 40],
    [400, 40],
    [90, 150],
    [250, 150],
    [450, 150],
    [50, 250],
    [220, 250],
    [400, 220],
    [500, 280],
    [120, 320],
    [300, 320],
  ],
);

const sunnyvale = layout(
  "Sunnyvale Trailer Park",
  "#c9a66b",
  [
    { ...box(0, 0, SRC_W, SRC_H), color: "#c4a06a" },
    { ...box(16, 16, 509, 337), color: "#d2b07a" },
    { ...box(210, 140, 120, 90), color: "#b8925c" },
  ],
  [
    ...OUTER,
    ...wallsFromRoom(24, 24, 150, 70, 12, [{ side: "s", start: 50, end: 100 }]),
    ...wallsFromRoom(360, 24, 150, 70, 12, [{ side: "s", start: 50, end: 100 }]),
    ...wallsFromRoom(24, 270, 150, 70, 12, [{ side: "n", start: 50, end: 100 }]),
    ...wallsFromRoom(360, 270, 150, 70, 12, [{ side: "n", start: 50, end: 100 }]),
    box(230, 40, 80, 36),
    box(230, 290, 80, 36),
  ],
  [
    item("couch", 44, 40, 40, 16),
    item("rect-table", 94, 40, 28, 16),
    item("couch", 380, 40, 40, 16),
    item("rect-table", 430, 40, 28, 16),
    item("couch", 44, 290, 40, 16),
    item("rect-table", 94, 290, 28, 16),
    item("couch", 380, 290, 40, 16),
    item("rect-table", 430, 290, 28, 16),
    item("cooler", 250, 50, 12, 12),
    item("plant", 40, 160, 14, 14, false),
    item("plant", 490, 160, 14, 14, false),
    item("plant", 260, 170, 14, 14, false),
    item("cabinet", 248, 300, 20, 20),
  ],
  [
    [90, 110],
    [430, 110],
    [90, 240],
    [430, 240],
    [270, 120],
    [270, 250],
    [40, 180],
    [500, 180],
  ],
  [
    [80, 70],
    [430, 70],
    [80, 300],
    [430, 300],
    [270, 90],
    [270, 260],
    [40, 180],
    [500, 180],
    [180, 180],
    [360, 180],
    [270, 40],
    [270, 330],
  ],
);

const graveyard = layout(
  "The Graveyard",
  "#6d6a5a",
  [
    { ...box(0, 0, SRC_W, SRC_H), color: "#3a4638" },
    { ...box(16, 16, 509, 337), color: "#445044" },
    { ...box(220, 140, 100, 80), color: "#2f382f" },
  ],
  [
    ...OUTER,
    box(120, 80, 16, 90),
    box(400, 80, 16, 90),
    box(120, 210, 16, 90),
    box(400, 210, 16, 90),
    box(180, 160, 70, 16),
    box(290, 160, 70, 16),
  ],
  [
    item("cabinet", 40, 40, 14, 22),
    item("cabinet", 70, 40, 14, 22),
    item("cabinet", 40, 80, 14, 22),
    item("cabinet", 460, 40, 14, 22),
    item("cabinet", 490, 40, 14, 22),
    item("cabinet", 460, 80, 14, 22),
    item("cabinet", 40, 280, 14, 22),
    item("cabinet", 70, 280, 14, 22),
    item("cabinet", 460, 280, 14, 22),
    item("cabinet", 490, 280, 14, 22),
    item("rect-table", 240, 168, 60, 24),
    item("plant", 200, 40, 14, 14, false),
    item("plant", 330, 40, 14, 14, false),
    item("plant", 200, 310, 14, 14, false),
    item("plant", 330, 310, 14, 14, false),
    item("cooler", 250, 40, 12, 12),
  ],
  [
    [50, 140],
    [250, 70],
    [480, 140],
    [50, 240],
    [250, 250],
    [480, 240],
    [180, 180],
    [360, 180],
  ],
  [
    [50, 50],
    [250, 50],
    [480, 50],
    [50, 180],
    [250, 130],
    [480, 180],
    [50, 310],
    [250, 310],
    [480, 310],
    [180, 220],
    [360, 220],
    [270, 200],
  ],
);

const warehouse = layout(
  "Warehouse",
  "#b9a48a",
  [
    { ...box(0, 0, SRC_W, SRC_H), color: "#8d7358" },
    { ...box(16, 16, 509, 337), color: "#9a8064" },
    { ...box(16, 16, 509, 50), color: "#6e5844" },
  ],
  [
    ...OUTER,
    box(110, 80, 18, 250),
    box(250, 80, 18, 250),
    box(390, 80, 18, 250),
  ],
  [
    item("cabinet", 40, 90, 28, 40),
    item("cabinet", 40, 150, 28, 40),
    item("cabinet", 40, 210, 28, 40),
    item("cabinet", 150, 90, 28, 40),
    item("cabinet", 150, 150, 28, 40),
    item("cabinet", 150, 210, 28, 40),
    item("cabinet", 290, 90, 28, 40),
    item("cabinet", 290, 150, 28, 40),
    item("cabinet", 290, 210, 28, 40),
    item("cabinet", 430, 90, 28, 40),
    item("cabinet", 430, 150, 28, 40),
    item("cabinet", 430, 210, 28, 40),
    item("counter", 200, 30, 140, 16),
    item("cooler", 360, 30, 12, 12),
    item("plant", 500, 30, 12, 12, false),
  ],
  [
    [80, 50],
    [200, 50],
    [340, 50],
    [480, 50],
    [80, 300],
    [200, 300],
    [340, 300],
    [480, 300],
  ],
  [
    [70, 50],
    [200, 50],
    [340, 50],
    [480, 50],
    [70, 180],
    [200, 180],
    [340, 180],
    [480, 180],
    [70, 320],
    [200, 320],
    [340, 320],
    [480, 320],
  ],
);

const sewers = layout(
  "Sewers",
  "#5a6a58",
  [
    { ...box(0, 0, SRC_W, SRC_H), color: "#2f3a30" },
    { ...box(16, 148, 509, 72), color: "#3d4c3e" },
    { ...box(148, 16, 72, 337), color: "#3d4c3e" },
    { ...box(320, 16, 72, 337), color: "#3d4c3e" },
    { ...box(16, 16, 120, 120), color: "#354336" },
    { ...box(404, 16, 120, 120), color: "#354336" },
    { ...box(16, 232, 120, 120), color: "#354336" },
    { ...box(404, 232, 120, 120), color: "#354336" },
  ],
  [
    ...OUTER,
    box(120, 16, 16, 50),
    box(120, 98, 16, 50),
    box(404, 16, 16, 50),
    box(404, 98, 16, 50),
    box(120, 220, 16, 50),
    box(120, 303, 16, 50),
    box(404, 220, 16, 50),
    box(404, 303, 16, 50),
    box(16, 132, 44, 16),
    box(92, 132, 44, 16),
    box(404, 132, 44, 16),
    box(481, 132, 44, 16),
    box(16, 220, 44, 16),
    box(92, 220, 44, 16),
    box(404, 220, 44, 16),
    box(481, 220, 44, 16),
  ],
  [
    item("cabinet", 40, 40, 20, 28),
    item("cabinet", 460, 40, 20, 28),
    item("cabinet", 40, 280, 20, 28),
    item("cabinet", 460, 280, 20, 28),
    item("cooler", 250, 40, 12, 12),
    item("cooler", 250, 310, 12, 12),
    item("plant", 180, 180, 12, 12, false),
    item("plant", 350, 180, 12, 12, false),
  ],
  [
    [60, 80],
    [250, 80],
    [470, 80],
    [60, 180],
    [250, 180],
    [470, 180],
    [60, 300],
    [470, 300],
  ],
  [
    [50, 50],
    [250, 50],
    [480, 50],
    [50, 180],
    [250, 180],
    [480, 180],
    [50, 310],
    [250, 310],
    [480, 310],
    [180, 90],
    [360, 90],
    [180, 270],
  ],
);

const desert = layout(
  "Desert Outpost",
  "#d7b07a",
  [
    { ...box(0, 0, SRC_W, SRC_H), color: "#d8b57a" },
    { ...box(16, 16, 509, 337), color: "#e2c38a" },
    { ...box(200, 140, 140, 90), color: "#c9a66c" },
  ],
  [
    ...OUTER,
    ...wallsFromRoom(24, 24, 140, 100, 14, [{ side: "e", start: 30, end: 70 }]),
    ...wallsFromRoom(380, 24, 136, 100, 14, [{ side: "w", start: 30, end: 70 }]),
    ...wallsFromRoom(24, 244, 140, 100, 14, [{ side: "e", start: 30, end: 70 }]),
    ...wallsFromRoom(380, 244, 136, 100, 14, [{ side: "w", start: 30, end: 70 }]),
  ],
  [
    item("rect-table", 50, 48, 40, 24),
    item("chair", 40, 54, 12, 12),
    item("chair", 92, 54, 12, 12),
    item("cabinet", 410, 48, 24, 36),
    item("cooler", 450, 48, 12, 12),
    item("couch", 50, 280, 44, 18),
    item("weights", 410, 280, 40, 16),
    item("plant", 250, 40, 16, 16, false),
    item("plant", 280, 300, 16, 16, false),
    item("plant", 250, 170, 16, 16, false),
  ],
  [
    [90, 90],
    [450, 90],
    [90, 280],
    [450, 280],
    [270, 80],
    [270, 280],
    [180, 180],
    [360, 180],
  ],
  [
    [70, 50],
    [450, 50],
    [70, 300],
    [450, 300],
    [270, 50],
    [270, 320],
    [180, 180],
    [360, 180],
    [270, 140],
    [270, 230],
    [40, 180],
    [500, 180],
  ],
);

const pit = layout(
  "The Pit",
  "#6a3a3a",
  [
    { ...box(0, 0, SRC_W, SRC_H), color: "#3a2a2a" },
    { ...box(16, 16, 509, 337), color: "#4a3232" },
    { ...box(180, 110, 180, 150), color: "#2c1c1c" },
  ],
  [
    ...OUTER,
    box(160, 90, 80, 18),
    box(300, 90, 80, 18),
    box(160, 260, 80, 18),
    box(300, 260, 80, 18),
    box(140, 108, 18, 70),
    box(382, 108, 18, 70),
    box(140, 200, 18, 60),
    box(382, 200, 18, 60),
  ],
  [
    item("oval-table", 230, 150, 80, 70),
    item("cabinet", 40, 40, 20, 28),
    item("cabinet", 480, 40, 20, 28),
    item("cabinet", 40, 300, 20, 28),
    item("cabinet", 480, 300, 20, 28),
    item("weights", 40, 160, 36, 16),
    item("weights", 460, 160, 36, 16),
    item("cooler", 250, 40, 12, 12),
    item("cooler", 250, 310, 12, 12),
  ],
  [
    [50, 80],
    [490, 80],
    [50, 280],
    [490, 280],
    [200, 50],
    [340, 50],
    [200, 320],
    [340, 320],
  ],
  [
    [50, 50],
    [490, 50],
    [50, 320],
    [490, 320],
    [200, 50],
    [340, 50],
    [200, 320],
    [340, 320],
    [80, 180],
    [460, 180],
    [270, 80],
    [270, 280],
  ],
);

export const ARENA_MAPS: ArenaMap[] = [
  lobby,
  foundation,
  xgen,
  office,
  sunnyvale,
  graveyard,
  warehouse,
  sewers,
  desert,
  pit,
];

const BY_NAME = Object.fromEntries(ARENA_MAPS.map((map) => [map.name, map]));

let active = lobby;

export function getMap(name: string) {
  return BY_NAME[name] ?? lobby;
}

export function currentMap() {
  return active;
}

export function setActiveMap(name: string) {
  active = getMap(name);
  return active;
}
