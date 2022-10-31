import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import complaintReducer from "./reducers/complaintSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    complaintsPage: complaintReducer,
  },
});
