import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "initial",
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    removeRequests: (state, action) => {
      if (!Array.isArray(state)) return state;
      return state.filter((r) => r._id !== action.payload);
    },
    clearRequests: () => null,
  },
});
export const { addRequests, removeRequests, clearRequests } = requestSlice.actions;
export default requestSlice.reducer;
