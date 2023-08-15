import React from "react";
import { getUid } from "../hooks/commonHooks";
import dayjs from "dayjs";

const Message = ({ message }) => {
  const owner = getUid() === message?.senderId;
  return (
    <div className={`message ${owner ? "owner" : ""}`}>
      <div className="messageContent" style={{ display: "flex" }}>
        <div style={{ display: "flex" }}>
          <p>{message?.message}</p>
          <span
            className="messageInfo"
            style={{
              display: "flex",
            }}
          >
            {dayjs(message?.sentAt).format("hh:mm A")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;
