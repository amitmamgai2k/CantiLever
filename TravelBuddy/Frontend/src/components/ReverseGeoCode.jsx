import { useState, useEffect } from 'react';
import axios from 'axios';

function ReverseGeocodeCityAndPincode({ lat, lng }) {
  const [locationText, setLocationText] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    const getLocationDetails = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_API;
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );

        if (response.data.results.length > 0) {
          const components = response.data.results[0].address_components;

          const cityComponent = components.find(c => c.types.includes('locality'));
          const countryComponent = components.find(c => c.types.includes('country'));
          const postalComponent = components.find(c => c.types.includes('postal_code'));

          const city = cityComponent ? cityComponent.long_name : '';
          const country = countryComponent ? countryComponent.long_name : '';
          const postal = postalComponent ? postalComponent.long_name : '';

          setLocationText(`${city}${country ? ', ' + country : ''}`);
          setPincode(postal || 'Pincode not found');
        } else {
          setLocationText('Location not found');
          setPincode('');
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setLocationText('Error fetching location');
        setPincode('');
      }
    };

    getLocationDetails();
  }, [lat, lng]);

  return (
    <div className="text-gray-700 mt-2">
      <div><strong>{locationText}</strong></div>
      <div className="text-sm text-gray-500">{pincode}</div>
    </div>
  );
}

export default ReverseGeocodeCityAndPincode;
