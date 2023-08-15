import { configureStore } from "@reduxjs/toolkit";
import testReducer from "./reducer";
import authReducer from "./Auth/reducer";
import chatReducer from "./Chat/reducer";

export const store = configureStore({
  reducer: {
    testReducer,
    authReducer,
    chatReducer,
  },
});
