import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getSessionUser, updateSessionUser } from "../utils/storage";
import { fetchCurrentUser } from "../utils/api";

// Redirects to /login if there's no token, and revalidates it against the
// backend (GET /api/auth/getUser). If the token is expired/invalid, the
// axios response interceptor in axiosInstance.js already clears the
// session and redirects on the 401 — this just kicks that request off.
const useUserAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    // Keep the cached sidebar profile (name/photo) fresh.
    fetchCurrentUser()
      .then((user) => updateSessionUser(user))
      .catch(() => {
        // 401 is already handled globally by axiosInstance; anything else
        // (e.g. backend offline) just falls back to the cached profile.
      });
  }, [navigate]);

  return getSessionUser();
};

export default useUserAuth;
