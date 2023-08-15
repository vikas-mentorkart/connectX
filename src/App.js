import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./style.scss";
import { useSelector, useDispatch } from "react-redux";
import { setLoginStep } from "./store/Auth/reducer";
import { getUserById } from "./store/Auth/action";
import { getUid } from "./hooks/commonHooks";

function App() {
  const { loginStep, isLoggedIn, isLoading } = useSelector(
    (state) => state.authReducer
  );
  const id = getUid();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserById(id));
    } else {
      dispatch(setLoginStep(2));
    }
  }, []);
  return (
    <div>
      {loginStep === 1 && <Home />}
      {loginStep === 2 && <Login isLoading={isLoading} />}
      {loginStep === 3 && <Register isLoading={isLoading} />}
    </div>
  );
}

export default App;
