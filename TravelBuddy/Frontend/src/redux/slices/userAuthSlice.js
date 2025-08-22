import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
  user: null,
  loading: false,
  error: null
};


export const register = createAsyncThunk(
  'user/register',
  async ({ email, password, fullName, mobile }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/register', { email, password, fullName, mobile });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);


export const Login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);
export const loadUser = createAsyncThunk(
  'user/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Not authenticated" });
    }
  }
);
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/logout');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);
export const currentLocation = createAsyncThunk(
  'user/currentLocation',
  async ({ lat, lng }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/current-location', { lat, lng });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (user, { rejectWithValue }) => {
    try {

      const response = await axiosInstance.post('/users/update-profile', user);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

const UserAuth = createSlice({
  name: "UserAuth",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;

      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";

      })

      // LOGIN
      .addCase(Login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user; // get user from ApiResponse

      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";

      })
      .addCase(loadUser.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(loadUser.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.data.user;
})
.addCase(loadUser.rejected, (state, action) => {
  state.loading = false;
  state.user = null;
})

.addCase(logout.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(logout.fulfilled, (state, action) => {
  state.loading = false;
  state.user = null;
})
.addCase(logout.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload?.message || "Logout failed";
})
.addCase(currentLocation.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(currentLocation.fulfilled, (state, action) => {
  state.loading = false;
  toast.success('Location updated successfully');
  state.user = action.payload.data.user;
})
.addCase(currentLocation.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload?.message || "Current Location failed";
})
.addCase(updateUserProfile.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updateUserProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload.data.user;
})
.addCase(updateUserProfile.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload?.message || "Update Profile failed";
});
  }
});
export default UserAuth.reducer;
