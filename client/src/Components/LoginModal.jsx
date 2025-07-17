import React, { useState } from "react";
import "./LoginModal.css";

export default function LoginModal({ onClose }) {
  const [mode, setMode] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetAll = () => {
    setMode(null);
    setUsername("");
    setPassword("");
    setError("");
    setLoading(false);
  };

  const handleOverlayClick = () => {
    onClose();
    resetAll();
  };

  const stopPropagation = (e) => e.stopPropagation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      const hasUpper = /[A-Z]/.test(password);
      const hasSymbol = /[^A-Za-z0-9]/.test(password);
      if (password.length < 12 || !hasUpper || !hasSymbol) {
        setError(
          "Password must be ≥12 chars, include a capital letter and a symbol"
        );
        setLoading(false);
        return;
      }
    }

    const endpoint = mode === "register" ? "/api/register" : "/api/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();
      console.log("‹Raw response›", text);
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: "Invalid server response", detail: text };
      }

      if (!res.ok) {
        setError(
          data.error
            ? data.detail
              ? `${data.error} — detail: ${data.detail}`
              : data.error
            : `Server returned ${res.status}`
        );
      } else {
        alert(data.message);
        onClose();
        resetAll();
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={handleOverlayClick}>
      <div className="login-modal" onClick={stopPropagation}>
        {!mode ? (
          <div className="choice">
            <button onClick={() => setMode("login")}>Login</button>
            <button onClick={() => setMode("register")}>Register</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>{mode === "register" ? "Register" : "Login"}</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="error">{error}</div>}

            <div className="form-buttons">
              <button type="submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : mode === "register"
                  ? "Register"
                  : "Login"}
              </button>
              <button
                type="button"
                className="back"
                onClick={() => {
                  setMode(null);
                  setError("");
                }}
                disabled={loading}
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

