import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";

// initial state
const initialState = {
  loading: false,
  error: null,
  createdActivity: null,
  activities: [],
  singleActivity: null,
  joinedActivities: [],

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
export const joinActivity = createAsyncThunk(
  'user/joinActivity',
  async (activityId , { rejectWithValue }) => {
    try {
      console.log('activityId:', activityId);



      const response = await axiosInstance.post(`/activity/join-activity/${activityId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);
export const getSingleActivity = createAsyncThunk(
  'user/getSingleActivity',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/activity/single-activity/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);
export const getJoinedActivities = createAsyncThunk(
  'user/getJoinedActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/activity/joined-activities');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
)

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
      })

      // Join Activity
      .addCase(joinActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        toast.success('Joined activity successfully');
      })
      .addCase(joinActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      // Get Single Activity
      .addCase(getSingleActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.singleActivity = action.payload?.data || null;
      })
      .addCase(getSingleActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      // Get Joined Activities
      .addCase(getJoinedActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJoinedActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.joinedActivities = action.payload?.data || [];




      })
      .addCase(getJoinedActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

  }
});

export default UserActivity.reducer;
