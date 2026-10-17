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
      <div className="flex h-dvh w-dvw items-center justify-center bg-[#f4f1ea] p-6">
        <div className="w-[min(460px,92vw)] rounded-xl bg-white p-6 shadow-xl">
          <h2 className="mb-3 text-2xl font-black">How to Play</h2>
          <ul className="space-y-2 text-sm font-bold text-[#334155]">
            <li>WASD or arrows to move</li>
            <li>Mouse aims, click or Space attacks</li>
            <li>Walk over a weapon to pick it up</li>
            <li>Hold Shift for the scoreboard</li>
            <li>Esc asks to leave the match</li>
            <li>Most kills when the timer ends wins</li>
          </ul>
          <button
            type="button"
            onClick={() => setScreen("title")}
            className="mt-5 rounded-full bg-[#c9d3df] px-5 py-2 font-black"
          >
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
    <div className="flex h-dvh w-dvw items-center justify-center bg-[#f4f1ea] p-6">
      <form
        className="w-[min(360px,92vw)] rounded-xl bg-white p-6 shadow-xl"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <h2 className="mb-4 text-2xl font-black">{title}</h2>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="mb-4 w-full rounded border border-[#7b8b9c] px-3 py-2 font-bold"
          placeholder="Username"
          autoFocus
        />
        <div className="flex gap-2">
          <button type="submit" className="rounded-full bg-[#c9d3df] px-5 py-2 font-black">
            Enter Lobby
          </button>
          <button type="button" onClick={onCancel} className="rounded-full px-4 py-2 font-black">
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
