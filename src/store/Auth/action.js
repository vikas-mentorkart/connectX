import { db, auth } from "../../firebase";
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
            const { email, name, friends, uid } = snap.val();
            if (snap.exists())
              dispatch(
                setLogin({ email, name, friends: JSON.parse(friends), uid })
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
  ({ email, password, display_name }) =>
  async (dispatch) => {
    dispatch(setIsLoading(true));
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        updateProfile(res?.user, { displayName: display_name })
          .then((user) => {
            const dbRef = ref(db, "users");
            const newLocationRef = child(dbRef, res.user.uid);
            set(newLocationRef, {
              name: display_name,
              uid: res.user.uid,
              email: res.user.email,
              friends: "[]",
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
        const { email, name, friends, uid } = user;
        const arr = JSON.parse(friends);
        arr.forEach((element) => {
          delete element.friends;
        });
        dispatch(setLogin({ email, name, friends: arr, uid }));
      }
    })
    .catch((err) => console.log("something went wrong"));
};
