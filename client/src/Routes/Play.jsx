import { React, useState } from 'react';
import axios from 'axios';
import './Play.css';
import MapImage from '../Components/MapImage';
import LocationButton from '../Components/LocationButton';

function Play() {
    const [location, setLocation] = useState(null);

    const handleLocation = async (coords) => {
        setLocation(coords);
    };

    return (
        <div>
            <LocationButton onLocation={handleLocation} />
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
