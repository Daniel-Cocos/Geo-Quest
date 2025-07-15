import React from 'react';
import './SettingsPopup.css';
import Sliders from './Sliders';

function SettingsPopup() {
    return (
        <div className="popup">
            <h1>Settings menu</h1>
            <Sliders />
        </div>
    );
}

export default SettingsPopup;
