import React from 'react';
import './LocationButton.css';

function LocationButton({ onLocation }) {
    const handleClick = () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                onLocation({ latitude, longitude });
            },
            (error) => console.error("Location error:", error)
        );
    };

    return (
        <button className="location-button" onClick={handleClick}>
            Get My Location
        </button>
    );
}

export default LocationButton;

