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
    async ({ email, password, name }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/user/register', { email, password, name });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const Login = createAsyncThunk(
    'user/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/user/login', { email, password });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const UserAuth = createSlice({
    name: "UserAuth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('token');
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state, action) => {
                toast.success(action.payload.message);
            })
            .addCase(register.rejected, (state, action) => {
                toast.error(action.payload.message);
            })
            .addCase(Login.fulfilled, (state, action) => {
                toast.success(action.payload.message);
                state.user = action.payload.user;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(Login.rejected, (state, action) => {
                toast.error(action.payload.message);
            });

    }
});

export const { logout } = UserAuth.actions;
export default UserAuth.reducer;