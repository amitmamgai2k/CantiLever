import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Loader2,
  Camera,
  Edit3,
  UserPlus,
  Globe,
  Lock
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleActivity, getParticipants } from '../../redux/slices/userActivitySlice';
import toast from 'react-hot-toast';

function ChatGroupCreation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleActivity, participants } = useSelector((state) => state.userActivity);
  const { user } = useSelector((state) => state.userAuth);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    avatar: '',
    privacy: 'private',
    participants: []
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        dispatch(getSingleActivity(id)),
        dispatch(getParticipants(id))
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (singleActivity && participants) {
      setGroupData(prev => ({
        ...prev,
        name: `${singleActivity.title} - Chat`,
        description: `Group chat for "${singleActivity.title}"`,
        participants: participants.map(p => ({
          ...p,
          selected: true,
          role: p._id === user?._id ? 'admin' : 'member'
        }))
      }));
    }
  }, [singleActivity, participants, user]);

  const handleInputChange = (field, value) => {
    setGroupData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParticipantToggle = (participantId) => {
    setGroupData(prev => ({
      ...prev,
      participants: prev.participants.map(p =>
        p._id === participantId ? { ...p, selected: !p.selected } : p
      )
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setGroupData(prev => ({
            ...prev,
            avatar: e.target.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleCreateGroup = async () => {
    if (!groupData.name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    const selectedParticipants = groupData.participants.filter(p => p.selected);
    if (selectedParticipants.length < 2) {
      toast.error('Please select at least 2 participants');
      return;
    }

    setCreating(true);

    try {
      const chatGroupData = {
        activityId: id,
        name: groupData.name,
        description: groupData.description,
        avatar: groupData.avatar,
        privacy: groupData.privacy,
        participants: selectedParticipants.map(p => ({
          userId: p._id,
          role: p.role
        }))
      };

      console.log('Creating chat group:', chatGroupData);

      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Chat group created successfully!');
      navigate(`/chat-room/${id}`, { replace: true });
    } catch (error) {
      toast.error('Failed to create chat group');
      console.error('Error creating chat group:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin w-12 h-12 text-amber-600" />
          <p className="mt-4 text-gray-600 font-medium">Loading activity details...</p>
        </div>
      </div>
    );
  }

  const selectedCount = groupData.participants.filter(p => p.selected).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">



            <h1 className="text-2xl font-bold text-gray-900 text-center">Create Chat Group</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                Group Information
              </h2>

              {/* Group Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center overflow-hidden">
                    {groupData.avatar ? (
                      <img
                        src={groupData.avatar}
                        alt="Group Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-10 h-10 text-white" />
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <label
                    htmlFor="group-avatar-upload"
                    className="inline-flex items-center px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg cursor-pointer transition-colors text-sm"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photo
                  </label>
                  <input
                    id="group-avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    value={groupData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-amber-500 outline-none"
                    placeholder="Enter group name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={groupData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-amber-500 outline-none resize-none"
                    rows="3"
                    placeholder="Describe the purpose of this group"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Privacy Setting
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="privacy"
                        value="private"
                        checked={groupData.privacy === 'private'}
                        onChange={(e) => handleInputChange('privacy', e.target.value)}
                        className="mr-3"
                      />
                      <Lock className="w-4 h-4 mr-2 text-gray-600" />
                      <div>
                        <div className="font-medium">Private</div>
                        <div className="text-xs text-gray-600">Only invited members</div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="privacy"
                        value="public"
                        checked={groupData.privacy === 'public'}
                        onChange={(e) => handleInputChange('privacy', e.target.value)}
                        className="mr-3"
                      />
                      <Globe className="w-4 h-4 mr-2 text-gray-600" />
                      <div>
                        <div className="font-medium">Public</div>
                        <div className="text-xs text-gray-600">Anyone can join</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-600" />
                Select Participants
              </h2>

              <p className="text-sm text-gray-600 mb-4">
                {selectedCount} of {groupData.participants.length} selected
              </p>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {groupData.participants.map((participant) => (
                  <div
                    key={participant._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={participant.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                        alt={participant.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-sm">
                          {participant.fullName}
                          {participant.role === 'admin' && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={participant.selected}
                      onChange={() => handleParticipantToggle(participant._id)}
                      disabled={participant.role === 'admin'}
                      className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <button
                onClick={handleCreateGroup}
                disabled={creating || !groupData.name.trim() || selectedCount < 2}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Group...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Create Chat Group
                  </>
                )}
              </button>

              {selectedCount < 2 && (
                <p className="text-xs text-red-500 mt-2 text-center">
                  Please select at least 2 participants
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatGroupCreation;