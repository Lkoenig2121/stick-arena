export type LobbyPlayer = {
  name: string;
  color: string;
};

export type ArenaRoom = {
  id: string;
  name: string;
  map: string;
  mode: string;
  maxPlayers: number;
  timeLeft: string;
  players: LobbyPlayer[];
};

export type ChatLine = {
  id: number;
  name: string;
  color: string;
  text: string;
};

export const SERVERS = ["Paperthin City", "Newgrounds", "XGen HQ", "Ballistick"];

export const MAPS = [
  "The Lobby",
  "The Foundation",
  "XGen HQ",
  "Office Space",
  "Sunnyvale Trailer Park",
  "The Graveyard",
  "Warehouse",
  "Sewers",
  "Desert Outpost",
  "The Pit",
];

export const MODES = ["Deathmatch", "Random", "Team"];

export function randomMap() {
  return MAPS[Math.floor(Math.random() * MAPS.length)];
}

export function randomMode() {
  return MODES[Math.floor(Math.random() * MODES.length)];
}

function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function fillRoomPlayers(host: LobbyPlayer, maxPlayers = 6): LobbyPlayer[] {
  const pool = shuffle(ONLINE.filter((player) => player.name !== host.name));
  const extras = Math.min(maxPlayers - 1, 3 + Math.floor(Math.random() * 3));
  return [host, ...pool.slice(0, extras)];
}

export const ONLINE: LobbyPlayer[] = [
  { name: ".GEAR.FIRE.", color: "#9cff9c" },
  { name: "NYCOLIVER", color: "#8cffff" },
  { name: "HOTT5", color: "#ffff6e" },
  { name: "$XIPRINCESS$", color: "#ffb8ff" },
  { name: "SOULJARBOY", color: "#b8e4ff" },
  { name: "Goodpeterson", color: "#9cff9c" },
  { name: "Snarr", color: "#ffb86a" },
  { name: "TriggerClan", color: "#e0e0e0" },
];

function room(
  id: string,
  name: string,
  maxPlayers: number,
  timeLeft: string,
  players: LobbyPlayer[],
): ArenaRoom {
  return {
    id,
    name,
    map: randomMap(),
    mode: randomMode(),
    maxPlayers,
    timeLeft,
    players,
  };
}

export const ROOMS: ArenaRoom[] = [
  room("open-1", "public mix", 6, "4:21", [
    { name: "Goodpeterson", color: "#9cff9c" },
    { name: "TriggerClan", color: "#e0e0e0" },
  ]),
  room("open-2", "quickstart-88", 4, "4:52", [{ name: ".GEAR.FIRE.", color: "#9cff9c" }]),
  room("open-3", "XGen Scrims", 8, "3:18", [
    { name: "Snarr", color: "#ffb86a" },
    { name: "HOTT5", color: "#ffff6e" },
    { name: "NYCOLIVER", color: "#8cffff" },
    { name: "SOULJARBOY", color: "#b8e4ff" },
  ]),
  room("open-4", "cubicle carnage", 6, "5:00", [
    { name: "$XIPRINCESS$", color: "#ffb8ff" },
    { name: "StenkyClodfoot", color: "#ffd18a" },
  ]),
  room("open-5", "trailer park", 8, "2:44", [{ name: "Buckshot", color: "#ffa8a8" }]),
  room("open-6", "graveyard run", 6, "4:05", [
    { name: "NYCOLIVER", color: "#8cffff" },
    { name: "Snarr", color: "#ffb86a" },
  ]),
];

export const OPENING_CHAT: Omit<ChatLine, "id">[] = [
  { name: "SYSTEM", color: "#335577", text: "Logged into Paperthin City." },
  { name: "ItalyGirl95", color: "#2266aa", text: "im head cheerleader!" },
  { name: "ShadowNut", color: "#2266aa", text: "hi hello" },
  { name: "Riomaster", color: "#2266aa", text: "lololol" },
  { name: "$XIPRINCESS$", color: "#d9a6ff", text: "hey boys" },
  { name: "HOTT5", color: "#ffe56a", text: "who wants a tournament?!" },
  { name: "Snarr", color: "#ffb36b", text: "sledge is in the lounge on The Lobby" },
];

export const AI_LINES = [
  "anyone joining The Lobby?",
  "railgun is broken in a good way",
  "gg that last round",
  "who has the sledge",
  "quick start is laggy for me",
  "need 1 more for XGen Scrims",
  "katana only challenge?",
  "im going for shotgun first",
  "dont camp the conference table",
  "host a private if you want",
  "this map is huge, use the minimap",
  "i keep getting flattened",
  "glhf",
  "nice shot",
  "lag spike",
  "create a game on Office Space",
  "paperthin city is the one",
  "how do you drop the bat",
  "shift for scoreboard",
  "im 1st right now",
  "tournament after this round?",
  "the kitchen is a death trap",
  "coming in",
  "wait for me",
];
