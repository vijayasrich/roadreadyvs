import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { getUserById, updateUser } from "../services/UserService"; // Ensure correct imports
import { jwtDecode } from "jwt-decode"; // For decoding the token
import "./EditUser.css";

const EditUser = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  
  // Extract userId from token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const decodedToken = jwtDecode(token);
    return decodedToken.userId; // Get userId from the token
  };

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = getUserIdFromToken(); // Get userId from token
        const userData = await getUserById(userId); // Get the user details
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to load user details.");
      }
    };

    fetchUser();
  }, []);

  // Handle save button click to update user data
  const handleSaveClick = async () => {
    try {
      const userId = getUserIdFromToken(); // Get userId from the token
      await updateUser(userId, user); // Update the user with the given data
      navigate("/users"); // Redirect to the user details page after success
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user details.");
    }
  };

  return (
    <div className="edit-user-card">
      <h2>Edit User</h2>
      {error && <div>{error}</div>}
      <form>
        <label>
          First Name:
          <input
            type="text"
            value={user.firstName || ""}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={user.lastName || ""}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            value={user.userName || ""}
            onChange={(e) => setUser({ ...user, userName: e.target.value })}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            value={user.phoneNumber || ""}
            onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
          />
        </label>
        <button type="button" onClick={handleSaveClick}>
          Save
        </button>
      </form>
    </div>
  );
};

export default EditUser;
