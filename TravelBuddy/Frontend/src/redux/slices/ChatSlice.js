import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import toast from 'react-hot-toast';
import axiosInstance from "../../helpers/axiosInstance";
const initialState = {
  chatGroups:null,
  loading: false,
  error: null
};
export const CreateChatGroup = createAsyncThunk(
  "chat/createGroup",
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/chat/create-group", groupData);
      toast.success("Chat group created successfully");
      return response.data;
    } catch (error) {
      toast.error("Failed to create chat group");
      return rejectWithValue(error.response.data);
    }
  }
);
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateChatGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(CreateChatGroup.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);


      })
      .addCase(CreateChatGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default chatSlice.reducer;
