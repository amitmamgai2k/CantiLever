import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Loader2,
  Camera,
  Edit3
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

    setCreating(true);

    try {
      const formData = new FormData();
      formData.append('activityId', id);
      formData.append('name', groupData.name);
      formData.append('description', groupData.description);
      formData.append('privacy', groupData.privacy);
      formData.append('participants', JSON.stringify(
        groupData.participants.map(p => ({
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

  useEffect(() => {
    return () => {
      if (groupData.avatarPreview) {
        URL.revokeObjectURL(groupData.avatarPreview);
      }
    };
  }, [groupData.avatarPreview]);

  if (loading || chatLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin w-12 h-12 text-amber-500" />
          <p className="mt-4 text-gray-300 font-medium">Loading activity details...</p>
        </div>
      </div>
    );
  }

  // Calculate selected count safely (optional usage)
  const selectedCount = groupData.participants ? groupData.participants.filter(p => p.selected).length : 0;

  if (currentGroup) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-xl bg-gray-800 shadow-2xl rounded-3xl p-10 text-center space-y-6 border border-gray-700">
          <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Chat Group Already Exists</h1>
          <p className="text-gray-300 leading-relaxed">
            You can jump into the conversation, invite friends, or manage the existing group from
            the chat room.
          </p>
          <button
            onClick={() => navigate(`/activity-group/${id}`)}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Go to Group Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl shadow-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white text-center flex items-center justify-center gap-3">
              <MessageCircle className="w-8 h-8" />
              Create Chat Group
            </h1>
            <p className="text-amber-100 text-center mt-2">Set up your activity group chat in seconds</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
          {/* Main Form */}
          <div className="space-y-6">
            {/* Group Avatar Card */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-500" />
                Group Avatar
              </h2>

              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center overflow-hidden border-4 border-gray-700 shadow-xl">
                    {groupData.avatarPreview ? (
                      <img
                        src={groupData.avatarPreview}
                        alt="Group Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-14 h-14 text-white" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="group-avatar-upload"
                    className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl cursor-pointer transition-all transform hover:scale-105 shadow-lg font-medium"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    {groupData.avatarPreview ? 'Change Photo' : 'Upload Photo'}
                  </label>
                  <input
                    id="group-avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-gray-400 text-sm mt-2">Recommended: Square image, at least 400x400px</p>
              </div>
            </div>

            {/* Group Information Card */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" />
                Group Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Group Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={groupData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-white placeholder-gray-500 transition-all"
                    placeholder="Enter group name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={groupData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-none text-white placeholder-gray-500 transition-all"
                    rows="4"
                    placeholder="Describe the purpose of this group..."
                  />
                </div>
              </div>
            </div>

            {/* Create Button Card */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
              <button
                onClick={handleCreateGroup}
                disabled={creating || !groupData.name.trim()}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center justify-center"
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

              {!groupData.name.trim() && (
                <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-xs text-yellow-400 text-center font-medium">
                    ⚠️ Group name is required
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatGroup;