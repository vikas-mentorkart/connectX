import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { useSelector, useDispatch } from "react-redux";
import { ref, onChildChanged } from "firebase/database";
import { db } from "../firebase";
import { setChat } from "../store/Chat/reducer";
import { getUid } from "../hooks/commonHooks";

const Messages = () => {
  const dispatch = useDispatch();
  const divRef = useRef(null);
  const { chats } = useSelector((state) => state.chatReducer);
  const uid = getUid();
  useEffect(() => {
    const chatRef = ref(db, `chats/${uid}`);
    onChildChanged(chatRef, (snap) => {
      const chats = JSON.parse(snap.val());
      dispatch(setChat(chats));
    });
  }, [uid]);
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [chats]);
  return (
    <div className="messages" ref={divRef}>
      {chats.length > 1 &&
        chats.map((item, i) => {
          if (i > 0) return <Message message={item} key={i} />;
        })}
    </div>
  );
};

export default Messages;
