import { API } from "aws-amplify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initialState = { data: null, loading: false, error: false };

export const fetchComplaints = createAsyncThunk(
  "complaints/fetch",
  async () => {
    console.log("api hit");
    const response = await API.get("rdslambda2", "/complaints");
    return response;
  }
);

const complaintSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComplaints.fulfilled, (state, action) => {
      state.error = false;
      state.loading = false;
      state.data = [...action.payload];
    });
    builder.addCase(fetchComplaints.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
      state.data = null;
    });
    builder.addCase(fetchComplaints.pending, (state, action) => {
      state.error = false;
      state.loading = true;
      state.data = null;
    });
  },
});

export default complaintSlice.reducer;
