import { createSlice } from "@reduxjs/toolkit";
const initialState = { data: [] };

export const testReducer = createSlice({
  name: "testReducer",
  initialState,
  reducers: {
    setData: (state, action) => {
      return { ...state, data: [...state.data, action.payload] };
    },
  },
});

export const { setData } = testReducer.actions;
export default testReducer.reducer;
