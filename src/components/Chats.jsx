import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getChats } from "../store/Chat/action";
import { setActiveChat } from "../store/Chat/reducer";
import dayjs from "dayjs";
const Chats = () => {
  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.authReducer.userData);
  const { activeChat } = useSelector((state) => state.chatReducer);
  return (
    <div className="chats">
      {(friends || []).map((item, i) => {
        return (
          <div
            className="userChat"
            style={
              item?.uid == activeChat?.uid ? { backgroundColor: "#2f2d52" } : {}
            }
            key={i}
            onClick={() => {
              dispatch(getChats(item?.uid));
              dispatch(setActiveChat(item));
            }}
          >
            <img alt="" src={item?.profileUrl} />
            <div className="userChatInfo">
              <span>{item.name}</span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p>{item?.last_message?.message}</p>
                <p>{dayjs(item?.last_message?.sentAt).format("hh:mm A")}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chats;
