import { Share2, MapPin, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { currentLocation } from '../../redux/slices/userAuthSlice';

function CurrentLocation() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getLocation = () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        dispatch(currentLocation({ lat: position.coords.latitude, lng: position.coords.longitude }));
        setSuccess(true);
        setLoading(false);


        setTimeout(() => {
          navigate('/');
        }, 1000);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        setError(errorMessage);
        setLoading(false);
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all duration-300 hover:scale-105">
        {/* Header */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Share Your Location</h2>
          <p className="text-gray-600 text-sm">
            Allow us to access your location to capture your current location for your trip planning
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700 text-sm">
            <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Location captured successfully! Redirecting...</span>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : success
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-amber-600 hover:bg-amber-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
          onClick={getLocation}
          disabled={loading || success}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Getting Location...</span>
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              <span>Success!</span>
            </>
          ) : (
            <>
              <Share2 className="h-5 w-5" />
              <span>Share Current Location</span>
            </>
          )}
        </button>

        {/* Privacy Note */}
        <p className="mt-4 text-xs text-gray-500">
          Your location data is secure and only used to improve your experience
        </p>

      </div>
    </div>
  );
}

export default CurrentLocation;