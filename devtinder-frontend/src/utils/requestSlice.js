import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "initial",
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequests: (state, action) => {
      const newArray = state.filter((r) => r._id !== action.payload);
      return newArray;
    },
  },
});
export const { addRequests, removeRequests } = requestSlice.actions;
export default requestSlice.reducer;
