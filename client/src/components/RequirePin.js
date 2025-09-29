import React, { useState } from "react";

function RequirePin({ children }) {
  const [status, setStatus] = useState("checking");
  const [pinInput, setPinInput] = useState("");

  // Hardcoded PIN (change as needed)
  const CORRECT_PIN = "7477";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pinInput === CORRECT_PIN) {
      setStatus("granted");
    } else {
      setStatus("denied");
      setTimeout(() => setStatus("checking"), 1500); // reset after error
    }
  };

  if (status === "checking") {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2 style={{ color: "#cba44d" }}>Enter PIN to Access</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="4-digit PIN"
            maxLength={4}
            style={{
              padding: "0.5rem",
              fontSize: "1.2rem",
              marginTop: "1rem",
              textAlign: "center",
              borderRadius: "6px",
            }}
          />
          <br />
          <button
            type="submit"
            className="order-button"
            style={{ marginTop: "1rem" }}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>
        ❌ Incorrect PIN
      </p>
    );
  }

  return children;
}

export default RequirePin;
