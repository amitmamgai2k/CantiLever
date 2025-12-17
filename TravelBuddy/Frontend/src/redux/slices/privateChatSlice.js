import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  selectedChat: null,
  chats: [],
  messages: [],
  loading: false,
};

export const accessPrivateChat = createAsyncThunk(
  "privateChat/access",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/private-chat`, { userId });
      return data;
    } catch (error) {
      toast.error("Failed to access chat");
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPrivateChats = createAsyncThunk(
  "privateChat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/private-chat`);
      return data;
    } catch (error) {
       toast.error("Failed to load chats");
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendPrivateMessage = createAsyncThunk(
  "privateChat/sendMessage",
  async ({ chatId, text }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/private-chat/message`, {
        chatId,
        text,
      });
      return data;
    } catch (error) {
      toast.error("Failed to send message");
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPrivateMessages = createAsyncThunk(
  "privateChat/fetchMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/private-chat/message/${chatId}`);
      return data;
    } catch (error) {
       toast.error("Failed to load messages");
      return rejectWithValue(error.response.data);
    }
  }
);

const privateChatSlice = createSlice({
  name: "privateChat",
  initialState,
  reducers: {
       addPrivateMessage: (state, action) => {
           if(state.selectedChat && state.selectedChat._id === action.payload.chatId._id) {
                state.messages.push(action.payload);
           }
           // Update last message in chat list
           const chatIndex = state.chats.findIndex(c => c._id === action.payload.chatId._id);
           if(chatIndex !== -1) {
               state.chats[chatIndex].lastMessage = action.payload;
           }
       },
       setSelectedChat: (state, action) => {
           state.selectedChat = action.payload;
       }
  },
  extraReducers: (builder) => {
    builder
      .addCase(accessPrivateChat.fulfilled, (state, action) => {
        state.selectedChat = action.payload;
        // Check if already in list
        if (!state.chats.find((c) => c._id === action.payload._id)) {
          state.chats.unshift(action.payload);
        }
      })
      .addCase(fetchPrivateChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(sendPrivateMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        // update chat list last message
        const chatIndex = state.chats.findIndex(c => c._id === action.payload.chatId._id);
           if(chatIndex !== -1) {
               state.chats[chatIndex].lastMessage = action.payload;
           }
      })
      .addCase(fetchPrivateMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loading = false;
      })
      .addCase(fetchPrivateMessages.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { addPrivateMessage, setSelectedChat } = privateChatSlice.actions;
export default privateChatSlice.reducer;
