export type Progress = {
  kills: number;
};

export type RankInfo = {
  rank: number;
  kills: number;
  nextKills: number | null;
  fill: string;
};

export type MatchRankResult = Progress & {
  rank: number;
  previousRank: number;
  rankedUp: boolean;
  killsGained: number;
};

const KEY = "stick-arena-progress";

export const RANK_TIERS: { rank: number; kills: number; fill: string }[] = [
  { rank: 0, kills: 0, fill: "#e8c030" },
  { rank: 1, kills: 5, fill: "#e8c030" },
  { rank: 2, kills: 20, fill: "#c8c8c8" },
  { rank: 3, kills: 80, fill: "#e8c030" },
  { rank: 4, kills: 300, fill: "#f0c420" },
  { rank: 5, kills: 750, fill: "#f5cc22" },
  { rank: 6, kills: 2000, fill: "#f0b800" },
  { rank: 7, kills: 5000, fill: "#e8b000" },
  { rank: 8, kills: 10000, fill: "#e0a800" },
  { rank: 9, kills: 20000, fill: "#d4a000" },
];

export function rankFromKills(kills: number) {
  let rank = 0;
  for (const tier of RANK_TIERS) {
    if (kills >= tier.kills) rank = tier.rank;
  }
  return rank;
}

export function rankInfo(kills: number): RankInfo {
  const rank = rankFromKills(kills);
  const current = RANK_TIERS.find((tier) => tier.rank === rank);
  const next = RANK_TIERS.find((tier) => tier.rank === rank + 1);
  return {
    rank,
    kills,
    nextKills: next?.kills ?? null,
    fill: current?.fill ?? "#9a9a9a",
  };
}

export function loadProgress(): Progress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { kills: 0 };
    const parsed = JSON.parse(raw) as Progress & { xp?: number; level?: number };
    if (typeof parsed.kills === "number") return { kills: Math.max(0, parsed.kills) };
    if (typeof parsed.level === "number") return { kills: Math.max(0, (parsed.level - 1) * 5) };
    return { kills: 0 };
  } catch {
    return { kills: 0 };
  }
}

export function saveProgress(progress: Progress) {
  window.localStorage.setItem(KEY, JSON.stringify(progress));
}

export function applyMatchKills(current: Progress, killsGained: number): MatchRankResult {
  const previousRank = rankFromKills(current.kills);
  const next = { kills: current.kills + Math.max(0, killsGained) };
  saveProgress(next);
  const rank = rankFromKills(next.kills);
  return { ...next, rank, previousRank, rankedUp: rank > previousRank, killsGained };
}

export function botRank(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const roll = hash % 100;
  if (roll > 96) return 5;
  if (roll > 88) return 4;
  if (roll > 72) return 3;
  if (roll > 48) return 2;
  if (roll > 18) return 1;
  return 0;
}
