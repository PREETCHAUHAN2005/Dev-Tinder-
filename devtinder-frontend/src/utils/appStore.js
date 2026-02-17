import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice";

 export const appStore = configureStore({
  reducer: {
    user: userSlice,
  },
});

