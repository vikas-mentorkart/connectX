import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { userSignUp } from "../store/Auth/action";
import { setLoginStep } from "../store/Auth/reducer";
import Add from "../images/addAvatar.png";

const Register = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, error } = useForm();
  const onSubmit = (data) => {
    dispatch(userSignUp(data, img));
  };
  const profileRef = useRef(null);
  const [img, setImg] = useState(null);
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">ConnectX</span>
        <span className="title">Register</span>
        <form>
          <input
            required
            type="text"
            placeholder="display name"
            {...register("display_name")}
          />
          <input
            required
            type="email"
            placeholder="email"
            {...register("email")}
          />
          <input
            required
            type="password"
            placeholder="password"
            {...register("password")}
          />
          <input
            required
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            ref={profileRef}
            onChange={({ target: { files } }) => setImg(files[0])}
          />
          <label htmlFor="file">
            <img
              src={!!img ? URL.createObjectURL(img) : Add}
              alt=""
              style={{ height: "32px", width: "32px" }}
            />
            <span onClick={() => profileRef.current.click()}>
              Add an avatar
            </span>
          </label>
          <button onClick={handleSubmit(onSubmit)}>Sign up</button>
        </form>
        <p>
          You do have an account?{" "}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(setLoginStep(2))}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
