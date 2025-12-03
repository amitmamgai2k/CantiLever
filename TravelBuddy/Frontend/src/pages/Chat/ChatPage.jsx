import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, Users, X, Smile, MoreVertical, Shield, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addRealtimeMessage,
  fetchChatGroupByActivity,
  fetchGroupMessages,
  joinChatGroup,
  sendGroupMessage,
} from '../../redux/slices/ChatSlice';
import { useSocket } from '../../context/SocketContext';
import toast from 'react-hot-toast';

function ChatPage() {
  const { id: activityId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isUserNearBottom = useRef(true);
  const SCROLL_THRESHOLD = 200;

  const { currentGroup, messages, messagesLoading, joining, sending, loading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.userAuth);
  const userId = user?._id || user?.id;

  const [newMessage, setNewMessage] = useState('');
  const [showMembers, setShowMembers] = useState(true);

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (activityId) dispatch(fetchChatGroupByActivity(activityId));
  }, [activityId, dispatch]);

  const isMember = useMemo(() => {
    if (!currentGroup || !userId) return false;
    return currentGroup.participants?.some(p => p.userId?._id === userId || p.userId === userId);
  }, [currentGroup, userId]);

  useEffect(() => {
    if (currentGroup?._id && isMember) {
      dispatch(fetchGroupMessages(currentGroup._id));
    }
  }, [currentGroup?._id, isMember, dispatch]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const checkPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      isUserNearBottom.current = scrollHeight - (scrollTop + clientHeight) <= SCROLL_THRESHOLD;
    };

    container.addEventListener('scroll', checkPosition);
    checkPosition();

    return () => container.removeEventListener('scroll', checkPosition);
  }, []);

  useEffect(() => {
    if (isUserNearBottom.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket || !currentGroup?._id || !isMember) return;

    socket.emit('joinChatRoom', currentGroup._id);

    const handleNewMessage = (message) => {
      if (message._id && messagesRef.current.some(m => m._id === message._id)) return;

      const senderId = message.sender?._id || message.sender;
      const isMyMessage = String(senderId) === String(userId);

      if (!isMyMessage) {
        dispatch(addRealtimeMessage(message));
      }
    };

    socket.on('chatMessage', handleNewMessage);

    return () => {
      socket.emit('leaveChatRoom', currentGroup._id);
      socket.off('chatMessage', handleNewMessage);
    };
  }, [socket, currentGroup?._id, isMember, dispatch, userId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending || !currentGroup?._id) return;
    const text = newMessage.trim();
    setNewMessage('');
    await dispatch(sendGroupMessage({ chatId: currentGroup._id, text }));
  };

  const handleJoin = async () => {
    if (!currentGroup?._id) return toast.error('Chat group not found');
    const result = await dispatch(joinChatGroup(currentGroup._id));
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(fetchGroupMessages(currentGroup._id));
    }
  };

  if (loading && !currentGroup) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-300 gap-6">
        <Shield className="w-16 h-16 text-amber-500" />
        <h1 className="text-3xl font-bold">No Chat Group Yet</h1>
        <p className="text-center max-w-md text-gray-400">
          This activity doesn't have a chat group yet. Create one to connect with others.
        </p>
        <button
          onClick={() => navigate(`/chat/${activityId}`)}
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transition"
        >
          Create Chat Group
        </button>
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              {currentGroup.avatar ? (
                <img src={currentGroup.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Users className="w-9 h-9 text-white" />
              )}
            </div>
            <div>
              <p className="text-amber-400 text-sm font-medium">Activity Chat</p>
              <h1 className="text-2xl font-bold text-white">{currentGroup.name}</h1>
            </div>
          </div>
          <p className="text-gray-400 mb-8">{currentGroup.description}</p>
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-700 transition disabled:opacity-60"
          >
            {joining ? 'Joining...' : 'Join Group Chat'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-3 py-4 border border-gray-600 text-gray-400 rounded-xl hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-900 text-gray-100">
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-800/90 backdrop-blur-md border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl">
              {currentGroup.avatar ? (
                <img src={currentGroup.avatar} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Users className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{currentGroup.name}</h1>
              <p className="text-sm text-gray-400">
                {currentGroup.participants?.length || 0} members • {currentGroup.privacy} group
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 hover:bg-gray-700 rounded-xl transition">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => setShowMembers(!showMembers)}
              className={`p-3 rounded-xl transition ${showMembers ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-gray-700'}`}
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-6 py-8 space-y-5 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
        >
          {messagesLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = (msg.sender?._id || msg.sender) === userId;
              return (
                <div key={msg._id} className={`flex items-end gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
                  {!isMine && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {msg.sender?.profilePicture ? (
                        <img src={msg.sender.profilePicture} alt="" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        msg.sender?.fullName?.[0]?.toUpperCase()
                      )}
                    </div>
                  )}
                  <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-xl`}>
                    {!isMine && <p className="text-xs text-gray-400 mb-1 px-1">{msg.sender?.fullName}</p>}
                    <div
                      className={`px-5 py-3 rounded-2xl shadow-lg max-w-xs md:max-w-md break-words ${
                        isMine
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-br-none'
                          : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-gray-800/90 backdrop-blur-md border-t border-gray-700 px-6 py-5">
          <div className="flex items-center gap-4 max-w-5xl mx-auto">
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
                placeholder="Type a message..."
                className="w-full px-6 py-4 bg-gray-700 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400 text-white transition"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-600 rounded-full transition">
                <Smile className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className={`p-4 rounded-2xl transition-all shadow-lg ${
                newMessage.trim() && !sending
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white hover:scale-105'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {showMembers && (
        <div className="w-80 bg-gray-800/95 backdrop-blur-md border-l border-gray-700">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Participants</h3>
              <p className="text-sm text-gray-400">{currentGroup.participants?.length || 0} members</p>
            </div>
            <button onClick={() => setShowMembers(false)} className="p-2 hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-140px)]">
            {currentGroup.participants?.map((p) => (
              <div key={p.userId?._id || p.userId} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-700/50 transition">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {p.userId?.profilePicture ? (
                    <img src={p.userId.profilePicture} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    p.userId?.fullName?.[0]?.toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-medium text-white truncate">{p.userId?.fullName}</p>
                  <p className="text-xs text-gray-400 capitalize">{p.role || 'member'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPage;