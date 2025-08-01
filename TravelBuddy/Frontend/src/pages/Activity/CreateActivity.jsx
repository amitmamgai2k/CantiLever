import  { useState,useRef } from 'react';
import { Calendar, MapPin, Users, Plus } from 'lucide-react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { createActivity ,UpdateActivity} from '../../redux/slices/userActivitySlice';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

const libraries = ['places'];


function CreateActivity() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [update, setUpdate] = useState(false);
  const activityId = location.state?.activityId || null;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    address: '',
    participantLimit: '',
    lat: 0,
    lng: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (activityId ) {
      dispatch(UpdateActivity({
        activityId,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.address,
        participantLimit: formData.participantLimit,
        lat: formData.lat,
        lng: formData.lng
      }));
      // Update existing activity logic here
    }
    else{
    dispatch(createActivity({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.address,
      participantLimit: formData.participantLimit,
      lat: formData.lat,
      lng: formData.lng
    }));
  }
    setFormData({
      title: '',
      description: '',
      date: '',
      address: '',

      participantLimit: 10
    });


  };
  const autocompleteRef = useRef(null);

    const onLoad = (autocomplete) => {
      autocompleteRef.current = autocomplete;
    };

   const onPlaceChanged = () => {
  if (autocompleteRef.current !== null) {
    const place = autocompleteRef.current.getPlace();
    console.log('Place changed:', place);
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setFormData(prev => ({
      ...prev,
      address: place.formatted_address || place.name || '',
      lat: lat,
      lng: lng
    }));
  } else {
    console.log('Autocomplete is not loaded yet!');
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {activityId && (
            <div className=" items-center justify-center mb-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Update Activity</h1>
            <p className="text-gray-600">Edit your activity details below</p>
            </div>
           )
          }
          {!activityId && (
            <>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Activity</h1>
              <p className="text-gray-600">Share an amazing experience with fellow travelers</p>
            </>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Activity Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Hiking in Central Park, Food Tour in Chinatown"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your activity, what participants can expect, skill level required, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            {/* Date & Time */}
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date & Time *
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="Select date and time"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location *
              </label>
                <LoadScript
                    googleMapsApiKey={import.meta.env.VITE_GOOGLE_API}
                    libraries={libraries}
                  >
                    <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <input
                        type="text"
                        placeholder="Search for a location"

                        style={{
                          width: '100%',
                          height: '40px',
                          padding: '0 12px',
                          fontSize: '16px',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                    </Autocomplete>
                  </LoadScript>

            </div>

            {/* Participant Limit */}
            <div>
              <label htmlFor="participantLimit" className="block text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Participant Limit
              </label>
              <input
                type="number"
                id="participantLimit"
                name="participantLimit"
                value={formData.participantLimit}
                onChange={handleInputChange}
                min="1"
                max="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="mt-1 text-sm text-gray-500">Maximum number of participants (including yourself)</p>
            </div>

            {/* Submit Button */}
           { activityId ? (
              <button
                onClick={handleSubmit}
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition duration-300"
              >
                Update Activity
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition duration-300"
              >
                Create Activity
              </button>
            )}
          </div>
        </div>


        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your activity will be visible to other travelers in your area</p>
        </div>
      </div>
    </div>
  );
}

export default CreateActivity;