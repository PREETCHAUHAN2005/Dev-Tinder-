import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  initialState: null,
  name: "user",
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: (state, action) => {
      return null;
    },
  },
});
export const {addUser, removeUser} = userSlice.actions;
export default userSlice.reducer;
