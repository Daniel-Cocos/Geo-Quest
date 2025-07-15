import React from 'react';
import './Topbar.css';

function Topbar() {
    return (
        <div className="topbar">
            <a href="/filters">Filters</a>
            <a href="/play">Play</a>
            <a href="/rules">Rules</a>
        </div>
    );
}

export default Topbar;
