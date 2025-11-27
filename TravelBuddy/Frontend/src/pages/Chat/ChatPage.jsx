import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, Users, X, Smile, MoreVertical, Shield, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addRealtimeMessage,
  fetchChatGroupByActivity,
  fetchGroupMessages,
  joinChatGroup,
  sendGroupMessage
} from '../../redux/slices/ChatSlice';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

function ChattingPage() {
  const { id: activityId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  const { currentGroup, messages, messagesLoading, joining, sending, loading } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.userAuth);
  const userId = user?._id || user?.id;

  const [newMessage, setNewMessage] = useState('');
  const [showMembers, setShowMembers] = useState(true);

  useEffect(() => {
    if (activityId) {
      dispatch(fetchChatGroupByActivity(activityId));
    }
  }, [activityId, dispatch]);

  const isMember = useMemo(() => {
    if (!currentGroup || !userId) return false;
    return currentGroup.participants?.some(
      (participant) => participant.userId?._id === userId
    );
  }, [currentGroup, userId]);

  useEffect(() => {
    if (currentGroup?._id && isMember) {
      dispatch(fetchGroupMessages(currentGroup._id));
    }
  }, [currentGroup?._id, isMember, dispatch]);

  useEffect(() => {
    if (!socket || !currentGroup?._id || !isMember) return undefined;

    socket.emit('joinChatRoom', currentGroup._id);
    const handler = (message) => dispatch(addRealtimeMessage(message));

    socket.on('chatMessage', handler);

    return () => {
      socket.emit('leaveChatRoom', currentGroup._id);
      socket.off('chatMessage', handler);
    };
  }, [socket, currentGroup?._id, isMember, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!currentGroup?._id) return;
    const text = newMessage.trim();
    setNewMessage('');
    await dispatch(sendGroupMessage({ chatId: currentGroup._id, text }));
  };

  const handleJoin = async () => {
    if (!currentGroup?._id) {
      toast.error('Chat group not found');
      return;
    }
    const result = await dispatch(joinChatGroup(currentGroup._id));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(fetchGroupMessages(currentGroup._id));
    }
  };

  if (loading && !currentGroup) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 space-y-4 px-4 text-center">
        <Shield className="w-16 h-16 text-amber-600" />
        <h1 className="text-2xl font-bold text-gray-900">No chat group yet</h1>
        <p className="text-gray-600 max-w-md">
          This activity does not have a chat group yet. Create one to connect with participants in
          real time.
        </p>
        <button
          onClick={() => navigate(`/chat/${activityId}`)}
          className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
        >
          Create chat group
        </button>
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50 to-orange-100 px-4">
        <div className="max-w-lg w-full bg-white shadow-2xl rounded-2xl p-10 space-y-6 border border-amber-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center">
              {currentGroup.avatar ? (
                <img src={currentGroup.avatar} alt={currentGroup.name} className="object-cover" />
              ) : (
                <Users className="w-8 h-8 text-amber-600" />
              )}
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">Activity chat</p>
              <h1 className="text-2xl font-bold text-gray-900">{currentGroup.name}</h1>
              <p className="text-sm text-gray-500">
                {currentGroup.participants?.length || 0} participants
              </p>
            </div>
          </div>

          <p className="text-gray-600">{currentGroup.description}</p>

          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full py-3 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {joining ? 'Joining...' : 'Join group chat'}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 flex flex-col">
        <div className="bg-white/80 backdrop-blur-sm p-6 border-b border-gray-200/50 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              {currentGroup.avatar ? (
                <img src={currentGroup.avatar} alt={currentGroup.name} className="object-cover" />
              ) : (
                <Users className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">{currentGroup.name}</h1>
              <p className="text-sm text-gray-600">
                {currentGroup.participants?.length || 0} members • {currentGroup.privacy} group
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowMembers(!showMembers)}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                showMembers ? 'bg-amber-100 text-amber-700 shadow-sm' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50">
          {messagesLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender?._id === userId;
              return (
                <div
                  key={msg._id}
                  className={`flex items-end space-x-3 ${isMine ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {!isMine && (
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center text-sm font-semibold text-amber-700">
                      {msg.sender?.profilePicture ? (
                        <img
                          src={msg.sender.profilePicture}
                          alt={msg.sender?.fullName}
                          className="object-cover"
                        />
                      ) : (
                        msg.sender?.fullName?.charAt(0)?.toUpperCase()
                      )}
                    </div>
                  )}
                  <div className={`max-w-md group ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!isMine && (
                      <p className="text-xs font-semibold text-gray-600 mb-1 px-1">{msg.sender?.fullName}</p>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        isMine
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-br-md'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md hover:border-gray-300'
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                      <p
                        className={`text-xs mt-2 ${
                          isMine ? 'text-amber-100' : 'text-gray-500'
                        } opacity-75 group-hover:opacity-100 transition-opacity`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
          <div className="flex items-center space-x-4 max-w-4xl">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-200 rounded-full transition-colors">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className={`p-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl ${
                newMessage.trim() && !sending
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {showMembers && (
        <div className="w-80 bg-white/90 backdrop-blur-sm border-l border-gray-200/50 shadow-xl">
          <div className="p-6 border-b border-gray-200/50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-900">Participants</h3>
              <p className="text-sm text-gray-500 mt-1">
                {currentGroup.participants?.length || 0} members
              </p>
            </div>
            <button
              onClick={() => setShowMembers(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="p-4 space-y-3 overflow-y-auto">
            {currentGroup.participants?.map((participant) => (
              <div
                key={participant.userId?._id}
                className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center text-white font-bold shadow-md overflow-hidden">
                    {participant.userId?.profilePicture ? (
                      <img
                        src={participant.userId.profilePicture}
                        alt={participant.userId.fullName}
                        className="object-cover"
                      />
                    ) : (
                      participant.userId?.fullName?.charAt(0)
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{participant.userId?.fullName}</p>
                  <p className="text-sm text-gray-600 capitalize">{participant.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChattingPage;