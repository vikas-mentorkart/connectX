import Cookies from "js-cookie";

export const getUser = () => {
  if (Cookies.get("userData")) {
    const userData = JSON.parse(Cookies.get("userData"));
    return userData || {};
  }
};

export const getUid = () => {
  const { uid } = getUser() || {};
  return uid || "";
};
