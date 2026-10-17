export function TitleSticks() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Stick x="8%" y="22%" pose="bat" />
      <Stick x="22%" y="58%" pose="foil" />
      <Stick x="78%" y="20%" pose="pistol" />
      <Stick x="70%" y="62%" pose="angry" />
      <Stick x="88%" y="70%" pose="shotgun" />
      <div className="absolute top-[18%] right-[18%] h-16 w-1 rounded bg-[#222]" />
    </div>
  );
}

function Stick({
  x,
  y,
  pose,
}: {
  x: string;
  y: string;
  pose: "bat" | "foil" | "pistol" | "angry" | "shotgun";
}) {
  return (
    <svg
      viewBox="0 0 80 90"
      className="absolute h-36 w-32"
      style={{ left: x, top: y }}
      aria-hidden
    >
      <circle cx="40" cy="16" r="10" fill="#111" />
      {pose === "angry" && (
        <>
          <path d="M34 13 L38 15" stroke="#fff" strokeWidth="1.6" />
          <path d="M46 13 L42 15" stroke="#fff" strokeWidth="1.6" />
        </>
      )}
      <path d="M40 26 L40 52" stroke="#111" strokeWidth="5" />
      <path d="M40 52 L28 78 M40 52 L52 78" stroke="#111" strokeWidth="5" />
      {pose === "bat" && (
        <>
          <path d="M40 34 L18 18" stroke="#111" strokeWidth="5" />
          <path d="M40 34 L58 48" stroke="#111" strokeWidth="5" />
          <path d="M16 8 L22 28" stroke="#c4a574" strokeWidth="5" />
        </>
      )}
      {pose === "foil" && (
        <>
          <path d="M40 34 L28 22" stroke="#111" strokeWidth="5" />
          <path d="M40 34 L62 14" stroke="#111" strokeWidth="5" />
          <path d="M62 14 L70 4" stroke="#cbd5e1" strokeWidth="2" />
        </>
      )}
      {pose === "pistol" && (
        <>
          <path d="M40 34 L22 40" stroke="#111" strokeWidth="5" />
          <path d="M40 34 L58 28" stroke="#111" strokeWidth="5" />
          <path d="M58 24 L72 22" stroke="#222" strokeWidth="4" />
        </>
      )}
      {pose === "angry" && (
        <>
          <path d="M40 34 L22 48" stroke="#111" strokeWidth="5" />
          <path d="M40 34 L60 48" stroke="#111" strokeWidth="5" />
        </>
      )}
      {pose === "shotgun" && (
        <>
          <path d="M40 34 L24 44" stroke="#111" strokeWidth="5" />
          <path d="M40 34 L70 44" stroke="#111" strokeWidth="5" />
          <path d="M58 40 L86 48" stroke="#3b2a1a" strokeWidth="6" />
        </>
      )}
    </svg>
  );
}
