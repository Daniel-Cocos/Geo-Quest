import { React, useEffect, useState } from 'react';
import './Play.css';
import MapImage from '../Components/MapImage';

function Play() {
    const [initialLocation, setInitialLocation] = useState(null); // for the map
    const [currentLocation, setCurrentLocation] = useState(null); // live updates

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setInitialLocation({ latitude, longitude });
                setCurrentLocation({ latitude, longitude });
            },
            (error) => console.error("Location error:", error)
        );

        const interval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ latitude, longitude });
                },
                (error) => console.error("Location error:", error)
            );
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="play-div">
            <div className="card">
                {currentLocation && (
                    <>
                        <p>
                            Lat: {currentLocation.latitude}, Lon: {currentLocation.longitude}
                        </p>
                        {initialLocation && <MapImage location={initialLocation} />}
                    </>
                )}
            </div>
        </div>
    );
}

export default Play;
