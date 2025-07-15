import { Server } from "socket.io";
import Message from "./src/model/message.model.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(" New user connected:", socket.id);

    // join an activity chat room
    socket.on("joinActivityRoom", (activityId) => {
      socket.join(activityId);
      console.log(`Socket ${socket.id} joined activity room: ${activityId}`);
    });

    // send a message to activity room
    socket.on("sendActivityMessage", async ({ activityId, text, userId }) => {
      try {
        // save message to DB
        const message = await Message.create({
          activityId,
          text,
          sender: userId,
        });


        io.to(activityId).emit("receiveActivityMessage", message);
        console.log(`Message sent to activity ${activityId}: ${text}`);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;
