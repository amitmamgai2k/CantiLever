import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markAsRead, markAllRead } from '../../redux/slices/notificationSlice';
import { Bell, Check, Trash2, UserPlus, MessageCircle, Calendar } from 'lucide-react';

const NotificationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, loading } = useSelector((state) => state.notification);

    useEffect(() => {
        dispatch(fetchNotifications());
    }, [dispatch]);

    const handleMarkRead = (id, e) => {
        e.stopPropagation();
        dispatch(markAsRead(id));
    };

    const handleMarkAllRead = () => {
        dispatch(markAllRead());
    };

    const handleNotificationClick = (notif) => {
        if(!notif.read) {
             dispatch(markAsRead(notif._id));
        }

        switch(notif.type) {
             case 'message':
                if(notif.sender) {
                     navigate(`/private-chat/${notif.sender._id}`);
                }
                break;
             case 'friend_request':
                navigate('/connections');
                break;
             case 'friend_accept':
                if(notif.sender) {
                     navigate(`/private-chat/${notif.sender._id}`);
                }
                break;
             case 'activity_invite':
                navigate(`/activity/${notif.relatedId}`);
                break;
             default:
                break;
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'friend_request': return <UserPlus className="text-amber-500" />;
            case 'friend_accept': return <UserPlus className="text-green-500" />;
            case 'message': return <MessageCircle className="text-blue-500" />;
            case 'activity_invite': return <Calendar className="text-purple-500" />;
            default: return <Bell className="text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#050b1b] pt-10 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Bell className="text-amber-500" />
                        Notifications
                    </h1>
                    {notifications.length > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-sm text-gray-400 hover:text-white flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
                        >
                            <Check size={16} />
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 bg-[#111827] rounded-3xl border border-gray-800">
                            <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="text-lg">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif._id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`relative p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 cursor-pointer hover:bg-opacity-50 ${
                                    notif.read
                                        ? 'bg-[#0b1221] border-gray-800 opacity-70'
                                        : 'bg-[#162032] border-amber-500/30 shadow-lg shadow-black/20'
                                }`}
                            >
                                <div className={`p-3 rounded-full ${notif.read ? 'bg-gray-800' : 'bg-gray-700'}`}>
                                    {getIcon(notif.type)}
                                </div>

                                <div className="flex-1">
                                    <p className={`text-sm mb-1 ${notif.read ? 'text-gray-300' : 'text-white font-medium'}`}>
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {!notif.read && (
                                    <button
                                        onClick={(e) => handleMarkRead(notif._id, e)}
                                        className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-full transition"
                                        title="Mark as read"
                                    >
                                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;
