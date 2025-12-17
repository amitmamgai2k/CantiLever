import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

function CurrentLocationMap({lat, lng}) {
const currentPosition = { lat, lng };
  const [error, setError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:import.meta.env.VITE_GOOGLE_API
  });



  if (!isLoaded) return <div>Loading map...</div>;

  // Validate coordinates
  const isValidLocation =
    lat !== undefined &&
    lat !== null &&
    lng !== undefined &&
    lng !== null &&
    !isNaN(lat) &&
    !isNaN(lng);

  if (!isValidLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg">
        <p>Location not available</p>
      </div>
    );
  }

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
