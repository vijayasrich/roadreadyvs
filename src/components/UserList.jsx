import React, { useState, useEffect } from "react";
import { getUsers } from "../services/UserService"; // Ensure this is correctly imported
import "./UserList.css"; // Import your CSS file

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(); // Fetch users from the API
        setUsers(data); // Update state with the users data
      } catch (error) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-list">
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="card-container">
          {users.map((user) => (
            <div className="card" key={user.userId}>
              <h2>{user.firstName} {user.lastName}</h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Username:</strong> {user.userName}</p>
              <p><strong>Phone:</strong> {user.phoneNumber}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
