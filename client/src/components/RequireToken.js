// src/components/RequireToken.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { useLocation } from "react-router-dom";

function RequireToken({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    let token = queryParams.get("token");

    // Fallback: try localStorage if no token in URL
    if (!token) {
      token = localStorage.getItem("qr_token");
    }

    if (!token) {
      setStatus("denied");
      return;
    }

    const validateToken = async () => {
      try {
        const res = await api.post("/api/qr-token/validate", { token });
        if (res.data.valid) {
          setStatus("granted");
          localStorage.setItem("qr_token", token); // refresh cache
        } else {
          setStatus("denied");
          localStorage.removeItem("qr_token"); // clear stale token
        }
      } catch (err) {
        console.error("Error validating token:", err);
        setStatus("denied");
        localStorage.removeItem("qr_token");
      }
    };

    validateToken();
  }, [location]);

  if (status === "loading") {
    return <p style={{ textAlign: "center" }}>🔍 Checking access…</p>;
  }

  if (status === "denied") {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/assets/jp.gif"
            alt="Jurassic Park Hack"
            style={{
              maxWidth: "400px",
              width: "100%",
              borderRadius: "12px",
              marginBottom: "2rem"
            }}
          />
        </div>
        <h2
          style={{
            color: "#cba44d",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.8rem",
            marginBottom: "1rem"
          }}
        >
          Ah Ah Ah! You didn&apos;t say the magic word!
        </h2>
        <p
          style={{
            color: "white",
            fontSize: "1.2rem",
            marginTop: "0.5rem"
          }}
        >
          Please scan the new code to gain access!
        </p>
      </div>
    );
  }

  return children;
}

export default RequireToken;


