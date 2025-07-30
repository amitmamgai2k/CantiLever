import {
  Mail,
  Phone,
  User,
  MapPin,
  Calendar,
  Heart,
  Plane,
  Users,
  Globe
} from 'lucide-react';
import { useSelector } from 'react-redux';
import CurrentLocationMap from '../../components/CurrentLocationMap';

function UserProfile() {
  const user = useSelector((state) => state.userAuth.user);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-orange-100 shadow-xl rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100 to-transparent rounded-full opacity-50 -translate-y-32 translate-x-32"></div>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
            <div className="relative">
              <img
                src={user.profilePicture}
                alt={`${user.fullName}'s profile`}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${
                user.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                {user.fullName}
              </h1>

              <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-gray-600">
                  {user.isOnline ? 'Online now' : 'Offline'}
                </span>
              </div>

              {user.bio && (
                <p className="text-gray-600 bg-amber-100 text-sm font-semibold tracking-wide leading-relaxed shadow-2xl text-justify   p-3 rounded-lg">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-blue-100 shadow-xl rounded-3xl p-6 sm:p-8 ">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <User className="text-blue-600" size={24} />
              Contact Information
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <Mail size={24} className="text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-gray-700 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                <Phone size={24} className="text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Phone</p>
                  <p className="text-gray-700 font-medium">{user.mobile}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                <Calendar size={24} className="text-purple-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Joined</p>
                  <p className="text-gray-700 font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interests & Destinations */}
          <div className="space-y-6">
            {/* Interests */}
            <div className="bg-pink-100 shadow-xl rounded-3xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Heart className="text-red-500" size={24} />
                Interests
              </h2>

              <div className="flex flex-wrap gap-2">
                {user.interests?.length > 0 ? (
                  user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No interests added yet</p>
                )}
              </div>
            </div>

            {/* Future Destinations */}
            <div className=" bg-red-50 shadow-xl rounded-3xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Plane className="text-blue-500" size={24} />
                Future Destinations
              </h2>

             <div className="flex flex-col gap-2 overflow-y-auto">
  {user.futureDestinations?.length > 0 ? (
    user.futureDestinations.map((destination, index) => (
      <div
        key={index}
        className="p-4 bg-cyan-50 rounded-lg shadow text-sm text-gray-700 space-y-2"
      >
        <p className="flex items-center gap-2">
          <MapPin size={24} className="text-blue-600" />
          Manali

        </p>

        <p className="flex items-center gap-2">
          <Calendar size={24} className="text-purple-600" />

          {new Date(destination.startDate).toLocaleDateString() - new Date(destination.endDate).toLocaleDateString()}
        </p>

      </div>
    ))
  ) : (
    <p className="text-gray-500 italic">No destinations planned yet</p>
  )}
</div>

            </div>
          </div>
        </div>

        {/* Location & Activity Stats */}
        <div className="grid md:grid-cols-2 gap-6 mt-6 ">
          {/* Current Location */}
          <div className="bg-yellow-50 shadow-xl rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <MapPin className="text-green-500" size={24} />
              Current Location
            </h2>
                         <div className="h-50 rounded-2xl overflow-hidden">
                           <CurrentLocationMap lat={user.currentLocation?.lat} lng={user.currentLocation?.lng} />
                     </div>
          </div>

          {/* Activity Stats */}
          <div className="bg-gray-200 shadow-xl rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Users className="text-purple-500" size={24} />
              Activity Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-600">Activities Joined</span>
                <span className="font-bold text-purple-600">{user.JoinActivity?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-600">Interests</span>
                <span className="font-bold text-orange-600">{user.interests?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                <span className="text-gray-600">Future Destinations</span>
                <span className="font-bold text-teal-600">{user.futureDestinations?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;