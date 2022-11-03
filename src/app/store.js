import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import complaintsReducer from "./reducers/complaintsHome";
import complaintView from "./reducers/complaintView";

import {
  purgeDeleted,
  addCreated,
  mutateEdited,
} from "./reducers/complaintsHome";
import { resetComplaint, resetMutate } from "./reducers/complaintView";

const isComplaintPurged = createListenerMiddleware();
const isComplaintMutated = createListenerMiddleware();

isComplaintPurged.startListening({
  matcher: isAnyOf(purgeDeleted),
  effect: (action, state) => {
    state.dispatch(resetComplaint());
  },
});

isComplaintPurged.startListening({
  matcher: isAnyOf(addCreated, mutateEdited),
  effect: (action, state) => {
    state.dispatch(resetMutate());
  },
});

export const store = configureStore({
  reducer: {
    user: userReducer,
    complaintsPage: complaintsReducer,
    complaintPage: complaintView,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      isComplaintPurged.middleware,
      isComplaintMutated.middleware
    ),
});
