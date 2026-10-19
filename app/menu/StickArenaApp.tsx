"use client";

import { useState } from "react";
import { Game } from "../game/Game";
import { randomGuestName } from "../game/data/names";
import type { ArenaRoom } from "./data";
import { LobbyScreen } from "./LobbyScreen";
import { TitleScreen } from "./TitleScreen";

type Screen = "title" | "login" | "create" | "howto" | "lobby" | "play";

export function StickArenaApp() {
  const [screen, setScreen] = useState<Screen>("title");
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const [room, setRoom] = useState<ArenaRoom | null>(null);

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
        botNames={room.players.map((player) => player.name)}
        onLeave={() => setScreen("lobby")}
      />
    );
  }

  if (screen === "lobby") {
    return (
      <LobbyScreen
        playerName={name}
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
        joinRoom({
          id: "quick",
          name: "Quick Start",
          map: "The Lobby",
          mode: "Deathmatch",
          maxPlayers: 6,
          timeLeft: "5:00",
          players: [
            { name: "Goodpeterson", color: "#8cff8c" },
            { name: "TriggerClan", color: "#c9c9c9" },
            { name: "Snarr", color: "#ffb36b" },
            { name: "HOTT5", color: "#ffe56a" },
          ],
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
