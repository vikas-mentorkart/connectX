import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogOut } from "../store/Auth/reducer";

const Navbar = () => {
  const dispatch = useDispatch();
  const { name } = useSelector((state) => state.authReducer.userData);
  return (
    <div className="navbar">
      <span className="logo">{name}</span>
      <div className="user">
        <img alt="" />
        <span></span>
        <button onClick={() => dispatch(setLogOut())}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
