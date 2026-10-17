"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  AI_LINES,
  ONLINE,
  OPENING_CHAT,
  ROOMS,
  SERVERS,
  type ArenaRoom,
  type ChatLine,
  type LobbyPlayer,
} from "./data";

const SILVER = "#c0c0c0";
const TEXT = "#000";
const NAVY = "#000080";
const BEVEL_DARK = "#808080";
const BEVEL_LIGHT = "#ffffff";

const rootStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  width: "100vw",
  height: "100dvh",
  padding: "6px 8px 8px",
  background: SILVER,
  color: TEXT,
  fontFamily: "Verdana, Tahoma, Arial, sans-serif",
  boxSizing: "border-box",
};

const colsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 196px",
  gap: 10,
  minHeight: 0,
  flex: 1,
};

const panel: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  minWidth: 0,
  background: SILVER,
  borderTop: `2px solid ${BEVEL_DARK}`,
  borderLeft: `2px solid ${BEVEL_DARK}`,
  borderRight: `2px solid ${BEVEL_LIGHT}`,
  borderBottom: `2px solid ${BEVEL_LIGHT}`,
};

const fieldStyle: CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  height: 20,
  border: `1px solid ${BEVEL_DARK}`,
  background: "#f3f3f3",
  color: TEXT,
  boxShadow: "inset 1px 1px 2px #9a9a9a",
  padding: "0 6px",
  font: "700 12px Verdana, Tahoma, sans-serif",
  outline: "none",
};

const selectStyle: CSSProperties = {
  ...fieldStyle,
  background: "linear-gradient(180deg, #ffffff 0%, #d8d8d8 100%)",
  boxShadow: `inset 0 1px 0 ${BEVEL_LIGHT}`,
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase",
};

const btnStyle: CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  width: "100%",
  borderRadius: 18,
  border: `1px solid ${BEVEL_DARK}`,
  background: "linear-gradient(180deg, #ffffff 0%, #ececec 46%, #d4d4d4 100%)",
  color: "#222",
  font: "800 15px Verdana, Tahoma, sans-serif",
  padding: "8px 12px",
  boxShadow: `inset 0 1px 0 ${BEVEL_LIGHT}, 0 1px 0 ${BEVEL_DARK}`,
  cursor: "pointer",
};

export function LobbyScreen({
  playerName,
  onJoin,
  onLogout,
}: {
  playerName: string;
  onJoin: (room: ArenaRoom) => void;
  onLogout: () => void;
}) {
  const [server, setServer] = useState(SERVERS[0]);
  const [rooms, setRooms] = useState(ROOMS);
  const [selectedId, setSelectedId] = useState(ROOMS[0].id);
  const [chatLines, setChatLines] = useState<ChatLine[]>(() =>
    OPENING_CHAT.map((line, i) => ({ ...line, id: i + 1 })),
  );
  const [draft, setDraft] = useState("");
  const [creating, setCreating] = useState(false);
  const [privateCode, setPrivateCode] = useState<string | null>(null);
  const [createName, setCreateName] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const seq = useRef(OPENING_CHAT.length);

  const selected = rooms.find((room) => room.id === selectedId) ?? rooms[0];
  const you: LobbyPlayer = { name: playerName, color: "#c8c8c8" };
  const inGame = [you, ...selected.players.filter((p) => p.name !== playerName)];
  const extras = ONLINE.filter((p) => !inGame.some((g) => g.name === p.name));

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [chatLines]);

  useEffect(() => {
    const tick = window.setInterval(() => {
      const speaker = ONLINE[Math.floor(Math.random() * ONLINE.length)];
      const text = AI_LINES[Math.floor(Math.random() * AI_LINES.length)];
      seq.current += 1;
      setChatLines((lines) =>
        [...lines, { id: seq.current, name: speaker.name, color: speaker.color, text }].slice(-60),
      );
    }, 2800 + Math.random() * 1800);
    return () => window.clearInterval(tick);
  }, []);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    seq.current += 1;
    setChatLines((lines) => [...lines, { id: seq.current, name: playerName, color: "#111", text }]);
    setDraft("");
    window.setTimeout(() => {
      const speaker = ONLINE[Math.floor(Math.random() * ONLINE.length)];
      const replies = [`hey ${playerName}`, "join The Lobby", "nice", "what map?", "im in", "gg"];
      seq.current += 1;
      setChatLines((lines) => [
        ...lines,
        {
          id: seq.current,
          name: speaker.name,
          color: speaker.color,
          text: replies[Math.floor(Math.random() * replies.length)],
        },
      ]);
    }, 700 + Math.random() * 900);
  };

  const createRoom = () => {
    const name = createName.trim() || `${playerName}'s game`;
    const room: ArenaRoom = {
      id: `custom-${Date.now()}`,
      name,
      map: "The Lobby",
      mode: "Deathmatch",
      maxPlayers: 6,
      timeLeft: "5:00",
      players: [you],
    };
    setRooms((current) => [room, ...current]);
    setSelectedId(room.id);
    setCreating(false);
    setCreateName("");
    onJoin(room);
  };

  return (
    <div id="sa-lobby" style={rootStyle}>
      <div
        style={{
          height: 22,
          display: "flex",
          alignItems: "center",
          padding: "0 2px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "#555",
        }}
      >
        XGEN STUDIOS
      </div>
      <div style={colsStyle}>
        <section style={{ display: "flex", flexDirection: "column", minHeight: 0, minWidth: 0 }}>
          <div className="sa-panel" style={{ ...panel, flex: 1 }}>
            <div
              ref={chatRef}
              style={{
                flex: 1,
                minHeight: 0,
                overflow: "auto",
                padding: "8px 10px",
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1.45,
                color: TEXT,
              }}
            >
              <p style={{ margin: "0 0 12px", color: "#444", fontSize: 12, lineHeight: 1.4 }}>
                IF YOU ARE EXPERIENCING SLOW OR CHOPPY GAMEPLAY, TRY THE NEW ENHANCED COMPATIBILITY
                SERVER FROM THE SERVER LIST IN THE TOP RIGHT CORNER.
              </p>
              {chatLines.map((line) => (
                <p key={line.id} style={{ margin: 0 }}>
                  <span className="sa-nick" style={{ color: NAVY }}>&lt;{line.name}&gt;</span> {line.text}
                </p>
              ))}
            </div>
            <form
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px 8px" }}
              onSubmit={(event) => {
                event.preventDefault();
                send();
              }}
            >
              <span style={{ fontWeight: 800 }}>&gt;</span>
              <input
                className="sa-field"
                style={{ ...fieldStyle, width: "100%" }}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
            </form>
          </div>
          <div
            style={{
              flexShrink: 0,
              padding: "8px 4px 0",
              fontSize: 12,
              fontWeight: 800,
              lineHeight: 1.55,
              textTransform: "uppercase",
            }}
          >
            <div>
              PLAYERS: {inGame.length}/{selected.maxPlayers}
              <span style={{ marginLeft: 36 }}>MODE: {selected.mode}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
              <span>ROUND TIME: {selected.timeLeft}</span>
              <span style={{ marginLeft: 28 }}>MAP:</span>
              <select
                className="sa-select"
                style={{ ...selectStyle, width: 190, textTransform: "none" }}
                value={selected.id}
                onChange={(event) => setSelectedId(event.target.value)}
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.map} — {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <aside style={{ display: "flex", flexDirection: "column", minHeight: 0, width: 196 }}>
          <div className="sa-panel" style={{ ...panel, flex: 1 }}>
            <div style={{ padding: "4px 4px 2px" }}>
              <select className="sa-select" style={{ ...selectStyle, width: "100%" }} value={server} onChange={(event) => setServer(event.target.value)}>
                {SERVERS.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
              {extras.map((player) => (
                <div key={player.name} style={{ padding: "2px 6px", fontSize: 13, fontWeight: 800 }}>
                  {player.name}
                </div>
              ))}
              {inGame.map((player) => (
                <div
                  key={`in-${player.name}`}
                  style={{ padding: "2px 6px", fontSize: 13, fontWeight: 800, background: player.color }}
                >
                  {player.name}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, padding: "10px 8px 2px" }}>
            <button type="button" className="sa-btn" style={btnStyle} onClick={() => onJoin(selected)}>
              Join Game
            </button>
            <button type="button" className="sa-btn" style={btnStyle} onClick={() => setPrivateCode(privateCode === null ? "" : null)}>
              Join Private
            </button>
            <button type="button" className="sa-btn" style={btnStyle} onClick={() => setCreating(true)}>
              Create Game
            </button>
            <button type="button" className="sa-btn" style={btnStyle} onClick={onLogout}>
              Log Out
            </button>
          </div>
        </aside>
      </div>

      {creating && (
        <Modal title="Create Game" onClose={() => setCreating(false)}>
          <input
            className="sa-field"
            style={{ ...fieldStyle, width: "100%", marginBottom: 12 }}
            value={createName}
            onChange={(event) => setCreateName(event.target.value)}
            placeholder="Arena name"
          />
          <button type="button" className="sa-btn" style={btnStyle} onClick={createRoom}>
            Create & Enter
          </button>
        </Modal>
      )}

      {privateCode !== null && (
        <Modal title="Join Private" onClose={() => setPrivateCode(null)}>
          <input
            className="sa-field"
            style={{ ...fieldStyle, width: "100%", marginBottom: 12 }}
            value={privateCode}
            onChange={(event) => setPrivateCode(event.target.value)}
            placeholder="Arena name"
          />
          <button
            type="button"
            className="sa-btn"
            style={btnStyle}
            onClick={() => {
              const match = rooms.find((room) => room.name.toLowerCase() === privateCode.trim().toLowerCase());
              if (match) onJoin(match);
            }}
          >
            Join
          </button>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ width: "min(360px, 92vw)", background: SILVER, border: "1px solid #7a7a7a", padding: 16, color: TEXT }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <strong>{title}</strong>
          <button type="button" className="sa-btn" style={{ ...btnStyle, width: 36, padding: 4 }} onClick={onClose}>
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
