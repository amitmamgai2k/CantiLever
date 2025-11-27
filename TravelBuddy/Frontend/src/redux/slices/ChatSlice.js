import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from '../../helpers/axiosInstance';

const initialState = {
  chatGroups: [],
  currentGroup: null,
  messages: [],
  loading: false,
  messagesLoading: false,
  joining: false,
  sending: false,
  error: null
};

export const CreateChatGroup = createAsyncThunk(
  'chat/createGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/chat/create-group', groupData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Chat group created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create chat group');
      return rejectWithValue(error.response?.data || { message: 'Failed to create chat group' });
    }
  }
);

export const fetchChatGroupByActivity = createAsyncThunk(
  'chat/fetchByActivity',
  async (activityId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/activity/${activityId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Chat group not found' });
    }
  }
);

export const fetchUserChatGroups = createAsyncThunk(
  'chat/fetchUserGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/chat');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Unable to load chat groups' });
    }
  }
);

export const joinChatGroup = createAsyncThunk(
  'chat/joinGroup',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/chat/${chatId}/join`);
      toast.success('Joined chat group');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to join chat group');
      return rejectWithValue(error.response?.data || { message: 'Unable to join chat group' });
    }
  }
);

export const fetchGroupMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/${chatId}/messages`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Unable to load messages' });
    }
  }
);

export const sendGroupMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, text }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/chat/${chatId}/messages`, { text });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send message');
      return rejectWithValue(error.response?.data || { message: 'Unable to send message' });
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChatState: (state) => {
      state.currentGroup = null;
      state.messages = [];
      state.error = null;
    },
    addRealtimeMessage: (state, action) => {
      const incomingChatId =
        action.payload?.chatId?._id || action.payload?.chatId?.toString?.() || action.payload?.chatId;
      if (!state.currentGroup || state.currentGroup._id !== String(incomingChatId)) {
        return;
      }
      state.messages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreateChatGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateChatGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGroup = action.payload?.data || null;
      })
      .addCase(CreateChatGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create chat group';
      })
      .addCase(fetchChatGroupByActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatGroupByActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGroup = action.payload?.data || null;
      })
      .addCase(fetchChatGroupByActivity.rejected, (state, action) => {
        state.loading = false;
        state.currentGroup = null;
        state.error = action.payload?.message || 'Chat group not found';
      })
      .addCase(fetchUserChatGroups.fulfilled, (state, action) => {
        state.chatGroups = action.payload?.data || [];
      })
      .addCase(joinChatGroup.pending, (state) => {
        state.joining = true;
        state.error = null;
      })
      .addCase(joinChatGroup.fulfilled, (state, action) => {
        state.joining = false;
        state.currentGroup = action.payload?.data || state.currentGroup;
      })
      .addCase(joinChatGroup.rejected, (state, action) => {
        state.joining = false;
        state.error = action.payload?.message || 'Unable to join chat group';
      })
      .addCase(fetchGroupMessages.pending, (state) => {
        state.messagesLoading = true;
        state.error = null;
      })
      .addCase(fetchGroupMessages.fulfilled, (state, action) => {
        state.messagesLoading = false;
        state.messages = action.payload?.data || [];
      })
      .addCase(fetchGroupMessages.rejected, (state, action) => {
        state.messagesLoading = false;
        state.messages = [];
        state.error = action.payload?.message || 'Unable to load messages';
      })
      .addCase(sendGroupMessage.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendGroupMessage.fulfilled, (state, action) => {
        state.sending = false;
        if (action.payload?.data) {
          state.messages.push(action.payload.data);
        }
      })
      .addCase(sendGroupMessage.rejected, (state) => {
        state.sending = false;
      });
  }
});

export const { resetChatState, addRealtimeMessage } = chatSlice.actions;

export default chatSlice.reducer;

