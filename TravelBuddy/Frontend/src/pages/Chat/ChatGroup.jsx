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
import { CreateChatGroup, fetchChatGroupByActivity } from '../../redux/slices/ChatSlice';
import toast from 'react-hot-toast';

function ChatGroup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGroup, loading: chatLoading } = useSelector((state) => state.chat);

  const { singleActivity, participants } = useSelector((state) => state.userActivity);
  const { user } = useSelector((state) => state.userAuth);
  const userId = user?._id || user?.id;

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    avatarFile: null,
    avatarPreview: '',
    privacy: 'private',
    participants: []
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      dispatch(getSingleActivity(id)),
      dispatch(getParticipants(id)),
      dispatch(fetchChatGroupByActivity(id))
    ]).finally(() => {
      setLoading(false);
    });
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
          role: p._id === userId ? 'admin' : 'member'
        }))
      }));
    }
  }, [singleActivity, participants, userId]);

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
        // Clean up previous preview URL
        if (groupData.avatarPreview) {
          URL.revokeObjectURL(groupData.avatarPreview);
        }

        setGroupData(prev => ({
          ...prev,
          avatarFile: file,
          avatarPreview: URL.createObjectURL(file)
        }));
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
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('activityId', id);
      formData.append('name', groupData.name);
      formData.append('description', groupData.description);
      formData.append('privacy', groupData.privacy);
      formData.append('participants', JSON.stringify(
        selectedParticipants.map(p => ({
          userId: p._id,
          role: p.role
        }))
      ));

      if (groupData.avatarFile) {
        formData.append('avatar', groupData.avatarFile);
      }

      console.log('Creating chat group with FormData');
      const result = await dispatch(CreateChatGroup(formData));
      if (result.meta.requestStatus === 'fulfilled') {
        navigate(`/activity-group/${id}`);
      }

      // Navigate back or to the chat group after successful creation
      // navigate(`/chat-group/${createdGroupId}`); // Uncomment if you have the group ID

    } catch (error) {
      console.error('Error creating chat group:', error);
      toast.error('Failed to create chat group. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Back button component
  const BackButton = () => (
    <button
      onClick={handleBack}
      className="absolute top-4 left-4 p-2 bg-white rounded-full shadow hover:bg-gray-50 transition-colors"
    >
      <ArrowLeft className="w-5 h-5 text-gray-700" />
    </button>
  );

  // Cleanup function for preview URL
  useEffect(() => {
    return () => {
      if (groupData.avatarPreview) {
        URL.revokeObjectURL(groupData.avatarPreview);
      }
    };
  }, [groupData.avatarPreview]);

  if (loading || chatLoading) {
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

  if (currentGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100 flex items-center justify-center px-4">
        <div className="max-w-xl bg-white shadow-2xl rounded-2xl p-10 text-center space-y-6">
          <Users className="w-16 h-16 text-amber-600 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900">Chat group already exists</h1>
          <p className="text-gray-600">
            You can jump into the conversation, invite friends, or manage the existing group from
            the chat room.
          </p>
          <button
            onClick={() => navigate(`/activity-group/${id}`)}
            className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
          >
            Go to group chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100">
      {/* Back Button */}
      <BackButton />

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
                    {groupData.avatarPreview ? (
                      <img
                        src={groupData.avatarPreview}
                        alt="Group Avatar Preview"
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
                    {groupData.avatarPreview ? 'Change Photo' : 'Add Photo'}
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

export default ChatGroup;