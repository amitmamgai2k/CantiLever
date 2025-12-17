import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../redux/slices/notificationSlice';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userAuth);

  const socketUrl = useMemo(() => {
    const base = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BASE_URL;
    return base?.replace(/\/$/, '');
  }, []);

  useEffect(() => {
    if (!socketUrl) return;

    const connection = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    setSocket(connection);

    return () => {
      connection.disconnect();
    };
  }, [socketUrl]);

  useEffect(() => {
    if (socket && user?._id) {
        socket.emit('joinUserRoom', user._id);

        const handleNotification = (notification) => {
            dispatch(addNotification(notification));
            toast(notification.message, {
                 icon: '🔔',
                 style: {
                     borderRadius: '10px',
                     background: '#333',
                     color: '#fff',
                 },
            });
        };

        socket.on('newNotification', handleNotification);

        return () => {
            socket.off('newNotification', handleNotification);
        }
    }
  }, [socket, user, dispatch]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
