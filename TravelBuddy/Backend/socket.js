import { Server } from 'socket.io';
import Message from './src/model/message.model.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(' New user connected:', socket.id);

    socket.on('joinActivityRoom', (activityId) => {
      socket.join(activityId);
      console.log(`Socket ${socket.id} joined activity room: ${activityId}`);
    });

    socket.on('joinChatRoom', (chatId) => {
      if (!chatId) return;
      socket.join(`chat:${chatId}`);
      console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
    });

    socket.on('leaveChatRoom', (chatId) => {
      if (!chatId) return;
      socket.leave(`chat:${chatId}`);
      console.log(`Socket ${socket.id} left chat room: ${chatId}`);
    });

    socket.on('sendActivityMessage', async ({ activityId, text, userId }) => {
      try {
        const message = await Message.create({
          activityId,
          text,
          sender: userId
        });

        io.to(activityId).emit('receiveActivityMessage', message);
        console.log(`Message sent to activity ${activityId}: ${text}`);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

export const getIO = () => io;
