import { API } from "aws-amplify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initialState = {
  data: null,
  loading: false,
  error: false,
  mutating: false,
  mutated: false,
  mutateError: false,
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
    const response = await API.post("rdslambda2", "/complaints/", options);
    delete response.data.message;
    return response.data;
  }
);

export const editComplaint = createAsyncThunk(
  "complaint/edit",
  async (clientRequest) => {
    const { options, complaintId } = clientRequest;
    const response = await API.patch(
      "rdslambda2",
      `/complaints/${complaintId}`,
      options
    );
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
      Object.assign(state, { mutated: false, mutating: false });
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
      return { ...state, mutated: true, mutating: false };
    });
    builder.addCase(deleteComplaint.rejected, (state) => {
      return { ...state, mutated: false, mutating: false, mutateError: true };
    });
    builder.addCase(deleteComplaint.pending, (state) => {
      return { ...state, mutated: false, mutating: true, mutateError: false };
    });
    //create complaint
    builder.addCase(createComplaint.fulfilled, (state, action) => {
      return { ...state, mutating: false, mutated: true, data: action.payload };
    });
    builder.addCase(createComplaint.rejected, (state) => {
      return { ...state, mutating: false, mutated: false, mutateError: true };
    });
    builder.addCase(createComplaint.pending, (state) => {
      return { ...state, mutating: true, mutated: false, mutateError: false };
    });
    //edit complaint
    builder.addCase(editComplaint.fulfilled, (state, action) => {
      return { ...state, mutating: false, mutated: true, data: action.payload };
    });
    builder.addCase(editComplaint.rejected, (state) => {
      return { ...state, mutating: false, mutated: false, mutateError: true };
    });
    builder.addCase(editComplaint.pending, (state) => {
      return { ...state, mutating: true, mutated: false, mutateError: false };
    });
  },
});

export const { resetComplaint, resetMutate } = complaintSlice.actions;

export default complaintSlice.reducer;
