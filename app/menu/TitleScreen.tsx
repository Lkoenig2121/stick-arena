import type { CSSProperties, ReactNode } from "react";
import { TitleSticks } from "./StickArt";

const root: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: "100vw",
  height: "100dvh",
  overflow: "hidden",
  background: "#efe6d2",
};

const floor: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: "38%",
  background: "#6f7dff",
};

const floorEdge: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: "38%",
  height: 10,
  background: "#4f5fe0",
};

const title: CSSProperties = {
  margin: 0,
  textAlign: "center",
  fontFamily: "var(--font-fredoka), Nunito, sans-serif",
  fontSize: "clamp(64px, 12vw, 108px)",
  lineHeight: 0.85,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  color: "#eef6ff",
  textShadow: "6px 8px 0 #6b8eae",
};

const stack: CSSProperties = {
  position: "relative",
  zIndex: 10,
  margin: "0 auto",
  display: "flex",
  flex: 1,
  width: "100%",
  maxWidth: 560,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 24px",
};

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
    <div id="sa-title" style={root}>
      <div style={floor} />
      <div style={floorEdge} />
      <TitleSticks />

      <div style={stack}>
        <h1 style={title}>
          STICK
          <br />
          ARENA
        </h1>
        <div style={{ marginTop: 40, display: "flex", width: 288, flexDirection: "column", gap: 12 }}>
          <MenuButton onClick={onQuickStart}>Quick Start!</MenuButton>
          <MenuButton onClick={onLogin}>Log In</MenuButton>
          <MenuButton onClick={onCreate}>Create Account</MenuButton>
          <MenuButton onClick={onHowTo}>How to Play?</MenuButton>
        </div>
      </div>

      <p
        style={{
          position: "relative",
          zIndex: 10,
          paddingBottom: 12,
          textAlign: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(0,0,0,0.4)",
        }}
      >
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
    <button type="button" className="sa-title-btn" onClick={onClick}>
      {children}
    </button>
  );
}
