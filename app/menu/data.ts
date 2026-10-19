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

export const ROOMS: ArenaRoom[] = [
  {
    id: "lobby",
    name: "The Lobby",
    map: "The Lobby",
    mode: "Deathmatch",
    maxPlayers: 6,
    timeLeft: "4:21",
    players: [
      { name: "Goodpeterson", color: "#9cff9c" },
      { name: "TriggerClan", color: "#e0e0e0" },
    ],
  },
  {
    id: "foundation",
    name: "quickstart-88",
    map: "The Foundation",
    mode: "Random",
    maxPlayers: 4,
    timeLeft: "4:52",
    players: [{ name: ".GEAR.FIRE.", color: "#9cff9c" }],
  },
  {
    id: "xgen",
    name: "XGen Scrims",
    map: "XGen HQ",
    mode: "Deathmatch",
    maxPlayers: 8,
    timeLeft: "3:18",
    players: [
      { name: "Snarr", color: "#ffb86a" },
      { name: "HOTT5", color: "#ffff6e" },
      { name: "NYCOLIVER", color: "#8cffff" },
      { name: "SOULJARBOY", color: "#b8e4ff" },
    ],
  },
  {
    id: "office",
    name: "cubicle carnage",
    map: "Office Space",
    mode: "Deathmatch",
    maxPlayers: 6,
    timeLeft: "5:00",
    players: [
      { name: "$XIPRINCESS$", color: "#ffb8ff" },
      { name: "StenkyClodfoot", color: "#ffd18a" },
    ],
  },
  {
    id: "sunnyvale",
    name: "trailer park",
    map: "Sunnyvale Trailer Park",
    mode: "Team",
    maxPlayers: 8,
    timeLeft: "2:44",
    players: [{ name: "Buckshot", color: "#ffa8a8" }],
  },
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
