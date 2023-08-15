import React from "react";
import Messages from "./Messages";
import Input from "./Input";
import { useSelector } from "react-redux";
const Chat = () => {
  const { activeChat } = useSelector((state) => state.chatReducer);
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{activeChat?.name}</span>
        <div className="chatIcons"></div>
      </div>
      <Messages />
      <Input friendUid={activeChat?.uid} />
    </div>
  );
};

export default Chat;
