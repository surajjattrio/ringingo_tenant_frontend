// THIRD - PARTY IMPORT
import Cookies from "js-cookie";

/* ============================== AUTH HEADER ============================== */

export default function authHeader() {
  const user = JSON.parse(Cookies.get("user") || "{}");

  if (user && user.access_token) {
    return { Authorization: "Bearer " + user?.access_token };
  } else {
    return {};
  }
}
