import { createSlice } from "@reduxjs/toolkit";

export const initialState = { id: null, jwt: null, exp: null };

export const userSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setTheUser: (state, action) => {
      state.id = action.payload.id;
      state.jwt = action.payload.jwt;
      state.exp = action.payload.exp;
    },
    unSetUser: () => initialState,
  },
});

export const { setTheUser, unSetUser } = userSlice.actions;

export default userSlice.reducer;
