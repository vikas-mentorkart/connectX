import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogOut } from "../store/Auth/reducer";

const Navbar = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.authReducer);
  return (
    <div className="navbar">
      <div style={{ display: "flex" }}>
        <img alt="" src={userData?.profileUrl} />
        <span className="logo">{userData.name}</span>
      </div>
      <div className="user">
        <button onClick={() => dispatch(setLogOut())}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
