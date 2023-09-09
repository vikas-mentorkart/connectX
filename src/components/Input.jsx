import React, { useState } from "react";
import { getUid } from "../hooks/commonHooks";
import { useDispatch } from "react-redux";
import { addChat, addImage } from "../store/Chat/action";
import attachfile from "../images/attach-file.png";
import send from "../images/send-icon.png";
import cancel from "../images/cancel-icon.png";
import ReactModal from "react-modal";
const Input = ({ friendUid = "" }) => {
  const uid = getUid();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  return (
    <div className="input">
      {!!friendUid && (
        <>
          <input
            type="text"
            placeholder="Type something..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <div className="send">
            <input
              type="file"
              style={{ display: "none" }}
              id="file"
              onChange={({ target: { files } }) => {
                setFile(files[0]);
                setOpen(true);
              }}
            />
            <label htmlFor="file">
              <img alt="" src={attachfile} />
            </label>
            <button
              disabled={!message}
              onClick={() => {
                dispatch(addChat({ friendUid, uid, message }));
                setMessage("");
              }}
            >
              <img alt="" src={send} />
            </button>
          </div>
        </>
      )}
      <ReactModal
        isOpen={open}
        // onAfterOpen={afterOpenModal}
        onRequestClose={() => setOpen(false)}
        style={customStyles}
        contentLabel="Image Modal"
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img
            alt=""
            src={!!file ? URL.createObjectURL(file) : ""}
            style={{ width: "200px", height: "200px" }}
          />
          <input onChange={(e) => setMessage(e.target.value)} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <img
              alt=""
              src={cancel}
              onClick={() => {
                setOpen(false);
                setFile(null);
                setMessage("");
              }}
            />
            <img
              alt=""
              src={send}
              onClick={() => {
                dispatch(addImage({ friendUid, uid, file, message }));
                setOpen(false);
                setFile(null);
                setMessage("");
              }}
            />
          </div>
        </div>
      </ReactModal>
    </div>
  );
};

export default Input;
