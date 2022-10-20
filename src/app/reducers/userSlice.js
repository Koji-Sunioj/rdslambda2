import { createSlice } from "@reduxjs/toolkit";

export const initialState = { id: null, jwt: null };

export const userSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setTheUser: (state, action) => {
      state.id = action.payload.id;
      state.jwt = action.payload.jwt;
    },
    unSetUser: () => initialState,
  },
});

export const { setTheUser, unSetUser } = userSlice.actions;

export default userSlice.reducer;
