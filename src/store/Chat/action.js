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
import { storage } from "../../firebase";
import {
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
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
      const { name, uid, email, friends, profileUrl } = userData;
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
        {
          uid: friend?.uid,
          name: friend?.name,
          email: friend?.email,
          profileUrl: friend?.profileUrl,
        },
      ]);
      await update(ref(db), updates);
      const updates2 = {};
      updates2[`users/${friend.uid}/friends`] = JSON.stringify([
        ...JSON.parse(friend?.friends),
        { uid, email, name, profileUrl },
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
    const messages = JSON.stringify([
      ...chats,
      {
        senderId: uid,
        recieverId: friendUid,
        message,
        sentAt: new Date(),
        type: "TEXT",
      },
    ]);
    const chatRef = ref(db, `chats/${uid}`);
    const friendChatRef = ref(db, `chats/${friendUid}`);
    const newChatRef = child(chatRef, friendUid);
    const newFriendCharRef = child(friendChatRef, uid);
    const friends = ref(db, `users/${friendUid}/friends`);
    get(friends).then(async (snap) => {
      const currChat = JSON.parse(snap.val()).filter(
        ({ uid: id }) => id == uid
      )[0];
      const me = myFriends.filter(({ uid: id }) => id == friendUid)[0];
      const remainingChats = JSON.parse(snap.val()).filter(
        ({ uid: id }) => id != uid
      );
      const myRemainingFriends = myFriends.filter(
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
        ...myRemainingFriends,
      ]);
      await update(ref(db), updates1);
      await update(ref(db), updates2);
    });

    set(newChatRef, messages)
      .then(async () => {
        await set(newFriendCharRef, messages);
        await dispatch(getChats(friendUid));
      })
      .catch(() => console.log("something went wrong"));
  };

export const getChats = (friendUid) => async (dispatch) => {
  const uid = getUid();
  const dbRef = ref(db);

  get(child(dbRef, `chats/${uid}/${friendUid}`)).then((snap) => {
    if (snap.exists()) {
      const data = JSON.parse(snap.val());
      dispatch(setChat(data));
    }
  });
};

export const addImage =
  ({ friendUid, uid, file, message = "" }) =>
  async (dispatch, getState) => {
    const {
      chatReducer: { chats },
    } = getState();
    const chatId = friendUid > uid ? friendUid + uid : uid + friendUid;
    const fileRef = storageRef(storage, `files/${chatId}/${file.name}`);
    const chatRef = ref(db, `chats/${uid}`);
    const friendChatRef = ref(db, `chats/${friendUid}`);
    const newChatRef = child(chatRef, friendUid);
    const newFriendChatRef = child(friendChatRef, uid);
    const snap = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snap.ref);
    const messages = JSON.stringify([
      ...chats,
      {
        senderId: uid,
        recieverId: friendUid,
        sentAt: new Date(),
        fileUrl: url,
        message,
        type: "FILE",
      },
    ]);

    set(newChatRef, messages)
      .then(async () => {
        await set(newFriendChatRef, messages);
        await dispatch(getChats(friendUid));
      })
      .catch(() => console.log("something went wrong"));
  };
