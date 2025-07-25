

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
    loading: false,
    error: null,
    activity: null
};

export const createActivity = createAsyncThunk(
    'user/createActivity',
    async ({ title, description, date, location, participantLimit }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/activity/create-activity', { title, description, date, location, participantLimit });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Something went wrong" });
        }
    }
);

const UserActivity = createSlice({
    name: "userActivity",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createActivity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                toast.success('Activity created successfully');

                 state.activity = action.payload;
            })
            .addCase(createActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            });
    }
});

export default UserActivity.reducer;
