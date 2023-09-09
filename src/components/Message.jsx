import React from "react";
import { getUid } from "../hooks/commonHooks";
import dayjs from "dayjs";

const Message = ({
  message: { message, type = "TEXT", fileUrl = "", sentAt, senderId },
}) => {
  const owner = getUid() === senderId;
  return (
    <div className={`message ${owner ? "owner" : ""}`}>
      <div className="messageContent" style={{ display: "flex" }}>
        {type == "TEXT" ? (
          <div style={{ display: "flex" }}>
            <p>{message}</p>
            <span
              className="messageInfo"
              style={{
                display: "flex",
              }}
            >
              {dayjs(sentAt).format("hh:mm A")}
            </span>
          </div>
        ) : (
          <div>
            <img src={fileUrl} />
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
