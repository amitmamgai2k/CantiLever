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
  Loader2,
  Video
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { leaveActivity } from '../../redux/slices/userActivitySlice';
import { getSingleActivity } from '../../redux/slices/userActivitySlice';
import { getParticipants } from '../../redux/slices/userActivitySlice';

import CurrentLocationMap from '../../components/CurrentLocationMap';
import ParticipantsTable from './Partipiants';


function ManageActivity() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { singleActivity } = useSelector((state) => state.userActivity);
  const {participants} = useSelector((state) => state.userActivity);

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const sampleParticipants = [
    {
      _id: '1',
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phoneNumber: '+1 (555) 123-4567',
      profilePicture: null,
      joinedAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phoneNumber: '+1 (555) 987-6543',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      joinedAt: '2024-01-16T14:20:00Z'
    },
    {
      _id: '3',
      fullName: 'Mike Chen',
      email: 'mike.chen@email.com',
      phoneNumber: '+1 (555) 456-7890',
      profilePicture: null,
      joinedAt: '2024-01-17T09:15:00Z'
    },
    {
      _id: '4',
      fullName: 'Emily Davis',
      email: 'emily.davis@email.com',
      phoneNumber: '+1 (555) 321-0987',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      joinedAt: '2024-01-18T16:45:00Z'
    },
    {
      _id: '5',
      fullName: 'David Wilson',
      email: 'david.wilson@email.com',
      phoneNumber: '+1 (555) 654-3210',
      profilePicture: null,
      joinedAt: '2024-01-19T11:30:00Z'
    }
  ];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    dispatch(getSingleActivity(id))
    dispatch(getParticipants(id))
    .then(() => setLoading(false))
  }, [id, dispatch]);

  console.log('singleActivity', singleActivity);
  console.log('participants', participants);


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

  const handleLeaveActivity = () => {
    dispatch(leaveActivity(singleActivity._id));
    navigate('/joined-activities');
  };

  // Use real participants data when available, fallback to sample data
  const participantsData = singleActivity?.participants || sampleParticipants;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-auto bg-gradient-to-r from-amber-500 to-orange-600">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
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
                      <p className="text-amber-100 text-lg">{singleActivity.description.slice(0, 100)+"..."}</p>
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

            {/* Join Chat Group*/}
            <div className="mt-4 bg-white rounded-2xl shadow-lg p-6">
              <button onClick={()=>navigate(`/chat/${singleActivity._id}`)} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full w-full">Create Chat Group</button>
            </div>

            {/* Participants Section */}
            <div className="mt-8">
              <ParticipantsTable
                participants={participants}
                activityLimit={singleActivity.participantLimit}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6 top-24 gap-4 flex flex-col">
              <button onClick={() => handleLeaveActivity()} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full w-full">
                Delete Activity
              </button>
              <button onClick={() => handleLeaveActivity()} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full w-full">
                Update Activity
              </button>
            </div>

            {/* Map Section */}
            <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <MapPin className="text-green-500" size={24} />
                Activity Location
              </h2>
              <div className="h-95 rounded-2xl overflow-hidden">
                <CurrentLocationMap lat={singleActivity.location?.coordinates[1]} lng={singleActivity.location?.coordinates[0]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageActivity;