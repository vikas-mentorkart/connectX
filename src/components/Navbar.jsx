import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogOut } from "../store/Auth/reducer";

const Navbar = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.authReducer);
  console.log(userData);
  return (
    <div className="navbar">
      <span className="logo">{userData.name}</span>
      <div className="user">
        <img alt="" src={userData?.profileUrl} />
        <span></span>
        <button onClick={() => dispatch(setLogOut())}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
