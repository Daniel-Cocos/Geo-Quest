import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MapImage({ location, setCoords }) {
    const [src, setSrc] = useState(null);

    useEffect(() => {
        if (!location) return;
        setSrc(null);

        const fetchImage = async () => {
            try {
                const result = await axios.get(
                    `http://localhost:8000/api/location?lat=${encodeURIComponent(location.latitude)}&lon=${encodeURIComponent(location.longitude)}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setSrc(`data:image/jpeg;base64,${result.data.image}`);
                setCoords({ lat: result.data.lat, lon: result.data.lon });
            } catch (err) {
                console.error('Street View fetch error:', err);
            }
        };

        fetchImage();
    }, [location, setCoords]);

    if (!location) return null;

    return src ? (
        <div>
            <img src={src} alt="Street View" />
        </div>
    ) : (
        <p>Loading Street View…</p>
    );
}

