import { RANK_TIERS } from "./progress";

export function RankBadge({ rank, size = 16 }: { rank: number; size?: number }) {
  const shown = Math.max(1, rank);
  const fill = RANK_TIERS.find((tier) => tier.rank === shown)?.fill ?? "#e8c030";
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden style={{ flexShrink: 0 }}>
      {shown >= 7 && <ellipse cx="10" cy="11" rx="8" ry="6.5" fill="none" stroke="#2a1c08" strokeWidth="1" />}
      <path
        d="M3.8 4.2 L5.6 12.2 Q10 14.4 14.4 12.2 L16.2 4.2 Z"
        fill={fill}
        stroke="#2a1c08"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <ellipse cx="10" cy="4" rx="6.2" ry="1.6" fill={fill} stroke="#2a1c08" strokeWidth="1" />
      <path d="M3.6 6.2 A2.7 2.7 0 0 0 5.2 10.4" fill="none" stroke="#2a1c08" strokeWidth="1.2" />
      <path d="M16.4 6.2 A2.7 2.7 0 0 1 14.8 10.4" fill="none" stroke="#2a1c08" strokeWidth="1.2" />
      <rect x="8.9" y="12.2" width="2.2" height="2.8" fill={fill} stroke="#2a1c08" strokeWidth="0.8" />
      <rect x="6.6" y="15" width="6.8" height="1.2" fill={fill} stroke="#2a1c08" strokeWidth="0.8" />
      <rect x="5.6" y="16.2" width="8.8" height="1.6" fill={fill} stroke="#2a1c08" strokeWidth="0.8" />
      {shown >= 3 && (
        <path d="M10 1.2 L10.7 2.8 L12.5 2.8 L11.1 3.8 L11.6 5.5 L10 4.6 L8.4 5.5 L8.9 3.8 L7.5 2.8 L9.3 2.8 Z" fill="#fff4b0" />
      )}
      {shown >= 9 && <path d="M6.6 2.4 L10 0.4 L13.4 2.4 Z" fill={fill} stroke="#2a1c08" strokeWidth="0.7" />}
    </svg>
  );
}
