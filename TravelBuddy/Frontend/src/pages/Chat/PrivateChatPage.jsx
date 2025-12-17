import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { accessPrivateChat, fetchPrivateMessages, sendPrivateMessage, addPrivateMessage } from '../../redux/slices/privateChatSlice';
import { useSocket } from '../../context/SocketContext';
import { Send, ArrowLeft, Loader2, MoreVertical } from 'lucide-react';

const PrivateChatPage = () => {
  const { userId } = useParams(); // The other user's ID
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();

  const [newMessage, setNewMessage] = useState("");
  const { selectedChat, messages, loading, chats } = useSelector(state => state.privateChat);
  const currentUser = useSelector(state => state.userAuth.user);
  const messagesEndRef = useRef(null);

  useEffect(() => {
     if(userId) {
         dispatch(accessPrivateChat(userId));
     }
  }, [userId, dispatch]);

  useEffect(() => {
     if(selectedChat) {
         dispatch(fetchPrivateMessages(selectedChat._id));
     }
  }, [selectedChat, dispatch]);

  useEffect(() => {
      // Logic handled in SocketContext technically, but for specific chat room updates:
      if(socket && selectedChat) {
           socket.emit('joinPrivateChat', selectedChat._id);

           const handleMessageReceived = (newMessageReceived) => {
               if (!selectedChat || selectedChat._id !== newMessageReceived.chatId._id) {
                    // Notification logic could go here if not handled elsewhere
               } else {
                    // Prevent duplications if message is from self (already handled by Redux thunk)
                    if (newMessageReceived.sender._id !== currentUser._id) {
                        dispatch(addPrivateMessage(newMessageReceived));
                    }
               }
           };

           socket.on('message received', handleMessageReceived);

           return () => {
               socket.off('message received', handleMessageReceived);
               socket.emit('leavePrivateChat', selectedChat._id);
           }
      }
  }, [socket, selectedChat, dispatch]);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if(newMessage.trim() && selectedChat) {
        await dispatch(sendPrivateMessage({ chatId: selectedChat._id, text: newMessage }));
        setNewMessage("");
    }
  };

  const getOtherUser = (chat) => {
      if(!chat || !currentUser) return null;
      return chat.participants.find(p => p._id !== currentUser._id);
  };

  const otherUser = getOtherUser(selectedChat);

  if (!selectedChat || loading) {
      return (
          <div className="h-screen flex items-center justify-center bg-[#050b1b]">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin"/>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-screen bg-[#050b1b]">
      {/* Header */}
      <div className="h-16 border-b border-gray-800 flex items-center px-4 bg-[#0b1221] justify-between">
          <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
                  <ArrowLeft size={24} />
              </button>
              {otherUser && (
                  <div className="flex items-center gap-3">
                      <img
                          src={otherUser.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
                          alt={otherUser.fullName}
                          className="w-10 h-10 rounded-full object-cover bg-gray-700"
                      />
                      <div>
                          <h2 className="text-white font-bold">{otherUser.fullName}</h2>
                          <p className="text-xs text-green-500">Online</p>
                          {/* Online status would need socket tracking */}
                      </div>
                  </div>
              )}
          </div>
          <button className="text-gray-400 hover:text-white">
              <MoreVertical size={20} />
          </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#050b1b]">
          {messages.map((message, index) => {
              const isMe = message.sender._id === currentUser._id;
              return (
                  <div key={message._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isMe
                          ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-br-none'
                          : 'bg-[#1f2937] text-gray-200 rounded-bl-none'
                      }`}>
                          <p className="text-sm">{message.text}</p>
                          <span className={`text-[10px] block mt-1 ${isMe ? 'text-white/70 text-right' : 'text-gray-500'}`}>
                             {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                      </div>
                  </div>
              )
          })}
          <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#0b1221] border-t border-gray-800">
          <form onSubmit={sendMessageHandler} className="flex items-center gap-3 max-w-4xl mx-auto">
              <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#1f2937] text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-gray-700"
              />
              <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-gradient-to-r from-amber-500 to-rose-600 rounded-full text-white shadow-lg shadow-amber-500/20 disabled:opacity-50 hover:scale-105 transition"
              >
                  <Send size={20} />
              </button>
          </form>
      </div>
    </div>
  );
};

export default PrivateChatPage;
