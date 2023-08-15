import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { userLogin } from "../store/Auth/action";
import { setLoginStep } from "../store/Auth/reducer";
import { PropagateLoader } from "react-spinners";

const Login = ({ isLoading }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, error } = useForm();
  const onSubmit = (data) => {
    dispatch(userLogin(data));
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">ConnectX</span>
        <span className="title">Login</span>
        <form>
          <input type="email" placeholder="email" {...register("email")} />
          <input
            type="password"
            placeholder="password"
            {...register("password")}
          />
          <button onClick={handleSubmit(onSubmit)} style={{ height: "40px" }}>
            {isLoading ? <PropagateLoader color="#ffffff" /> : "Sign in"}
          </button>
        </form>
        <p>
          You don't have an account?{" "}
          <span
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(setLoginStep(3))}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
