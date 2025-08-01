import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";

// initial state
const initialState = {
  loading: false,
  error: null,
  createdActivity: [],
  activities: [],
  singleActivity: null,
  joinedActivities: [],
  participants: [],

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
);
export const leaveActivity = createAsyncThunk(
  'user/leaveActivity',
  async (activityId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/activity/leave-activity/${activityId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);
export const MyCreatedActivites = createAsyncThunk(
  'user/MyCreatedActivites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/activity/my-created-activities');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);
export const deleteActivity = createAsyncThunk(
  'user/deleteActivity',
  async (activityId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/activity/delete-activity/${activityId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);
export const getParticipants = createAsyncThunk(
  'user/getParticipants',
  async (activityId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/activity/get-participants/${activityId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);
export const UpdateActivity = createAsyncThunk(
  'user/UpdateActivity',
  async ({ activityId, title, description, date, location, participantLimit, lat, lng }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/activity/update-activity/${activityId}`, {
        title, description, date, location, participantLimit, lat, lng
      });
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
      // Leave Activity
      .addCase(leaveActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        toast.success('Left activity successfully');

        state.joinedActivities = state.joinedActivities.filter(activity => activity._id !== action.payload.data.activityId);
      })
      .addCase(leaveActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      // My Created Activities
      .addCase(MyCreatedActivites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(MyCreatedActivites.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.createdActivity = action.payload?.data || [];
      })
      .addCase(MyCreatedActivites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      // Delete Activity
      .addCase(deleteActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        toast.success('Activity deleted successfully');
        // Remove deleted activity from createdActivity
        state.createdActivity = state.createdActivity.filter(activity => activity._id !== action.payload.data.activityId);
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      // Get Participants
      .addCase(getParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.participants = action.payload?.data || [];
      })
      .addCase(getParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
    // Update Activity
    .addCase(UpdateActivity.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(UpdateActivity.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      toast.success('Activity updated successfully');
      // Update the activity in createdActivity
      const updatedActivity = action.payload?.data;
      state.createdActivity = state.createdActivity.map(activity =>
        activity._id === updatedActivity._id ? updatedActivity : activity
      );
    })
    .addCase(UpdateActivity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Something went wrong";
    })


  }
});

export default UserActivity.reducer;
