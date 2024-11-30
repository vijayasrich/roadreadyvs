import React, { createContext, useState, useEffect } from "react";

// AuthContext to provide login, logout, and the user's authentication state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuth(token); // Store the token (or user data) if it exists
    }
  }, []);

  const login = (token) => {
    setAuth(token); // Set token when user logs in
    localStorage.setItem("token", token); // Store token in localStorage
  };

  const logout = () => {
    setAuth(null); // Clear the token on logout
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;