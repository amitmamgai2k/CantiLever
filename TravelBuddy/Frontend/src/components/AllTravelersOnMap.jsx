import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin, Users, Search, Filter, Navigation, Loader2 } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Dummy travelers data
const travelers = [
  { id: 1, name: 'Amit', location: { lat: 28.6139, lng: 77.2090 }, city: 'Delhi', avatar: '👨‍💼' },
  { id: 2, name: 'Raj', location: { lat: 19.0760, lng: 72.8777 }, city: 'Mumbai', avatar: '👨‍🎨' },
  { id: 3, name: 'Priya', location: { lat: 12.9716, lng: 77.5946 }, city: 'Bangalore', avatar: '👩‍💻' },
  { id: 4, name: 'Sara', location: { lat: 22.5726, lng: 88.3639 }, city: 'Kolkata', avatar: '👩‍🎓' },
  { id: 5, name: 'John', location: { lat: 23.0225, lng: 72.5714 }, city: 'Pune', avatar: '👨‍🚀' },
  { id: 6, name: 'Emily', location: { lat: 13.0827, lng: 80.2707 }, city: 'Chennai', avatar: '👩‍🎤' },
  { id: 7, name: 'Michael', location: { lat: 28.7041, lng: 77.1025 }, city: 'Gurugram', avatar: '👨‍🏫' },
];

function AllTravelersOnMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [showList, setShowList] = useState(false);

  const center = { lat: 21.146633, lng: 79.088860 };

  const filteredTravelers = travelers.filter(traveler =>
    traveler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    traveler.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading map...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we prepare the travelers map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  overflow-x-hidden">
      {/* Mobile-First Header */}
      <div className="bg-white shadow-lg sticky top-0 z-20">
        <div className="px-4 py-4 sm:px-6">
          {/* Title Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-100 p-2 rounded-xl">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Your Nearby Travelers
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredTravelers.length} travelers online
                </p>
              </div>
            </div>

            {/* Toggle List View Button */}
            <button
              onClick={() => setShowList(!showList)}
              className="sm:hidden bg-amber-600 text-white p-2 rounded-xl hover:bg-amber-700 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search travelers or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row min-h-[calc(100vh-120px)]">
        {/* Travelers List - Mobile First */}
        <div className={`${showList ? 'block' : 'hidden'} sm:block sm:w-80 bg-white border-r border-gray-200 overflow-y-auto max-h-[300px] sm:max-h-155`}>
          <div className="p-4 space-y-3 pb-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-lg">Active Travelers</h2>
              {/* Mobile scroll indicator */}
              <div className="sm:hidden text-xs text-gray-500 flex items-center">
                {filteredTravelers.length > 4 && (
                  <>
                    <div className="w-1 h-4 bg-amber-300 rounded-full mr-1 animate-pulse"></div>
                    Scroll ({filteredTravelers.length})
                  </>
                )}
              </div>
            </div>

            {filteredTravelers.map(traveler => (
              <div
                key={traveler.id}
                onClick={() => setSelectedTraveler(traveler)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedTraveler?.id === traveler.id
                    ? 'border-amber-500 bg-amber-50 shadow-md'
                    : 'border-gray-100 hover:border-amber-300 hover:bg-amber-25'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{traveler.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {traveler.name}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <MapPin className="h-3 w-3 text-amber-500" />
                      <p className="text-sm text-gray-600 truncate">
                        {traveler.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            ))}

            {filteredTravelers.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No travelers found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Container - Mobile First */}
        <div className="flex-1 p-3 sm:p-4 min-h-[500px]">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[480px] sm:h-[600px]">
            {/* Map Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Navigation className="h-5 w-5" />
                  <span className="font-medium">Live Locations</span>
                </div>
                <div className="flex items-center space-x-2 text-amber-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Real-time</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="h-[430px] sm:h-[550px]">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={5}
                options={{
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                }}
              >
                {filteredTravelers.map(traveler => (
                  <Marker
                    key={traveler.id}
                    position={traveler.location}
                    title={`${traveler.name} - ${traveler.city}`}
                    onClick={() => setSelectedTraveler(traveler)}
                  />
                ))}
              </GoogleMap>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}

export default AllTravelersOnMap;