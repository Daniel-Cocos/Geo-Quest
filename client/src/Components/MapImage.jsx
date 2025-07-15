import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StreetViewImage({ location }) {
    const [src, setSrc] = useState(null);
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        if (!location) return;
        setSrc(null);

        const fetchImage = async () => {
            try {
                const result = await axios.get(
                    `http://localhost:8000/api/location?lat=${encodeURIComponent(location.latitude)}&lon=${encodeURIComponent(location.longitude)}`
                );
                setSrc(`data:image/jpeg;base64,${result.data.image}`);
                setCoords({ lat: result.data.lat, lon: result.data.lon });
            } catch (err) {
                console.error('Street View fetch error:', err);
            }
        };

        fetchImage();
    }, [location]);

    if (!location) return null;

    return src ? (
        <div>
            <img src={src} alt="Street View" />
            <p>
                Actual location: Lat {coords.lat}, Lon {coords.lon}
            </p>
        </div>
    ) : (
        <p>Loading Street View…</p>
    );
}

