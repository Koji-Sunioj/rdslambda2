import { API } from "aws-amplify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initialState = { data: null, loading: false, error: false };

export const fetchComplaints = createAsyncThunk(
  "complaints/fetch",
  async () => {
    const response = await API.get("rdslambda2", "/complaints");
    return response;
  }
);

const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    purgeDeleted: (state, action) => {
      if (Array.isArray(state.data)) {
        state.data = state.data.filter(
          (complaint) => complaint.id !== Number(action.payload.id)
        );
      }
    },
    addCreated: (state, action) => {
      if (Array.isArray(state.data)) {
        state.data.push(action.payload);
      }
    },
    mutateEdited: (state, action) => {
      if (Array.isArray(state.data)) {
        const ix = state.data.findIndex(
          (item) => item.id === action.payload.id
        );
        state.data[ix] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComplaints.fulfilled, (state, action) => {
      return {
        ...state,
        loading: false,
        data: [...action.payload],
      };
    });
    builder.addCase(fetchComplaints.rejected, (state) => {
      return { ...state, error: true, loading: false, data: null };
    });
    builder.addCase(fetchComplaints.pending, (state) => {
      return { ...state, error: false, loading: true, data: null };
    });
  },
});

export const { purgeDeleted, addCreated, mutateEdited } =
  complaintsSlice.actions;

export default complaintsSlice.reducer;