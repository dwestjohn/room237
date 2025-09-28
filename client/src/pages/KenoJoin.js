import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "../App.css";

// use your LAN host here so phone can reach it
const socket = io(process.env.REACT_APP_SOCKET_URL || "https://room237-server.onrender.com");


function KenoJoin() {
  const [players, setPlayers] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [outcome, setOutcome] = useState(null);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [roundLocked, setRoundLocked] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const numbers = Array.from({ length: 80 }, (_, i) => i + 1);

  useEffect(() => {
    socket.on("playersUpdate", (updated) => {
      setPlayers(updated);
      if (currentPlayer) {
        const refreshed = updated.find(
          (p) => p.playerId === currentPlayer.playerId
        );
        if (refreshed) setCurrentPlayer(refreshed);
      }
    });

    socket.on("roundStart", ({ drawn }) => {
      setDrawnNumbers(drawn);
      setOutcome(null);
    });

    socket.on("roundOutcome", (outcome) => {
      setOutcome(outcome);
    });

    socket.on("roundLocked", () => {
      setRoundLocked(true);
    });

    socket.on("boardCleared", () => {
      setOutcome(null);
      setDrawnNumbers([]);
      setRoundLocked(false);

      if (currentPlayer) {
        setCurrentPlayer((prev) => ({
          ...prev,
          number: null,
          ready: false,
        }));
      }
    });

    return () => {
      socket.off("playersUpdate");
      socket.off("roundStart");
      socket.off("roundOutcome");
      socket.off("roundLocked");
      socket.off("boardCleared");
    };
  }, [currentPlayer]);

  const handleJoin = () => {
    if (!nameInput.trim()) return;

    // get or create persistent playerId
    let playerId = localStorage.getItem("kenoPlayerId");
    if (!playerId) {
      playerId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("kenoPlayerId", playerId);
    }

    socket.emit("join", nameInput.trim(), playerId, (player) => {
      if (player) {
        setCurrentPlayer(player);
        setShowJoinModal(false);
        setNameInput("");
      }
    });
  };

  const handleNumberPick = (num) => {
    const picked = players.some((p) => p.number === num);
    if (!picked) {
      socket.emit("pickNumber", num, (updated) => {
        setCurrentPlayer(updated);
      });
    }
  };

  const handleReady = () => {
    if (!currentPlayer?.number) {
      alert("Pick a number first!");
      return;
    }
    socket.emit("ready", (updated) => {
      setCurrentPlayer(updated);
    });
  };

  const handleStartRound = () => {
    socket.emit("startRound");
  };

  const handleClearBoard = () => {
    socket.emit("clearBoard");
  };

  const allReady =
    players.length > 0 && players.every((p) => p.number && p.ready);

  return (
    <div className="container">
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <img
          src="/assets/237.png"
          alt="Keno 237 Player Join"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </div>

      {/* Current Players */}
      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3>Current Players</h3>
        {players.length === 0 ? (
          <p style={{ color: "gray" }}>No players yet. Be the first!</p>
        ) : (
          <ul>
            {players.map((p) => (
              <li key={p.playerId}>
                {p.name} {p.isGM && <strong>(GM)</strong>} –{" "}
                {p.number ? `#${p.number}` : "No pick"}{" "}
                {p.ready && "✅ Ready"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Player Controls */}
      {currentPlayer && (
        <div className="card" style={{ marginBottom: "1rem" }}>
          <h3>Welcome, {currentPlayer.name}</h3>

          {!currentPlayer.ready ? (
            <>
              <p>Pick a number from the board:</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(10, minmax(0, 1fr))",
                  gap: "4px",
                  margin: "10px auto",
                  width: "100%",
                  maxWidth: "90vw",
                  fontSize: "0.8rem",
                }}
              >
                {numbers.map((num) => {
                  const picked = players.some((p) => p.number === num);
                  const selected = currentPlayer.number === num;
                  const hit =
                    selected && drawnNumbers.includes(currentPlayer.number);

                  return (
                    <div
                      key={num}
                      onClick={() => !picked && handleNumberPick(num)}
                      className={`keno-cell 
                        ${picked ? "keno-picked" : ""} 
                        ${selected ? "keno-selected" : ""} 
                        ${hit ? "keno-player-hit" : ""}`}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <button className="order-button" onClick={handleReady}>
                  Ready!
                </button>
                <button
                  className="order-button"
                  onClick={() => setShowRules(true)}
                >
                  Game Rules
                </button>
              </div>
            </>
          ) : (
            <p>You are ready! Waiting for others...</p>
          )}
        </div>
      )}

      {/* GM Controls */}
      {currentPlayer?.isGM && (
        <div className="card">
          <h3>Game Master Controls</h3>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <button
              className="order-button"
              disabled={!allReady || roundLocked}
              onClick={handleStartRound}
            >
              Start Round!
            </button>
            <button className="order-button" onClick={handleClearBoard}>
              Clear Board
            </button>
            <button
              className="order-button"
              onClick={() => window.location.reload()}
            >
              End Game
            </button>
          </div>
        </div>
      )}

      {/* Outcome Popup */}
      {outcome && (
        <div className="pin-overlay">
          <div className="pin-box">
            {outcome.type === "winner" && (
              <>
                <h2>Winner:</h2>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {outcome.player}!
                </p>
              </>
            )}
            {outcome.type === "draw" && (
              <>
                <h2>Draw:</h2>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {outcome.count} players hit!
                </p>
              </>
            )}
            {outcome.type === "none" && (
              <>
                <h2>No Winner!</h2>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  Everyone add to the pot!
                </p>
              </>
            )}
            <button
              style={{ marginTop: "1rem" }}
              onClick={() => setOutcome(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Game Rules Modal */}
      {showRules && (
        <div className="pin-overlay">
          <div className="pin-box">
            <h2>Keno 237 – Rules</h2>
            <p style={{ textAlign: "left", lineHeight: "1.5" }}>
              • Each player puts $1 into the pot at the start of the round.
              <br />
              • Each player then picks one unique number on the Keno board and
              hits Ready.
              <br />
              • When all players are ready, the Game Master starts the round.
              <br />
              • 20 numbers are drawn from the board in sequence.
              <br />
              <br />
              Results:
              <br />
              • If exactly one player’s number is drawn → that player wins the
              pot!
              <br />
              • If multiple players’ numbers are drawn → it’s a draw, pot stays.
              <br />
              • If no numbers are drawn → everyone adds $1 next round, pot grows!
            </p>
            <button
              style={{ marginTop: "1rem" }}
              className="order-button"
              onClick={() => setShowRules(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="pin-overlay">
          <div className="pin-box">
            <h3>Enter Your Name</h3>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your name"
              className="pin-input"
            />
            <div className="pin-actions">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setNameInput("");
                }}
              >
                Cancel
              </button>
              <button onClick={handleJoin}>Join</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KenoJoin;








