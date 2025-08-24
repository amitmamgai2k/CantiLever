import React, { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  MessageCircle,
  Phone,
  ArrowLeft,
  Share2,
  Heart,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { joinActivity } from '../../redux/slices/userActivitySlice';
import { getSingleActivity } from '../../redux/slices/userActivitySlice';
import toast from 'react-hot-toast';

function IndividualActivity() {
  const { id } = useParams();
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const { singleActivity } = useSelector((state) => state.userActivity);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    dispatch(getSingleActivity(id)).finally(() => {
      setLoading(false);
    });
  }, [id, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin w-12 h-12 text-amber-600" />
          <p className="mt-4 text-gray-600 font-medium">Loading activity...</p>
        </div>
      </div>
    );
  }

  if (!singleActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity not found</h2>
          <p className="text-gray-600 mb-4">The activity you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentParticipants = singleActivity.participants ? singleActivity.participants.length : 0;

  const getActivityStatus = () => {
    const spotsLeft = singleActivity.participantLimit - currentParticipants;
    if (spotsLeft <= 0) return { type: 'full', text: 'Activity Full', spotsLeft: 0 };
    if (spotsLeft <= 3) return { type: 'limited', text: `${spotsLeft} spots left`, spotsLeft };
    return { type: 'available', text: `${spotsLeft} spots available`, spotsLeft };
  };

  const status = getActivityStatus();


  const handleJoinActivity = () => {
   dispatch(joinActivity(singleActivity._id));
   if(!isJoined){
    setIsJoined(true);
   }

};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100">


      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 ">
            {/* Hero Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-auto bg-gradient-to-r from-amber-500 to-orange-600">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 ">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          status.type === 'full' ? 'bg-red-500 text-white' :
                          status.type === 'limited' ? 'bg-yellow-400 text-yellow-900' :
                          'bg-green-400 text-green-900'
                        }`}>
                          {status.text}
                        </div>
                      </div>
                      <h1 className="text-3xl font-bold text-white mb-2">{singleActivity.title}</h1>
                      <p className="text-amber-100 text-lg  ">{singleActivity.description.slice(0, 100)+"..."}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{singleActivity.date}</p>
                    <p className="text-gray-600">{singleActivity.time}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{singleActivity.location?.formattedAddress}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Participants</p>
                    <p className="text-gray-600">{currentParticipants}/{singleActivity.participantLimit} joined</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Created</p>
                    <p className="text-gray-600">{new Date(singleActivity.createdAt).toLocaleDateString().split('/').reverse().join('-')}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Activity</h3>
                <p className="text-gray-600 leading-relaxed">{singleActivity.description}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-gray-900 mb-2">Free</p>

              </div>

              {status.type === 'full' ? (
                <button
                  disabled
                  className="w-full py-4 bg-gray-400 text-white font-semibold rounded-xl cursor-not-allowed mb-4"
                >
                  Activity Full
                </button>
              ) : (
                <button
                  onClick={()=>handleJoinActivity()}
                  className={`w-full py-4 font-semibold rounded-xl transition-colors mb-4 ${
                    isJoined
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : status.type === 'limited'
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  {isJoined ? 'Joined!' : status.type === 'limited' ? 'Join Quick!' : 'Join Activity'}
                </button>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  {status.spotsLeft} of {singleActivity.participantLimit} spots available
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      status.type === 'full' ? 'bg-red-500' :
                      status.type === 'limited' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(currentParticipants / singleActivity.participantLimit) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosted by</h3>
              <div className="flex items-center space-x-4 mb-4">
                {singleActivity.creator?.profilePicture ? (
                  <img
                    src={singleActivity.creator.profilePicture}
                    alt={singleActivity.creator.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {singleActivity.creator?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{singleActivity.creator?.fullName || 'Unknown'}</h4>
                  <p className="text-sm text-gray-600">Activity Host</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 transition-colors">
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Message
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndividualActivity;