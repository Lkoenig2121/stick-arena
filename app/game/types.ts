export type WeaponId =
  | "fists"
  | "bat"
  | "katana"
  | "glock"
  | "ak47"
  | "shotgun"
  | "sledge"
  | "flamethrower"
  | "railgun"
  | "chainsaw"
  | "lasersword"
  | "tesla"
  | "chaingun";

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type FurnitureKind =
  | "desk"
  | "chair"
  | "oval-table"
  | "rect-table"
  | "couch"
  | "coffee"
  | "reception"
  | "counter"
  | "pingpong"
  | "weights"
  | "cooler"
  | "plant"
  | "cabinet"
  | "sink";

export type Furniture = Rect & {
  kind: FurnitureKind;
  rotation?: number;
  solid?: boolean;
};

export type WeaponDef = {
  id: WeaponId;
  name: string;
  ranged: boolean;
  damage: number;
  reload: number;
  speed: number;
  automatic: boolean;
  spread: number;
  pellets: number;
  bulletSpeed: number;
  range: number;
  meleeReach: number;
  killVerb: string;
  killFlavor: string;
};

export type Player = {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  angle: number;
  health: number;
  maxHealth: number;
  weapon: WeaponId;
  cooldown: number;
  isBot: boolean;
  dead: boolean;
  deathTimer: number;
  spawnGuard: number;
  kills: number;
  deaths: number;
  walkPhase: number;
  attackFlash: number;
  targetId: string | null;
  aiTimer: number;
  aiStrafe: number;
  aiLunge: number;
  aiPath: { x: number; y: number }[];
  aiPathAge: number;
};

export type GroundWeapon = {
  id: string;
  weapon: WeaponId;
  x: number;
  y: number;
  hiddenUntil: number;
};

export type Projectile = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  damage: number;
  ownerId: string;
  kind: "bullet" | "pellet" | "flame" | "rail";
  length?: number;
  ox?: number;
  oy?: number;
};

export type SlamFx = {
  x: number;
  y: number;
  angle: number;
  age: number;
  life: number;
};

export type BloodSplat = {
  x: number;
  y: number;
  spots: { dx: number; dy: number; r: number }[];
  life: number;
};

export type KillEvent = {
  id: number;
  text: string;
  age: number;
};

export type HudSnapshot = {
  health: number;
  maxHealth: number;
  weapon: WeaponId;
  place: string;
  rank: number;
  timeLeft: number;
  fps: number;
  ping: number;
  scoreboard: boolean;
  players: {
    id: string;
    name: string;
    color: string;
    kills: number;
    deaths: number;
    you: boolean;
  }[];
  feed: { id: number; text: string }[];
};
