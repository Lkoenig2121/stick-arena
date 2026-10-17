import type { ReactNode } from "react";
import { TitleSticks } from "./StickArt";

export function TitleScreen({
  onQuickStart,
  onLogin,
  onCreate,
  onHowTo,
}: {
  onQuickStart: () => void;
  onLogin: () => void;
  onCreate: () => void;
  onHowTo: () => void;
}) {
  return (
    <div className="relative flex h-dvh w-dvw flex-col overflow-hidden bg-[#f4f1ea]">
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[#6f7dff]" />
      <div className="absolute inset-x-0 bottom-[38%] h-3 bg-[#5a68e6]" />
      <TitleSticks />

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6">
        <h1 className="text-center font-[var(--font-fredoka),Nunito,sans-serif] text-7xl leading-[0.85] font-black tracking-tight text-[#eef6ff] drop-shadow-[6px_8px_0_#6b8eae] sm:text-8xl">
          STICK
          <br />
          ARENA
        </h1>

        <div className="mt-10 flex w-72 flex-col gap-3">
          <MenuButton onClick={onQuickStart}>Quick Start!</MenuButton>
          <MenuButton onClick={onLogin}>Log In</MenuButton>
          <MenuButton onClick={onCreate}>Create Account</MenuButton>
          <MenuButton onClick={onHowTo}>How to Play?</MenuButton>
        </div>
      </div>

      <p className="relative z-10 pb-3 text-center text-[11px] font-bold text-black/45">
        © 2003–2006 XGen Studios, Inc. · recreation
      </p>
    </div>
  );
}

function MenuButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-[#7f8ea0] bg-[#c9d3df] px-6 py-2.5 text-lg font-black text-[#334155] shadow-[inset_0_1px_0_#fff] transition hover:bg-[#dbe3ec] active:translate-y-px"
    >
      {children}
    </button>
  );
}
