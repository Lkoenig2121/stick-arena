import { WEAPONS } from "../data/weapons";
import type { HudSnapshot } from "../types";
import { WeaponIcon } from "./WeaponIcon";

export function Hud({ ui }: { ui: HudSnapshot }) {
  const healthPct = Math.max(0, (ui.health / ui.maxHealth) * 100);
  const minutes = Math.floor(ui.timeLeft / 60);
  const seconds = Math.floor(ui.timeLeft % 60)
    .toString()
    .padStart(2, "0");

  return (
    <div className="pointer-events-none absolute inset-0 z-10 font-[Nunito,sans-serif] select-none">
      <div className="absolute top-3 left-4 flex items-center gap-3">
        <Heart />
        <div className="h-[18px] w-80 overflow-hidden rounded-full border-2 border-white bg-white/70 shadow-[0_1px_0_rgba(0,0,0,0.25)]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${healthPct}%`,
              background: "linear-gradient(180deg, #ff6b6b 0%, #e11d2a 55%, #b71c1c 100%)",
            }}
          />
        </div>
      </div>

      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-center">
        <div className="text-[28px] font-extrabold tracking-tight text-black drop-shadow-[0_1px_0_#fff]">
          {ui.place}
        </div>
        <div className="text-sm font-bold text-black/70">
          {ordinal(ui.rank)}
        </div>
      </div>

      <div className="absolute top-2 right-4 flex flex-col items-end">
        <WeaponIcon weapon={ui.weapon} className="h-14 w-24 drop-shadow-md" />
        <div className="mt-0.5 text-xs font-extrabold tracking-wide text-black/80">
          {WEAPONS[ui.weapon].name.toUpperCase()}
        </div>
      </div>

      <div className="absolute top-16 left-4 flex max-w-xl flex-col gap-0.5">
        {ui.feed.map((line) => (
          <p
            key={line.id}
            className="text-[15px] font-extrabold tracking-wide text-black drop-shadow-[0_1px_0_#fff]"
          >
            {line.text.toUpperCase()}
          </p>
        ))}
      </div>

      {ui.scoreboard && (
        <div className="absolute top-1/2 left-1/2 w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/80 px-8 py-6 shadow-xl backdrop-blur-sm">
          <h2 className="mb-3 text-center text-2xl font-black tracking-[0.2em] text-black">
            LEADERBOARD
          </h2>
          <div className="mb-2 grid grid-cols-[72px_1fr_72px_88px] text-xs font-black tracking-widest text-black/70">
            <span>RANK</span>
            <span>PLAYER</span>
            <span className="text-right">KILLS</span>
            <span className="text-right">DEATHS</span>
          </div>
          <div className="space-y-1">
            {ui.players.map((player, i) => (
              <div
                key={player.id}
                className={`grid grid-cols-[72px_1fr_72px_88px] items-center text-[15px] font-extrabold ${
                  player.you ? "text-black" : "text-black/80"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Medal rank={i + 1} />
                  {ordinal(i + 1).toUpperCase()}
                </span>
                <span className="truncate" style={{ color: player.you ? "#111" : player.color }}>
                  {player.name}
                </span>
                <span className="text-right">{player.kills}</span>
                <span className="text-right">{player.deaths}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-5xl font-black tabular-nums text-black">
            {minutes}:{seconds}
          </div>
        </div>
      )}

      <div className="absolute right-4 bottom-4 text-right text-[13px] font-extrabold leading-tight text-black drop-shadow-[0_1px_0_#fff]">
        <div>{ui.fps} FPS</div>
        <div>PING: {ui.ping} / 150</div>
      </div>

      <div className="absolute bottom-4 left-[260px] text-[12px] font-bold text-black/55">
        WASD move · mouse aim · click attack · Shift scoreboard · Esc leave
      </div>
    </div>
  );
}

function Heart() {
  return (
    <svg viewBox="0 0 32 28" className="h-7 w-8 drop-shadow-sm" aria-hidden>
      <path
        d="M16 26C16 26 2 16.2 2 9.2 2 4.8 5.4 2 9.2 2c2.6 0 4.8 1.4 6.8 3.6C18 3.4 20.2 2 22.8 2 26.6 2 30 4.8 30 9.2 30 16.2 16 26 16 26Z"
        fill="#ff4d86"
        stroke="#c2185b"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function Medal({ rank }: { rank: number }) {
  const fill = rank === 1 ? "#f4c430" : rank === 2 ? "#c0c0c0" : rank === 3 ? "#cd7f32" : "transparent";
  if (rank > 3) return <span className="inline-block w-3.5" />;
  return (
    <span
      className="inline-block h-3.5 w-3.5 rounded-full border border-black/20"
      style={{ background: fill }}
    />
  );
}

function ordinal(n: number) {
  const k = n % 10;
  const t = n % 100;
  if (k === 1 && t !== 11) return `${n}st`;
  if (k === 2 && t !== 12) return `${n}nd`;
  if (k === 3 && t !== 13) return `${n}rd`;
  return `${n}th`;
}
