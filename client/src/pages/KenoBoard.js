import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "../App.css";

const socket = io("http://room237.local:5000");


function KenoBoard() {
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [outcome, setOutcome] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [latestNumber, setLatestNumber] = useState(null);
  const [players, setPlayers] = useState([]);

  const numbers = Array.from({ length: 80 }, (_, i) => i + 1);

  useEffect(() => {
    socket.on("playersUpdate", (updated) => setPlayers(updated));

    socket.on("roundStart", ({ drawn }) => {
      setDrawnNumbers([]);
      setOutcome(null);
      setIsDrawing(true);

      let index = 0;
      const interval = setInterval(() => {
        const num = drawn[index];
        setDrawnNumbers((prev) => [...prev, num]);
        setLatestNumber(num);
        index++;
        if (index === drawn.length) {
          clearInterval(interval);
          setIsDrawing(false);
        }
      }, 5000);
    });

    socket.on("roundOutcome", (outcome) => setOutcome(outcome));

    socket.on("boardCleared", () => {
      // 🔄 Reset everything including outcome
      setDrawnNumbers([]);
      setOutcome(null);
      setLatestNumber(null);
      setIsDrawing(false);
    });

    return () => {
      socket.off("playersUpdate");
      socket.off("roundStart");
      socket.off("roundOutcome");
      socket.off("boardCleared");
    };
  }, []);

  return (
    <div className="container">
            <div style={{ textAlign: "center", margin: "20px 0" }}>
            <img 
                src="/assets/237.png" 
                alt="Keno 237" 
                style={{ maxWidth: "200px", height: "auto" }} 
            />
            </div>


      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: "8px",
          margin: "20px auto",
          maxWidth: "600px",
        }}
      >
        {numbers.map((num) => {
          const isDrawn = drawnNumbers.includes(num);
          const isLatest = latestNumber === num;
          const pickedByPlayer = players.some((p) => p.number === num);

          return (
            <div
              key={num}
              className={`keno-cell 
                ${isDrawn ? "keno-drawn" : ""} 
                ${isLatest ? "keno-latest" : ""} 
                ${isDrawn && pickedByPlayer ? "keno-player-hit" : ""}`}
            >
              {num}
            </div>
          );
        })}
      </div>

      {/* Status text instead of blocking modal */}
      {isDrawing && (
        <p style={{ textAlign: "center", marginTop: "1rem", color: "gray" }}>
          Drawing in progress… numbers are being pulled live.
        </p>
      )}

      {/* Outcome Popup */}
      {outcome && !isDrawing && (
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
    </div>
  );
}

export default KenoBoard;






