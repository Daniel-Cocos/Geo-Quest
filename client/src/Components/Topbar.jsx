import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Topbar.css';

function Topbar({ onLoginClick }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/check', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setLoggedIn(true);
                setUsername(res.data.user);
            } catch {
                setLoggedIn(false);
            }
        };
        checkLogin();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
        navigate("/")
        window.location.reload();
    };

    return (
        <div className="topbar">
            {loggedIn ? (
                <>
                    <span>Welcome, {username}</span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <button onClick={onLoginClick}>Login/Register</button>
            )}
        </div>
    );
}

export default Topbar;

