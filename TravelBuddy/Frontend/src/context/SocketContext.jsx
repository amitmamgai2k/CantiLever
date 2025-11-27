import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const socketUrl = useMemo(() => {
    const base = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BASE_URL;
    return base?.replace(/\/$/, '');
  }, []);

  useEffect(() => {
    if (!socketUrl) {
      return;
    }

    const connection = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    setSocket(connection);

    return () => {
      connection.disconnect();
    };
  }, [socketUrl]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
