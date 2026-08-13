// Thin local-session cache. The actual data (users, income, expense) now
// lives in MongoDB via the Express API — this file only remembers who's
// currently logged in on this browser (JWT + profile snapshot).

const TOKEN_KEY = "token";
const SESSION_KEY = "cashmate_user";

// Saves the response returned by /api/auth/login or /api/auth/register.
// Handles both shapes seen in the backend: register returns `_id`, login
// returns `id`.
export const saveSession = (userResponse) => {
  const { token, ...profile } = userResponse;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  const normalized = { ...profile, id: profile.id || profile._id };
  localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
  return normalized;
};

export const getSessionUser = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Called after GET /api/auth/getUser to refresh the cached profile
// (e.g. picks up profile picture changes made elsewhere).
export const updateSessionUser = (userDoc) => {
  const normalized = { ...userDoc, id: userDoc.id || userDoc._id };
  localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
  return normalized;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
};
