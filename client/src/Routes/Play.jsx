import { React, useState } from 'react';
import './Play.css';
import MapImage from '../Components/MapImage';

function Play() {
    const [location, setLocation] = useState(null);

    if (!navigator.geolocation) return;

    if (!location) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            },
            (error) => console.error("Location error:", error)
        );
    }

    return (
        <div className="play-div">
            {location && (
                <>
                    <p>
                        Lat: {location.latitude}, Lon: {location.longitude}
                    </p>
                    <MapImage location={location} />
                </>
            )}
        </div>
    );
}

export default Play;
