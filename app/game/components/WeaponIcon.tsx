import type { WeaponId } from "../types";

export function WeaponIcon({ weapon, className = "" }: { weapon: WeaponId; className?: string }) {
  return (
    <svg viewBox="0 0 80 48" className={className} aria-hidden>
      {glyph(weapon)}
    </svg>
  );
}

function glyph(weapon: WeaponId) {
  switch (weapon) {
    case "fists":
      return (
        <g fill="#f0c8a0" stroke="#222" strokeWidth="2">
          <circle cx="28" cy="26" r="10" />
          <circle cx="50" cy="28" r="10" />
        </g>
      );
    case "bat":
      return (
        <g>
          <path d="M12 36 L68 12" stroke="#8b5a2b" strokeWidth="6" strokeLinecap="round" />
          <circle cx="68" cy="12" r="5" fill="#6b3f1a" />
        </g>
      );
    case "katana":
      return (
        <g>
          <path d="M16 34 L72 10" stroke="#dfe7ef" strokeWidth="4" />
          <path d="M10 38 L22 30" stroke="#222" strokeWidth="5" />
          <path d="M18 34 L26 28" stroke="#b03a2e" strokeWidth="3" />
        </g>
      );
    case "glock":
      return (
        <g fill="#1a1a1a">
          <rect x="22" y="16" width="40" height="8" rx="2" />
          <rect x="24" y="24" width="10" height="16" rx="1" />
        </g>
      );
    case "ak47":
      return (
        <g>
          <rect x="8" y="18" width="56" height="8" fill="#2b2b2b" />
          <rect x="18" y="26" width="8" height="14" fill="#2b2b2b" />
          <rect x="40" y="26" width="16" height="6" fill="#4a3728" />
        </g>
      );
    case "shotgun":
      return (
        <g>
          <rect x="10" y="18" width="48" height="8" fill="#3b2a1a" />
          <rect x="46" y="16" width="22" height="12" fill="#222" />
          <rect x="20" y="26" width="8" height="12" fill="#222" />
        </g>
      );
    case "sledge":
      return (
        <g>
          <path d="M18 36 L46 16" stroke="#5c4033" strokeWidth="6" />
          <rect x="42" y="6" width="22" height="16" fill="#2c2c2c" />
        </g>
      );
    case "flamethrower":
      return (
        <g>
          <rect x="22" y="18" width="36" height="8" fill="#444" />
          <circle cx="20" cy="30" r="10" fill="#c0392b" />
          <path d="M58 16 L74 22 L58 28 Z" fill="#f39c12" />
        </g>
      );
    case "railgun":
      return (
        <g>
          <rect x="6" y="18" width="64" height="9" fill="#1f3a5f" />
          <rect x="36" y="20" width="32" height="4" fill="#7fdbff" />
          <rect x="16" y="27" width="8" height="12" fill="#1f3a5f" />
        </g>
      );
    case "chainsaw":
      return (
        <g>
          <rect x="12" y="16" width="22" height="16" fill="#f39c12" />
          <rect x="32" y="18" width="34" height="10" fill="#bbb" />
        </g>
      );
    case "lasersword":
      return (
        <g>
          <path d="M18 34 L68 10" stroke="#39ff14" strokeWidth="5" />
          <path d="M12 38 L22 30" stroke="#222" strokeWidth="6" />
        </g>
      );
    case "tesla":
      return (
        <g>
          <circle cx="36" cy="24" r="12" fill="#555" stroke="#222" />
          <path d="M46 16 L62 8 M48 24 L66 24" stroke="#7fdbff" strokeWidth="3" />
        </g>
      );
    case "chaingun":
      return (
        <g fill="#333">
          <rect x="14" y="14" width="24" height="18" />
          <rect x="38" y="14" width="28" height="4" />
          <rect x="38" y="21" width="28" height="4" />
          <rect x="38" y="28" width="28" height="4" />
        </g>
      );
  }
}
