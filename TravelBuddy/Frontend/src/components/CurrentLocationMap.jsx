import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

function CurrentLocationMap() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [error, setError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:import.meta.env.VITE_GOOGLE_API
  });

  useEffect(() => {
    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {

          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Location permission denied or unavailable');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  if (!isLoaded) return <div>Loading map...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!currentPosition) return <div>Getting your location...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentPosition}
      zoom={15}
    >
      <Marker position={currentPosition} />
    </GoogleMap>
  );
}

export default CurrentLocationMap;
