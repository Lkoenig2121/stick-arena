export const BOT_NAMES = [
  "Goodpeterson",
  "StenkyClodfoot",
  "HotT",
  "TriggerClan",
  "Snarr",
  "xXKatanaXx",
  "Buckshot",
  "LobbyLurker",
];

export const GUEST_PREFIXES = [
  "Guest",
  "Stick",
  "Rookie",
  "Office",
  "Cubicle",
];

export function randomGuestName() {
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `Guest${n}`;
}
