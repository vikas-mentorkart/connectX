import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { ref, onValue } from "firebase/database";
import { getUid } from "../hooks/commonHooks";
import { db } from "../firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/Auth/reducer";

const Home = () => {
  const uid = getUid();
  const dispatch = useDispatch();
  useEffect(() => {
    const userRef = ref(db, `users/${uid}`);
    onValue(userRef, (snap) => {
      const { email, name, uid, friends } = snap.val();
      dispatch(setUserData({ email, name, uid, friends: JSON.parse(friends) }));
    });
  }, []);
  return (
    <div className="home">
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
