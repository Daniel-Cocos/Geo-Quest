import React, { useState } from "react";
import "./LoginModal.css";
import axios from 'axios';

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

        if (mode === "login") {
            try {
                const res = await axios.post('http://127.0.0.1:8000/api/login', { username, password });
                localStorage.setItem('token', res.data.access_token);
                onClose();
                window.location.reload();
            } catch {
                setError('Invalid username or password');
                setLoading(false)
            }
        }
        else {
            try {
                const message = await axios.post('http://127.0.0.1:8000/api/register', { username, password });

                if (message.data.data === "success") {
                    const res = await axios.post('http://127.0.0.1:8000/api/login', { username, password });
                    localStorage.setItem('token', res.data.access_token);
                    onClose();
                    window.location.reload();
                } else {
                    setError(message.data.data);
                    setLoading(false)
                }

            } catch (error) {
                setError("Error!");
                console.log(error)
            }
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
                                        : "Login"
                                }
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

