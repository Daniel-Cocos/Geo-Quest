import React from 'react';
import './Topbar.css';

function Topbar({ onLoginClick }) {
    return (
        <div className="topbar">
            <button onClick={onLoginClick}>Login/Register</button>
        </div>
    );
}

export default Topbar;

