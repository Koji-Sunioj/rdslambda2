import { API } from "aws-amplify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOptions } from "../../utils/options";

export const initialState = {
  data: null,
  loading: false,
  error: false,
  deleting: false,
  deleted: false,
};

export const fetchComplaint = createAsyncThunk(
  "complaint/fetch",
  async (complaintId) => {
    console.log("fetch fired");
    const response = await API.get("rdslambda2", `/complaints/${complaintId}`);
    return response;
  }
);

export const deleteComplaint = createAsyncThunk(
  "complaint/delete",
  async (clientRequest) => {
    const { user, complaintId } = clientRequest;
    const options = getOptions(user);
    await API.del("rdslambda2", `/complaints/${complaintId}`, options);
  }
);

const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    resetComplaint: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComplaint.fulfilled, (state, action) => {
      return { ...state, loading: false, data: action.payload };
    });
    builder.addCase(fetchComplaint.rejected, (state) => {
      return { ...state, loading: false, error: true };
    });
    builder.addCase(fetchComplaint.pending, (state) => {
      return { ...state, loading: true, error: false, data: null };
    });

    builder.addCase(deleteComplaint.fulfilled, (state) => {
      return { ...state, deleted: true, deleting: false };
    });
    builder.addCase(deleteComplaint.rejected, (state) => {
      return { ...state, deleted: false, deleting: false };
    });
    builder.addCase(deleteComplaint.pending, (state) => {
      return { ...state, deleted: false, deleting: true };
    });
  },
});

export const { resetComplaint } = complaintSlice.actions;

export default complaintSlice.reducer;
