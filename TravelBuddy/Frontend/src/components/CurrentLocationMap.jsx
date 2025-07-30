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
