import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../helpers/axiosInstance';
import { acceptFriendRequest, getFriendStatus } from '../../redux/slices/friendSlice'; // accept logic is in slice but slice uses requestId which we have.
import toast from 'react-hot-toast';
import { UserCheck, Clock, UserPlus, X, Loader2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MyConnections() {
    const [data, setData] = useState({ sent: [], received: [], friends: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('friends'); // friends, received, sent
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchConnections = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/friends/connections');
            setData(res.data);
        } catch (error) {
            toast.error("Failed to load connections.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    const handleAccept = async (requestId) => {
        try {
             // We can use the slice action or direct axios. Slice action is cleaner if it updates global state, but here we have local state.
             // Let's use direct axios for simplicity in updating local state, or dispatch and then refresh.
             await dispatch(acceptFriendRequest(requestId)).unwrap();
             // Refresh data
             fetchConnections();
        } catch (error) {
            console.error(error);
        }
    }

    const handleReject = async (requestId) => {
        try {
            await axiosInstance.post('/friends/reject', { requestId });
            toast.success("Request rejected");
            fetchConnections();
        } catch (error) {
            toast.error("Failed to reject request");
        }
    }

    if (loading) {
         return (
             <div className="min-h-screen bg-[#050b1b] flex items-center justify-center">
                 <Loader2 className="w-10 h-10 text-amber-500 animate-spin"/>
             </div>
         )
    }

    const { friends, sent, received } = data;

    return (
        <div className="min-h-screen bg-[#050b1b] pt-10 pb-20 px-4">
             <div className="max-w-5xl mx-auto">
                 <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                     <Users className="text-amber-500" />
                     My Connections
                 </h1>

                 {/* Tabs */}
                 <div className="flex space-x-4 mb-8 border-b border-gray-800">
                     <button
                        onClick={() => setActiveTab('friends')}
                        className={`pb-4 px-6 font-medium transition-colors relative ${
                            activeTab === 'friends' ? 'text-amber-500' : 'text-gray-400 hover:text-white'
                        }`}
                     >
                         Friends ({friends.length})
                         {activeTab === 'friends' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full"></div>}
                     </button>
                     <button
                        onClick={() => setActiveTab('received')}
                        className={`pb-4 px-6 font-medium transition-colors relative ${
                            activeTab === 'received' ? 'text-amber-500' : 'text-gray-400 hover:text-white'
                        }`}
                     >
                         Requests Received ({received.length})
                         {activeTab === 'received' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full"></div>}
                     </button>
                     <button
                        onClick={() => setActiveTab('sent')}
                        className={`pb-4 px-6 font-medium transition-colors relative ${
                            activeTab === 'sent' ? 'text-amber-500' : 'text-gray-400 hover:text-white'
                        }`}
                     >
                         Requests Sent ({sent.length})
                         {activeTab === 'sent' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-t-full"></div>}
                     </button>
                 </div>

                 {/* Content */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {activeTab === 'friends' && friends.map(user => (
                         <div key={user._id} className="bg-[#111827] rounded-2xl p-6 border border-gray-800 hover:border-amber-500/30 transition-all flex flex-col items-center text-center group">
                             <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-amber-500 to-rose-500 mb-4">
                                 <img src={user.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
                                      alt={user.fullName}
                                      className="w-full h-full object-cover rounded-full border-2 border-[#111827]" />
                             </div>
                             <h3 className="text-xl font-bold text-white mb-1">{user.fullName}</h3>
                             <p className="text-sm text-gray-400 mb-4 line-clamp-2">{user.bio || "No bio available"}</p>
                             <div className="mt-auto pt-4 w-full flex gap-3">
                                 <button
                                     onClick={() => navigate(`/private-chat/${user._id}`)}
                                     className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition text-sm font-medium"
                                 >
                                     Message
                                 </button>
                                 <button className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition text-sm font-medium">Profile</button>
                             </div>
                         </div>
                     ))}

                     {activeTab === 'friends' && friends.length === 0 && (
                         <div className="col-span-full py-20 text-center text-gray-500">
                             <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                             <p className="text-lg">You haven't connected with anyone yet.</p>
                         </div>
                     )}

                     {activeTab === 'received' && received.map(req => (
                         <div key={req._id} className="bg-[#111827] rounded-2xl p-6 border border-gray-800 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                 <img src={req.sender?.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
                                      alt={req.sender?.fullName}
                                      className="w-14 h-14 rounded-full object-cover bg-gray-700" />
                                 <div>
                                     <h3 className="text-lg font-bold text-white">{req.sender?.fullName}</h3>
                                     <p className="text-xs text-gray-400">Sent you a request</p>
                                 </div>
                             </div>
                             <div className="flex items-center gap-2">
                                 <button onClick={() => handleAccept(req._id)} className="p-2 bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white rounded-xl transition" title="Accept">
                                     <UserCheck size={20} />
                                 </button>
                                 <button onClick={() => handleReject(req._id)} className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition" title="Reject">
                                     <X size={20} />
                                 </button>
                             </div>
                         </div>
                     ))}

                      {activeTab === 'received' && received.length === 0 && (
                         <div className="col-span-full py-20 text-center text-gray-500">
                             <p className="text-lg">No pending received requests.</p>
                         </div>
                     )}


                     {activeTab === 'sent' && sent.map(req => (
                         <div key={req._id} className="bg-[#111827] rounded-2xl p-6 border border-gray-800 flex items-center justify-between opacity-80">
                             <div className="flex items-center gap-4">
                                 <img src={req.receiver?.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
                                      alt={req.receiver?.fullName}
                                      className="w-14 h-14 rounded-full object-cover bg-gray-700" />
                                 <div>
                                     <h3 className="text-lg font-bold text-white">{req.receiver?.fullName}</h3>
                                     <p className="text-xs text-amber-500 flex items-center gap-1">
                                         <Clock size={12} /> Pending
                                     </p>
                                 </div>
                             </div>
                             <button onClick={() => handleReject(req._id)} className="p-2 text-gray-500 hover:text-white transition" title="Cancel Request">
                                 <X size={20} />
                             </button>
                         </div>
                     ))}

                     {activeTab === 'sent' && sent.length === 0 && (
                         <div className="col-span-full py-20 text-center text-gray-500">
                             <p className="text-lg">No pending sent requests.</p>
                         </div>
                     )}
                 </div>
             </div>
        </div>
    )
}

export default MyConnections;
