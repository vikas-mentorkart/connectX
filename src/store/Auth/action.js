import { db, auth, storage } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  set,
  get,
  ref,
  child,
  equalTo,
  orderByChild,
  query,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { setIsLoading, setLogin } from "./reducer";
export const userLogin =
  ({ email, password }) =>
  async (dispatch) => {
    dispatch(setIsLoading(true));
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const dbRef = ref(db);
        get(child(dbRef, `users/${res.user.uid}`))
          .then((snap) => {
            const { email, name, friends, uid, profileUrl } = snap.val();
            if (snap.exists())
              dispatch(
                setLogin({
                  email,
                  name,
                  friends: JSON.parse(friends),
                  uid,
                  profileUrl,
                })
              );
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

export const userSignUp =
  ({ email, password, display_name }, profileImg) =>
  async (dispatch) => {
    dispatch(setIsLoading(true));
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        updateProfile(res?.user, { displayName: display_name })
          .then(async (user) => {
            const dbRef = ref(db, "users");
            const imgRef = storageRef(
              storage,
              `profileImages/${profileImg.name}`
            );
            const newLocationRef = child(dbRef, res.user.uid);
            const snap = await uploadBytes(imgRef, profileImg);
            const url = await getDownloadURL(snap.ref);
            await set(newLocationRef, {
              name: display_name,
              uid: res.user.uid,
              email: res.user.email,
              friends: "[]",
              profileUrl: url,
            })
              .then(() => {
                dispatch(userLogin({ email, password }));
              })
              .catch(() => {
                console.log("something went wrong");
              });
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => console.log(err.message));
  };

export const getUserById = (id) => async (dispatch) => {
  const userRef = query(ref(db, "users/"), orderByChild("uid"), equalTo(id));
  get(userRef)
    .then((snap) => {
      if (snap.exists()) {
        const user = Object.values(snap.val())[0];
        const { email, name, friends, uid, profileUrl } = user;
        const arr = JSON.parse(friends);
        arr.forEach((element) => {
          delete element.friends;
        });
        dispatch(setLogin({ email, name, friends: arr, uid, profileUrl }));
      }
    })
    .catch((err) => console.log("something went wrong"));
};
