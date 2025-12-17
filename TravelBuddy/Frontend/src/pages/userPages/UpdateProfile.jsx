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
  Calendar,
  Plus
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
      <div className="flex justify-center items-center h-screen bg-[#030712]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">

       {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-rose-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-sm shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 border-b border-white/10 pb-8">
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Edit Profile
            </h1>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleCancel}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-all border border-white/5"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-400 to-rose-500 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-amber-500/20"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-br from-amber-400 to-rose-500">
                <img
                  src={formData.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-[#030712] group-hover:opacity-75 transition-opacity"
                />
              </div>
              <label
                htmlFor="profile-image-upload"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300"
              >
                <Camera className="w-8 h-8 text-white scale-75 group-hover:scale-100 transition-transform" />
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <p className="mt-3 text-sm text-white/50">Tap to change photo</p>
          </div>

          {/* Basic Info Container */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                <User size={16} className="text-amber-400" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/70">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell the community about yourself..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-colors resize-none h-32"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-sm shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            Social Connections
          </h2>
          <div className="space-y-5">
            {[
              { key: 'instagram', icon: Instagram, color: 'text-pink-500', label: 'Instagram' },
              { key: 'facebook', icon: Facebook, color: 'text-blue-500', label: 'Facebook' },
              { key: 'linkedin', icon: Linkedin, color: 'text-blue-400', label: 'LinkedIn' }
            ].map((social) => (
               <div key={social.key} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                  <social.icon size={16} className={social.color} />
                  {social.label}
                </label>
                <input
                  type="text"
                  value={formData.socialLinks[social.key]}
                  onChange={(e) => handleSocialLinkChange(social.key, e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50 transition-colors"
                  placeholder={`${social.label} username or URL`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-sm shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Heart className="text-rose-500" size={20} />
            Interests
          </h2>
          <div className="space-y-4">
            {formData.interests.map((interest, index) => (
              <div key={index} className="flex gap-3 group">
                <input
                  type="text"
                  value={interest}
                  onChange={(e) => handleArrayChange('interests', index, e.target.value)}
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-rose-500/50 transition-colors"
                  placeholder="e.g. Hiking, Photography"
                />
                <button
                  onClick={() => removeInterest(index)}
                  className="p-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors opacity-50 group-hover:opacity-100"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              onClick={addInterest}
              className="flex items-center gap-2 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors py-2"
            >
              <Plus size={16} /> Add Interest
            </button>
          </div>
        </div>

        {/* Future Destinations */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
             <Plane className="text-sky-500" size={20} />
            Dream Destinations
          </h2>
          <div className="space-y-8">
            {formData.futureDestinations.map((destination, index) => (
              <div key={index} className="p-6 bg-black/20 border border-white/5 rounded-2xl space-y-4 relative group hover:border-white/10 transition-colors">
                <button
                  onClick={() => removeDestination(index)}
                  className="absolute top-4 right-4 p-2 text-white/30 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>

                <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest">
                  Trip {index + 1}
                </h3>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-white/70">
                    <MapPin size={14} className="text-amber-400" />
                    Destination Name
                  </label>
                  <input
                    type="text"
                    value={destination.name || ''}
                    onChange={(e) => handleDestinationChange(index, 'name', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors"
                    placeholder="e.g., Paris, France"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-white/70">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={destination.lat || ''}
                      onChange={(e) => handleDestinationChange(index, 'lat', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors"
                      placeholder="48.8566"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm text-white/70">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={destination.lng || ''}
                      onChange={(e) => handleDestinationChange(index, 'lng', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors"
                      placeholder="2.3522"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-white/70">
                      <Calendar size={14} className="text-purple-400" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={destination.startDate ? new Date(destination.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleDestinationChange(index, 'startDate', e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                     <label className="flex items-center gap-2 text-sm text-white/70">
                      <Calendar size={14} className="text-purple-400" />
                      End Date
                    </label>
                    <input
                      type="date"
                      value={destination.endDate ? new Date(destination.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleDestinationChange(index, 'endDate', e.target.value)}
                       className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addDestination}
              className="flex items-center gap-2 text-sm font-medium text-sky-400 hover:text-sky-300 transition-colors py-2"
            >
              <Plus size={16} /> Add Destination
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default UpdateProfile;