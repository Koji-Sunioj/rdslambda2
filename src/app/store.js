import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import complaintsReducer from "./reducers/complaintsHome";
import complaintView from "./reducers/complaintView";

import { purgeDeleted } from "./reducers/complaintsHome";
import { resetComplaint } from "./reducers/complaintView";

const isComplaintPurged = createListenerMiddleware();

isComplaintPurged.startListening({
  matcher: isAnyOf(purgeDeleted),
  effect: (action, state) => {
    console.log("match");
    state.dispatch(resetComplaint());
  },
});

export const store = configureStore({
  reducer: {
    user: userReducer,
    complaintsPage: complaintsReducer,
    complaintPage: complaintView,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(isComplaintPurged.middleware),
});
