import {
  ref,
  orderByChild,
  equalTo,
  query,
  get,
  update,
  child,
  set,
} from "firebase/database";
import { db } from "../../firebase";
import { getUid } from "../../hooks/commonHooks";
import { setActiveChat, setChat } from "./reducer";
export const addFriend = (email) => async (dispatch, getState) => {
  const {
    authReducer: { userData },
  } = getState();
  const friendRef = query(
    ref(db, "users/"),
    orderByChild("email"),
    equalTo(email)
  );
  get(friendRef)
    .then(async (snap) => {
      const { name, uid, email, friends } = userData;
      const friend = Object.values(snap.val())[0];
      const exists = !!friends.filter((item) => {
        return item.uid === friend.uid;
      }).length;
      if (exists) {
        console.log("friend exists");
        return;
      }
      const updates = {};
      updates[`users/${userData?.uid}/friends`] = JSON.stringify([
        ...userData.friends,
        { uid: friend?.uid, name: friend?.name, email: friend?.email },
      ]);
      await update(ref(db), updates);
      const updates2 = {};
      updates2[`users/${friend.uid}/friends`] = JSON.stringify([
        ...JSON.parse(friend?.friends),
        { uid, email, name },
      ]);
      await update(ref(db), updates2);
      await dispatch(addChat({ friendUid: friend.uid, uid, message: "" }));
    })
    .catch((err) => console.log(err.message));
};

export const addChat =
  ({ friendUid, uid, message }) =>
  async (dispatch, getState) => {
    const {
      chatReducer: { chats },
    } = getState();
    const {
      authReducer: {
        userData: { friends: myFriends },
      },
    } = getState() || {};
    const chatId = friendUid > uid ? friendUid + uid : uid + friendUid;
    const messages = JSON.stringify([
      ...chats,
      { senderId: uid, recieverId: friendUid, message, sentAt: new Date() },
    ]);
    const chatRef = ref(db, "chats");
    const newChatRef = child(chatRef, chatId);
    const friends = ref(db, `users/${friendUid}/friends`);
    get(friends).then(async (snap) => {
      const currChat = JSON.parse(snap.val()).filter(
        ({ uid: id }) => id == uid
      )[0];
      const me = myFriends.filter(({ uid: id }) => id == friendUid)[0];
      const remainingChats = JSON.parse(snap.val()).filter(
        ({ uid: id }) => id != uid
      );
      const myRemainingFrieds = myFriends.filter(
        ({ uid: id }) => id != friendUid
      );
      const updates1 = {};
      updates1[`users/${friendUid}/friends`] = JSON.stringify([
        { ...currChat, last_message: { message, sentAt: new Date() } },
        ...remainingChats,
      ]);
      const updates2 = {};
      updates2[`users/${uid}/friends`] = JSON.stringify([
        { ...me, last_message: { message, sentAt: new Date() } },
        ...myRemainingFrieds,
      ]);
      await update(ref(db), updates1);
      await update(ref(db), updates2);
    });
    set(newChatRef, messages)
      .then(() => {
        dispatch(getChats(friendUid));
      })
      .catch(() => console.log("something went wrong"));
  };

export const getChats = (friendUid) => async (dispatch) => {
  const uid = getUid();
  const chatId = friendUid > uid ? friendUid + uid : uid + friendUid;
  const dbRef = ref(db);

  get(child(dbRef, `chats/${chatId}`)).then((snap) => {
    if (snap.exists()) {
      const data = JSON.parse(snap.val());
      dispatch(setChat(data));
    }
  });
};
