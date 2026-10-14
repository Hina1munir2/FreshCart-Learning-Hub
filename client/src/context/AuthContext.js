
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

function getStoredSession() {
  try {
    const token = localStorage.getItem("freshcart_token");
    const savedUser = localStorage.getItem("freshcart_user");

    if (!token) {
      return { token: null, user: null };
    }

    // Read the token's expiration time.
    const decodedToken = jwtDecode(token);

    if (
      decodedToken.exp &&
      decodedToken.exp * 1000 <= Date.now()
    ) {
      localStorage.removeItem("freshcart_token");
      localStorage.removeItem("freshcart_user");

      return { token: null, user: null };
    }

    return {
      token,
      user: savedUser ? JSON.parse(savedUser) : null,
    };
  } catch (error) {
    localStorage.removeItem("freshcart_token");
    localStorage.removeItem("freshcart_user");

    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getStoredSession);

  function login(token, user) {
    localStorage.setItem("freshcart_token", token);
    localStorage.setItem("freshcart_user", JSON.stringify(user));

    setSession({ token, user });
  }

  function logout() {
    localStorage.removeItem("freshcart_token");
    localStorage.removeItem("freshcart_user");

    setSession({ token: null, user: null });
  }

  const value = {
    token: session.token,
    user: session.user,
    isAuthenticated: Boolean(session.token && session.user),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
