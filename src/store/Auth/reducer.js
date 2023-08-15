import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { getUid } from "../../hooks/commonHooks";

const initialState = {
  isLoggedIn: !!getUid(),
  isLoading: false,
  userData: {},
  loginStep: 2,
};
export const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      const { email, uid, name } = action.payload;
      Cookies.set("userData", JSON.stringify({ email, uid, name }));
      return {
        ...state,
        userData: action.payload,
        isLoading: false,
        isLoggedIn: true,
        loginStep: 1,
      };
    },
    setLogOut: () => {
      Cookies.remove("userData");
      return { ...initialState };
    },
    setIsLoading: (state, action) => {
      return { ...state, isLoading: action.payload };
    },
    setUserData: (state, action) => {
      return {
        ...state,
        userData: { ...state.userData, ...action.payload },
        isLoading: false,
      };
    },
    setLoginStep: (state, action) => {
      return { ...state, loginStep: action.payload };
    },
  },
});
export const { setLogin, setIsLoading, setUserData, setLoginStep, setLogOut } =
  authReducer.actions;
export default authReducer.reducer;
