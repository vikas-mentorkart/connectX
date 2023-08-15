import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoading: false,
  activeChat: {},
  chats: [],
};
export const chatReducer = createSlice({
  name: "chatReducer",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      return { ...state, activeChat: action.payload, isLoading: false };
    },
    setChat: (state, action) => {
      return { ...state, chats: action.payload };
    },
  },
});

export const { setActiveChat, setChat } = chatReducer.actions;
export default chatReducer.reducer;
