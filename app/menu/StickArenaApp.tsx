"use client";

import { useEffect, useState } from "react";
import { Game } from "../game/Game";
import { randomGuestName } from "../game/data/names";
import { fillRoomPlayers, randomMap, type ArenaRoom } from "./data";
import { LobbyScreen } from "./LobbyScreen";
import { loadProgress, type Progress } from "./progress";
import { TitleScreen } from "./TitleScreen";

type Screen = "title" | "login" | "create" | "howto" | "lobby" | "play";

export function StickArenaApp() {
  const [screen, setScreen] = useState<Screen>("title");
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const [room, setRoom] = useState<ArenaRoom | null>(null);
  const [progress, setProgress] = useState<Progress>({ kills: 0 });

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const goLobby = () => {
    setProgress(loadProgress());
    setScreen("lobby");
  };

  const enterLobby = (playerName: string) => {
    setName(playerName);
    setScreen("lobby");
  };

  const joinRoom = (next: ArenaRoom) => {
    setRoom(next);
    setScreen("play");
  };

  if (screen === "play" && room) {
    return (
      <Game
        key={room.id}
        playerName={name || randomGuestName()}
        place={room.map}
        botNames={room.players.filter((player) => player.name !== name).map((player) => player.name)}
        onLeave={goLobby}
      />
    );
  }

  if (screen === "lobby") {
    return (
      <LobbyScreen
        playerName={name}
        progress={progress}
        onJoin={joinRoom}
        onLogout={() => {
          setName("");
          setScreen("title");
        }}
      />
    );
  }

  if (screen === "login" || screen === "create") {
    return (
      <AuthCard
        title={screen === "login" ? "Log In" : "Create Account"}
        draft={draft}
        setDraft={setDraft}
        onCancel={() => setScreen("title")}
        onSubmit={() => enterLobby(draft.trim() || randomGuestName())}
      />
    );
  }

  if (screen === "howto") {
    return (
      <div
        id="sa-card"
        style={{
          display: "flex",
          width: "100vw",
          height: "100dvh",
          alignItems: "center",
          justifyContent: "center",
          background: "#efe6d2",
          padding: 24,
        }}
      >
        <div className="sa-card-box" style={{ width: "min(460px, 92vw)" }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 26, fontWeight: 800 }}>How to Play</h2>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, fontWeight: 700, lineHeight: 1.7, color: "#2a3a4c" }}>
            <li>WASD or arrows to move</li>
            <li>Mouse aims, click or Space attacks</li>
            <li>Walk over a weapon to pick it up</li>
            <li>Hold Shift for the scoreboard</li>
            <li>Esc asks to leave the match</li>
            <li>Most kills when the timer ends wins</li>
            <li>When the round ends you return to the lobby and keep your career kills</li>
            <li>Rank trophies unlock at 5, 20, 80, 300, 750, 2,000, 5,000, 10,000, and 20,000 kills</li>
          </ul>
          <button type="button" className="sa-btn" style={{ marginTop: 20 }} onClick={() => setScreen("title")}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <TitleScreen
      onQuickStart={() => {
        const guest = randomGuestName();
        setName(guest);
        const guestPlayer = { name: guest, color: "#9cff9c" };
        joinRoom({
          id: "quick",
          name: "Quick Start",
          map: randomMap(),
          mode: "Deathmatch",
          maxPlayers: 6,
          timeLeft: "5:00",
          players: fillRoomPlayers(guestPlayer, 6),
        });
      }}
      onLogin={() => {
        setDraft("");
        setScreen("login");
      }}
      onCreate={() => {
        setDraft("");
        setScreen("create");
      }}
      onHowTo={() => setScreen("howto")}
    />
  );
}

function AuthCard({
  title,
  draft,
  setDraft,
  onCancel,
  onSubmit,
}: {
  title: string;
  draft: string;
  setDraft: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div
      id="sa-card"
      style={{
        display: "flex",
        width: "100vw",
        height: "100dvh",
        alignItems: "center",
        justifyContent: "center",
        background: "#efe6d2",
        padding: 24,
      }}
    >
      <form
        className="sa-card-box"
        style={{ width: "min(360px, 92vw)" }}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <h2 style={{ margin: "0 0 16px", fontSize: 26, fontWeight: 800 }}>{title}</h2>
        <input
          className="sa-field"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Username"
          autoFocus
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="sa-btn">
            Enter Lobby
          </button>
          <button type="button" className="sa-btn" onClick={onCancel}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
