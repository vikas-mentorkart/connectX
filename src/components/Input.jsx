import React, { useState } from "react";
import { getUid } from "../hooks/commonHooks";
import { useDispatch } from "react-redux";
import { addChat } from "../store/Chat/action";
const Input = ({ friendUid }) => {
  const uid = getUid();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <div className="send">
        <img alt="" />
        <input type="file" style={{ display: "none" }} id="file" />
        <label htmlFor="file">
          <img alt="" />
        </label>
        <button
          onClick={() => {
            dispatch(addChat({ friendUid, uid, message }));
            setMessage("");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
