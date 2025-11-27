import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import {
  MapPin,
  Users,
  Search,
  Filter,
  Navigation,
  Loader2,
  AlertCircle,
  LocateFixed
} from 'lucide-react';
import axiosInstance from '../helpers/axiosInstance';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const RADIUS_METERS = 20000;

function AllTravelersOnMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [showList, setShowList] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyTravelers, setNearbyTravelers] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingTravelers, setLoadingTravelers] = useState(false);
  const [error, setError] = useState('');

  const fetchNearbyTravelers = useCallback(async (lat, lng) => {
    setLoadingTravelers(true);
    setError('');
    try {
      const response = await axiosInstance.get('/users/nearby-active', {
        params: { lat, lng }
      });
      const { users = [] } = response?.data?.data || {};
      setNearbyTravelers(users);
      setSelectedTraveler((prev) =>
        prev ? users.find((user) => user._id === prev._id) || null : null
      );
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to load nearby travelers';
      setError(message);
    } finally {
      setLoadingTravelers(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser.');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(coords);
        setLoadingLocation(false);
        fetchNearbyTravelers(coords.lat, coords.lng);
      },
      (geoError) => {
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? 'Location permission denied. Enable permissions to see nearby travelers.'
            : 'Unable to fetch your current location.'
        );
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [fetchNearbyTravelers]);

  const filteredTravelers = useMemo(() => {
    return nearbyTravelers.filter((traveler) => {
      const name = traveler.fullName?.toLowerCase() || '';
      const interestString = (traveler.interests || []).join(' ').toLowerCase();
      return (
        name.includes(searchQuery.toLowerCase()) ||
        interestString.includes(searchQuery.toLowerCase())
      );
    });
  }, [nearbyTravelers, searchQuery]);

  const handleRetry = () => {
    setLoadingLocation(true);
    setError('');
    setNearbyTravelers([]);
    if (userLocation) {
      fetchNearbyTravelers(userLocation.lat, userLocation.lng);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          setLoadingLocation(false);
          fetchNearbyTravelers(coords.lat, coords.lng);
        },
        () => {
          setError('Unable to fetch location. Please enable permissions and try again.');
          setLoadingLocation(false);
        }
      );
    }
  };

  const getUserMarkerIcon = () => {
    if (!window.google) return undefined;
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: '#2563eb',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2
    };
  };

  if (!isLoaded || loadingLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto" />
          <div>
            <p className="text-lg font-semibold text-gray-800">Preparing your map</p>
            <p className="text-sm text-gray-500">Fetching your location and nearby travelers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="bg-white shadow-lg sticky top-0 z-20">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 p-2 rounded-xl">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Your Nearby Travelers</h1>
                <p className="text-sm text-gray-600">
                  {filteredTravelers.length} active within 20 km
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowList(!showList)}
              className="sm:hidden bg-amber-600 text-white p-2 rounded-xl hover:bg-amber-700 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search travelers or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base sm:text-sm"
            />
          </div>
          {error && (
            <div className="mt-3 flex items-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>{error}</span>
              <button
                onClick={handleRetry}
                className="ml-auto text-amber-600 font-medium hover:underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row min-h-[calc(100vh-120px)]">
        <div
          className={`${
            showList ? 'block' : 'hidden'
          } sm:block sm:w-80 bg-white border-r border-gray-200 overflow-y-auto max-h-[300px] sm:max-h-full`}
        >
          <div className="p-4 space-y-3 pb-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-lg">Active Travelers</h2>
              <div className="sm:hidden text-xs text-gray-500 flex items-center">
                {filteredTravelers.length > 4 && (
                  <>
                    <div className="w-1 h-4 bg-amber-300 rounded-full mr-1 animate-pulse" />
                    Scroll ({filteredTravelers.length})
                  </>
                )}
              </div>
            </div>

            {loadingTravelers && (
              <div className="flex items-center justify-center py-8 text-amber-600">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading nearby users...
              </div>
            )}

            {!loadingTravelers && filteredTravelers.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No travelers found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
              </div>
            )}

            {filteredTravelers.map((traveler) => (
              <div
                key={traveler._id}
                onClick={() => setSelectedTraveler(traveler)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedTraveler?._id === traveler._id
                    ? 'border-amber-500 bg-amber-50 shadow-md'
                    : 'border-gray-100 hover:border-amber-300 hover:bg-amber-25'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center text-lg font-semibold text-amber-700">
                    {traveler.profilePicture ? (
                      <img src={traveler.profilePicture} alt={traveler.fullName} className="object-cover" />
                    ) : (
                      traveler.fullName?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{traveler.fullName}</p>
                    <div className="flex items-center space-x-1 mt-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3 text-amber-500" />
                      <span>{traveler.distanceKm} km away</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-3 sm:p-4 min-h-[500px]">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[480px] sm:h-[600px]">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Navigation className="h-5 w-5" />
                <span className="font-medium">Live Locations</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-100 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Within 20 km radius</span>
              </div>
            </div>

            <div className="h-[430px] sm:h-[550px] relative">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={selectedTraveler?.currentLocation || userLocation || DEFAULT_CENTER}
                zoom={userLocation ? 11 : 5}
                options={{
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true
                }}
              >
                {userLocation && (
                  <>
                    <Marker
                      position={userLocation}
                      icon={getUserMarkerIcon()}
                      title="Your location"
                    />
                    <Circle
                      center={userLocation}
                      radius={RADIUS_METERS}
                      options={{
                        fillColor: '#fcd34d55',
                        strokeColor: '#f59e0b',
                        strokeOpacity: 0.6,
                        strokeWeight: 1
                      }}
                    />
                  </>
                )}

                {filteredTravelers.map((traveler) => (
                  <Marker
                    key={traveler._id}
                    position={{
                      lat: traveler.currentLocation?.lat,
                      lng: traveler.currentLocation?.lng
                    }}
                    title={`${traveler.fullName} — ${traveler.distanceKm} km away`}
                    onClick={() => setSelectedTraveler(traveler)}
                    label={{
                      text: traveler.fullName?.charAt(0)?.toUpperCase() || 'T',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  />
                ))}
              </GoogleMap>

              {!userLocation && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm text-center space-y-4">
                  <LocateFixed className="w-10 h-10 text-amber-600" />
                  <p className="font-semibold text-gray-800">Share your location to see nearby users</p>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                  >
                    Share location
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllTravelersOnMap;

