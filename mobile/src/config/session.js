import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "incluwork.auth.token";
let token = null;

export const setSessionToken = (nextToken) => {
  token = nextToken || null;
  if (token) {
    SecureStore.setItemAsync(TOKEN_KEY, token).catch(() => {});
  }
};

export const restoreSessionToken = async () => {
  try {
    const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
    token = storedToken || null;
    return token;
  } catch (error) {
    token = null;
    return null;
  }
};

export const clearSessionToken = () => {
  token = null;
  SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
};

export const authHeaders = () => token ? { Authorization: `Bearer ${token}` } : {};

export const getSessionRole = () => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = typeof atob === "function"
      ? atob(normalized)
      : globalThis.atob(normalized);
    return JSON.parse(decoded).role || null;
  } catch (error) {
    return null;
  }
};
