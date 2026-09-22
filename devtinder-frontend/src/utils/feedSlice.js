import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addfeed: (state, action) => action.payload,
    removeUserFromFeed: (state, action) => {
      if (!Array.isArray(state)) return state;
      return state.filter((user) => user._id !== action.payload);
    },
    clearFeed: () => null,
  },
});

export const { addfeed, removeUserFromFeed, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
