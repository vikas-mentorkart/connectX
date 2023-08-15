import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { useSelector, useDispatch } from "react-redux";
import { ref, onChildChanged } from "firebase/database";
import { db } from "../firebase";
import { setChat } from "../store/Chat/reducer";

const Messages = () => {
  const dispatch = useDispatch();
  const divRef = useRef(null);
  const { chats } = useSelector((state) => state.chatReducer);
  useEffect(() => {
    const chatRef = ref(db, "chats");
    onChildChanged(chatRef, (snap) => {
      const chats = JSON.parse(snap.val());
      dispatch(setChat(chats));
      if (divRef.current) {
        divRef.current.scrollTop = divRef.current.scrollHeight;
      }
    });
  }, []);
  return (
    <div className="messages" ref={divRef}>
      {(chats || []).map((item, i) => (
        <Message message={item} key={i} />
      ))}
    </div>
  );
};

export default Messages;
