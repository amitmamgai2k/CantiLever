import {
  Save,
  X,
  Camera,
  User,
  Heart,
  Plane,
  ArrowLeft,
  Instagram,
  Facebook,
  Linkedin,
  MapPin,
  Calendar
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../../redux/slices/userAuthSlice';
import toast from 'react-hot-toast';

function UpdateProfile() {
  const currentUser = useSelector((state) => state.userAuth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    profilePicture: '',
    interests: [],
    futureDestinations: [],
    socialLinks: {
      instagram: '',
      facebook: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || '',
        bio: currentUser.bio || '',
        profilePicture: currentUser.profilePicture || '',
        interests: currentUser.interests || [],
        futureDestinations: currentUser.futureDestinations || [],
        socialLinks: {
          instagram: currentUser.socialLinks?.instagram || '',
          facebook: currentUser.socialLinks?.facebook || '',
          linkedin: currentUser.socialLinks?.linkedin || ''
        }
      });
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleDestinationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      futureDestinations: prev.futureDestinations.map((dest, i) =>
        i === index ? { ...dest, [field]: value } : dest
      )
    }));
  };

  const addInterest = () => {
    setFormData(prev => ({
      ...prev,
      interests: [...prev.interests, '']
    }));
  };

  const removeInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const addDestination = () => {
    setFormData(prev => ({
      ...prev,
      futureDestinations: [...prev.futureDestinations, {
        name: '',
        lat: '',
        lng: '',
        startDate: '',
        endDate: ''
      }]
    }));
  };

  const removeDestination = (index) => {
    setFormData(prev => ({
      ...prev,
      futureDestinations: prev.futureDestinations.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            profilePicture: e.target.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleSave = () => {
    // Clean and validate data
    const cleanedData = {
      ...formData,
      interests: formData.interests.filter(item => item.trim() !== ''),
      futureDestinations: formData.futureDestinations.filter(dest =>
        dest.name && dest.name.trim() !== ''
      ).map(dest => ({
        ...dest,
        lat: dest.lat ? Number(dest.lat) : undefined,
        lng: dest.lng ? Number(dest.lng) : undefined,
        startDate: dest.startDate ? new Date(dest.startDate) : undefined,
        endDate: dest.endDate ? new Date(dest.endDate) : undefined
      })),
      socialLinks: {
        instagram: formData.socialLinks.instagram.trim(),
        facebook: formData.socialLinks.facebook.trim(),
        linkedin: formData.socialLinks.linkedin.trim()
      }
    };

    dispatch(updateUserProfile(cleanedData));
    toast.success('Profile updated successfully');
    setTimeout(() => {
       navigate('/profile');


    }, 2000);

  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-yellow-50 shadow-xl rounded-3xl p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">

            <h1 className="text-2xl font-bold text-gray-800">Update Profile</h1>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Save size={16} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img
                src={formData.profilePicture || currentUser.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="profile-image-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
              >
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:border-blue-500 outline-none"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700  mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className="w-full p-3 border border-gray-300 bg-white rounded-lg focus:border-blue-500 outline-none resize-none"
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Instagram size={16} className="text-pink-500" />
                Instagram
              </label>
              <input
                type="text"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                placeholder="Instagram username or URL"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Facebook size={16} className="text-blue-600" />
                Facebook
              </label>
              <input
                type="text"
                value={formData.socialLinks.facebook}
                onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                placeholder="Facebook username or URL"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Linkedin size={16} className="text-blue-700" />
                LinkedIn
              </label>
              <input
                type="text"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                placeholder="LinkedIn username or URL"
              />
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="text-red-500" size={20} />
            Interests
          </h2>
          <div className="space-y-3">
            {formData.interests.map((interest, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={interest}
                  onChange={(e) => handleArrayChange('interests', index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="Enter interest"
                />
                <button
                  onClick={() => removeInterest(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addInterest}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Interest
            </button>
          </div>
        </div>

        {/* Future Destinations Section */}
        <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Plane className="text-blue-500" size={20} />
            Dream Destinations
          </h2>
          <div className="space-y-6">
            {formData.futureDestinations.map((destination, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Destination {index + 1}</h3>
                  <button
                    onClick={() => removeDestination(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <MapPin size={14} />
                    Destination Name
                  </label>
                  <input
                    type="text"
                    value={destination.name || ''}
                    onChange={(e) => handleDestinationChange(index, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                    placeholder="e.g., Paris, France"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={destination.lat || ''}
                      onChange={(e) => handleDestinationChange(index, 'lat', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="48.8566"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={destination.lng || ''}
                      onChange={(e) => handleDestinationChange(index, 'lng', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="2.3522"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar size={14} />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={destination.startDate ? new Date(destination.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleDestinationChange(index, 'startDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar size={14} />
                      End Date
                    </label>
                    <input
                      type="date"
                      value={destination.endDate ? new Date(destination.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleDestinationChange(index, 'endDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addDestination}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Destination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;