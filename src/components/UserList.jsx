import React, { useState, useEffect } from "react";
import { getUsers, getUserById } from "../services/UserService";
import {jwtDecode} from "jwt-decode"; // Ensure this is correctly imported
import { useNavigate } from "react-router-dom"; // Import React Router's useNavigate
import "./UserList.css"; // Import your CSS file

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the user's role from the token
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        const userRole =
          decodedToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        setRole(userRole);

        let data = [];
        if (userRole === "Customer") {
          data = await getUserById();
          setUsers([data]); // Wrapping in an array for consistent rendering
        } else if (userRole === "Admin") {
          data = await getUsers();
          setUsers(data);
        } else {
          throw new Error("Unauthorized access. Invalid role.");
        }

        if (!data || (Array.isArray(data) && data.length === 0)) {
          setError("No users found.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load user details.");
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (userId) => {
    navigate(`/edit-user/${userId}`); // Navigate to the edit user page with the user's ID
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <div className="user-card" key={user.id}>
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Username:</strong> {user.userName}
          </p>
          <p>
            <strong>Phone:</strong> {user.phoneNumber}
          </p>
          {role === "Customer" && (
            <button onClick={() => handleEditClick(user.id)}>Edit</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserList;
