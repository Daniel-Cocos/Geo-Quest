import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Play.css';
import MapImage from '../Components/MapImage';

function Play() {
    const [initialLocation, setInitialLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [actualLocation, setActualLocation] = useState(null);
    const [guessCount, setGuessCount] = useState(0);
    const [guessed, setGuessed] = useState(false);
    const [popup, setPopup] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();

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

    useEffect(() => {
        if (!popup) return;

        setShowPopup(true);

        const timer = setTimeout(() => {
            setShowPopup(false);
            setTimeout(() => {
                if (popup.type === 'success' || (popup.type === 'error' && guessCount >= 3)) {
                    navigate('/');
                }
                setPopup(null);
            }, 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [popup, navigate, guessCount]);

    const haversineDistance = (loc1, loc2) => {
        const toRad = (deg) => (deg * Math.PI) / 180;

        const R = 6371000;
        const dLat = toRad(loc2.latitude - loc1.latitude);
        const dLon = toRad(loc2.longitude - loc1.longitude);

        const lat1 = toRad(loc1.latitude);
        const lat2 = toRad(loc2.latitude);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    const isClose = (loc1, loc2) => {
        if (!loc1 || !loc2) return false;
        const distance = haversineDistance(loc1, loc2);
        console.log("Distance in meters:", distance);
        return distance < 100;
    };

    const handleGuess = () => {
        if (!currentLocation || !actualLocation || guessed) return;

        const newGuessCount = guessCount + 1;
        const correct = isClose(currentLocation, {
            latitude: actualLocation.lat,
            longitude: actualLocation.lon,
        });

        if (correct || newGuessCount === 3) {
            const points = [1000, 500, 250][guessCount];
            setPopup({ type: 'success', message: `✔ Correct! You earned ${points} points.` });
            setGuessed(true);
        } else {
            if (newGuessCount >= 3) {
                setPopup({ type: 'error', message: '✘ Wrong! Better luck next time!' });
            } else {
                setPopup({ type: 'error', message: `✘ Wrong! Try again (${newGuessCount} / 3).` });
            }
            setGuessCount(newGuessCount);
        }
    };

    return (
        <div className="play-div">
            <div className="card">
                {currentLocation && (
                    <>
                        <div className="location-info">
                            <h2>Your Location</h2>
                            <p>
                                <span className="coord-label">Latitude:</span> <br />
                                <span className="coord-value">{currentLocation.latitude.toFixed(6)}</span>
                            </p>
                            <p>
                                <span className="coord-label">Longitude:</span> <br />
                                <span className="coord-value">{currentLocation.longitude.toFixed(6)}</span>
                            </p>
                        </div>

                        {initialLocation && (
                            <div className="map-container">
                                <MapImage location={initialLocation} setCoords={setActualLocation} />
                            </div>
                        )}

                        <button onClick={handleGuess} disabled={guessed || guessCount >= 3} className="guess-button">
                            Guess
                        </button>

                        <p className="guess-count">Guess {guessCount} / 3</p>
                    </>
                )}

                {popup && (
                    <div className={`popup ${popup.type} ${showPopup ? 'show' : 'hide'}`}>
                        {popup.message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Play;

