import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/authService.js";

const AUTH_STORAGE_KEY = "url_shortener_auth";

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const decoded = decodeJwt(token);
  if (!decoded?.exp) {
    return true;
  }

  return Date.now() >= decoded.exp * 1000;
}

function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return { token: null, user: null };
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.token || isTokenExpired(parsed.token)) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return { token: null, user: null };
    }

    const decoded = decodeJwt(parsed.token);

    return {
      token: parsed.token,
      user: {
        id: decoded?.id,
        email: decoded?.email
      }
    };
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  const persistAuth = (token) => {
    const decoded = decodeJwt(token);
    const nextAuth = {
      token,
      user: {
        id: decoded?.id,
        email: decoded?.email
      }
    };

    setAuth(nextAuth);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
  };

  const clearAuth = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const signIn = async (credentials) => {
    const response = await loginUser(credentials);
    persistAuth(response.token);
    return response;
  };

  const signUp = async (payload) => {
    return registerUser(payload);
  };

  useEffect(() => {
    const handleTokenExpired = () => {
      clearAuth();
    };

    window.addEventListener("auth:expired", handleTokenExpired);
    return () => window.removeEventListener("auth:expired", handleTokenExpired);
  }, []);

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token),
      signIn,
      signUp,
      logout: clearAuth
    }),
    [auth.token, auth.user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export { AUTH_STORAGE_KEY };