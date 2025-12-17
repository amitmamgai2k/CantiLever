import React from 'react';
import {
  Mail,
  Phone,
  User,
  MapPin,
  Calendar,
  Heart,
  Plane,
  Users,
  Globe,
  Edit,
  Shield,
  Activity
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CurrentLocationMap from '../../components/CurrentLocationMap';

function UserProfile() {
  const user = useSelector((state) => state.userAuth.user);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#030712]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400 mx-auto"></div>
          <p className="text-white/60 text-lg">Loading profile...</p>
        </div>
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

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="relative">
              <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-amber-400 to-rose-500">
                <img
                  src={user.profilePicture || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover border-4 border-[#030712]"
                />
              </div>
              <div className={`absolute bottom-3 right-3 w-6 h-6 rounded-full border-4 border-[#030712] ${
                user.isOnline ? 'bg-emerald-500' : 'bg-gray-500'
              }`}></div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{user.fullName}</h1>
                <div className="flex items-center justify-center md:justify-start gap-3 text-white/60">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                     user.isOnline
                     ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                     : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
                  }`}>
                    {user.isOnline ? 'Online now' : 'Offline'}
                  </div>
                  <span className="flex items-center gap-1 text-sm">
                    <Calendar size={14} /> Joined {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>

               {user.bio ? (
                <p className="text-white/80 leading-relaxed max-w-2xl mx-auto md:mx-0 bg-white/5 p-4 rounded-2xl border border-white/5 italic">
                  "{user.bio}"
                </p>
              ) : (
                <p className="text-white/40 italic">No bio added yet.</p>
              )}

              <button
                onClick={() => navigate('/update-profile')}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-medium transition-all duration-300"
              >
                <Edit size={16} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column: Stats & Info */}
          <div className="space-y-8">
             {/* Stats Card */}
             <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <h3 className="text-sm uppercase tracking-widest text-white/50 mb-6 font-semibold flex items-center gap-2">
                  <Activity size={16} /> Activity Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 rounded-2xl border border-white/5 text-center">
                    <div className="text-2xl font-bold text-indigo-400 mb-1">{user.JoinActivity?.length || 0}</div>
                    <div className="text-xs text-white/50">Joined</div>
                  </div>
                   <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-4 rounded-2xl border border-white/5 text-center">
                    <div className="text-2xl font-bold text-amber-400 mb-1">{user.createdActivities?.length || 0}</div>
                    <div className="text-xs text-white/50">Created</div>
                  </div>
                   <div className="bg-gradient-to-br from-rose-500/20 to-pink-500/20 p-4 rounded-2xl border border-white/5 text-center">
                    <div className="text-2xl font-bold text-rose-400 mb-1">{user.interests?.length || 0}</div>
                    <div className="text-xs text-white/50">Interests</div>
                  </div>
                   <div className="bg-gradient-to-br from-teal-500/20 to-emerald-500/20 p-4 rounded-2xl border border-white/5 text-center">
                    <div className="text-2xl font-bold text-teal-400 mb-1">{user.futureDestinations?.length || 0}</div>
                    <div className="text-xs text-white/50">Destinations</div>
                  </div>
                </div>
             </div>

            {/* Contact Info */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
               <h3 className="text-sm uppercase tracking-widest text-white/50 mb-6 font-semibold flex items-center gap-2">
                  <Shield size={16} /> Contact Details
                </h3>
                <div className="space-y-4">
                   <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-white/5">
                      <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Mail size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-white/40 mb-0.5">Email Address</p>
                        <p className="text-sm text-white/90 font-medium truncate">{user.email}</p>
                      </div>
                   </div>

                   <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition border border-white/5">
                      <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-0.5">Phone Number</p>
                        <p className="text-sm text-white/90 font-medium">{user.mobile || 'Not set'}</p>
                      </div>
                   </div>
                </div>
            </div>
          </div>

          {/* Middle/Right: Dynamic Content */}
          <div className="lg:col-span-2 space-y-8">

             {/* Location Map */}
             <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm uppercase tracking-widest text-white/50 font-semibold flex items-center gap-2">
                    <MapPin size={16} /> Live Location
                  </h3>
                   <span className="text-xs text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 animate-pulse">
                      Last updated just now
                   </span>
                </div>
                <div className="h-64 rounded-2xl overflow-hidden border border-white/10">
                   <CurrentLocationMap lat={user.currentLocation?.lat} lng={user.currentLocation?.lng} />
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                {/* Interests */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm flex flex-col">
                   <h3 className="text-sm uppercase tracking-widest text-white/50 mb-6 font-semibold flex items-center gap-2">
                      <Heart size={16} className="text-rose-500" /> Interests
                    </h3>
                    <div className="flex flex-wrap gap-2 content-start flex-1">
                      {user.interests?.length > 0 ? (
                        user.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 border border-white/10 rounded-lg text-xs font-medium text-white/70 transition-colors cursor-default"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-sm py-8 border-2 border-dashed border-white/10 rounded-2xl">
                           <Heart size={24} className="mb-2 opacity-50" />
                           <span>No interests added</span>
                        </div>
                      )}
                    </div>
                </div>

                {/* Destinations */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm flex flex-col">
                   <h3 className="text-sm uppercase tracking-widest text-white/50 mb-6 font-semibold flex items-center gap-2">
                      <Plane size={16} className="text-sky-500" /> Planned Trips
                    </h3>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                      {user.futureDestinations?.length > 0 ? (
                        user.futureDestinations.map((destination, index) => (
                          <div
                            key={index}
                            className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-2xl group hover:bg-sky-500/20 transition"
                          >
                            <div className="flex items-center gap-3 mb-2">
                               <MapPin size={16} className="text-sky-400" />
                               <span className="font-semibold text-white/90">{destination.locationName || destination.destination || 'Unknown Location'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-white/60">
                               <Calendar size={14} />
                               {new Date(destination.startDate).toLocaleDateString()} - {new Date(destination.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-sm py-8 border-2 border-dashed border-white/10 rounded-2xl">
                           <Plane size={24} className="mb-2 opacity-50" />
                           <span>No trips planned</span>
                        </div>
                      )}
                    </div>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;