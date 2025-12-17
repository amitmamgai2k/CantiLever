import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
};

export const fetchNotifications = createAsyncThunk(
    "notifications/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/notifications");
            return res.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

export const markAsRead = createAsyncThunk(
    "notifications/markRead",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.put(`/notifications/${id}/read`);
            return id;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

export const markAllRead = createAsyncThunk(
    "notifications/markAllRead",
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.put(`/notifications/read-all`);
            return;
        } catch (error) {
           return rejectWithValue(error?.response?.data);
        }
    }
);

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.read) {
                state.unreadCount += 1;
            }
        },
        resetUnread: (state) => {
            state.unreadCount = 0;
            state.notifications.forEach(n => n.read = true);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(n => !n.read).length;
        });
        builder.addCase(markAsRead.fulfilled, (state, action) => {
             const notif = state.notifications.find(n => n._id === action.payload);
             if (notif && !notif.read) {
                 notif.read = true;
                 state.unreadCount -= 1;
             }
        });
        builder.addCase(markAllRead.fulfilled, (state) => {
             state.unreadCount = 0;
             state.notifications.forEach(n => n.read = true);
        });
    },
});

export const { addNotification, resetUnread } = notificationSlice.actions;
export default notificationSlice.reducer;
