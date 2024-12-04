import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

// Create AuthContext to provide login, logout, and the user's authentication state
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [userRole, setUserRole] = useState(null); // Add a state for the user role

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the JWT token
        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setAuth(token); // Store the token if it exists
        setUserRole(role); // Store the user's role
      } catch (error) {
        console.error("Error decoding token", error);
        setAuth(null);
        setUserRole(null);
      }
    }
  }, []);

  const login = (token) => {
    setAuth(token); // Set token when user logs in
    localStorage.setItem("token", token); // Store token in localStorage

    // Decode the token to get user role and store it
    const decodedToken = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    setUserRole(role);
  };

  const logout = () => {
    setAuth(null); // Clear the token on logout
    setUserRole(null); // Clear the user role
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ auth, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
