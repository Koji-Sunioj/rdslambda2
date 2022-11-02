import { API } from "aws-amplify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getOptions } from "../../utils/options";

export const initialState = {
  data: null,
  loading: false,
  error: false,
  deleting: false,
  deleted: false,
  creating: false,
  created: false,
};

export const fetchComplaint = createAsyncThunk(
  "complaint/fetch",
  async (complaintId) => {
    const response = await API.get("rdslambda2", `/complaints/${complaintId}`);
    return response;
  }
);

export const deleteComplaint = createAsyncThunk(
  "complaint/delete",
  async (clientRequest) => {
    const { options, complaintId } = clientRequest;
    await API.del("rdslambda2", `/complaints/${complaintId}`, options);
  }
);

export const createComplaint = createAsyncThunk(
  "complaint/create",
  async (options) => {
    console.log("post fired");
    const response = await API.post("rdslambda2", "/complaints/", options);
    delete response.data.message;
    return response.data;
  }
);

const complaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {
    resetComplaint: (state) => {
      Object.assign(state, initialState);
    },
    resetMutate: (state) => {
      Object.assign(state, { created: false, creating: false });
    },
  },
  extraReducers: (builder) => {
    //fetch one complaint
    builder.addCase(fetchComplaint.fulfilled, (state, action) => {
      return { ...state, loading: false, data: action.payload };
    });
    builder.addCase(fetchComplaint.rejected, (state) => {
      return { ...state, loading: false, error: true };
    });
    builder.addCase(fetchComplaint.pending, (state) => {
      return { ...state, loading: true, error: false, data: null };
    });
    //delete complaint
    builder.addCase(deleteComplaint.fulfilled, (state) => {
      return { ...state, deleted: true, deleting: false };
    });
    builder.addCase(deleteComplaint.rejected, (state) => {
      return { ...state, deleted: false, deleting: false };
    });
    builder.addCase(deleteComplaint.pending, (state) => {
      return { ...state, deleted: false, deleting: true };
    });
    //create complaint
    builder.addCase(createComplaint.fulfilled, (state, action) => {
      return { ...state, creating: false, created: true, data: action.payload };
    });
    builder.addCase(createComplaint.rejected, (state) => {
      return { ...state, creating: false, created: false };
    });
    builder.addCase(createComplaint.pending, (state) => {
      return { ...state, creating: true, created: false };
    });
  },
});

export const { resetComplaint, resetMutate } = complaintSlice.actions;

export default complaintSlice.reducer;
