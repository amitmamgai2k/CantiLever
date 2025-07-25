import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";

// initial state
const initialState = {
  loading: false,
  error: null,
  createdActivity: null,
  activities: []
};

// Create new activity
export const createActivity = createAsyncThunk(
  'user/createActivity',
  async ({ title, description, date, location, participantLimit, lat, lng }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/activity/create-activity', {
        title, description, date, location, participantLimit, lat, lng
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

// Get nearby activities
export const getNearbyActivities = createAsyncThunk(
  'user/getNearbyActivities',
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/activity/get-nearby-activities', { lat, lng });
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
      // Create Activity
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.createdActivity = action.payload?.data || null;
        toast.success('Activity created successfully');
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      // Get Nearby Activities
      .addCase(getNearbyActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNearbyActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.activities = action.payload?.data || [];
      })
      .addCase(getNearbyActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  }
});

export default UserActivity.reducer;
