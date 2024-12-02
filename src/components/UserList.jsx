import React, { useState, useEffect } from "react";
import { getUsers,getUserById  } from "../services/UserService"; // Ensure this is correctly imported
import "./UserList.css"; // Import your CSS file



const UserList = ({ isAdmin }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin) {
          const userList = await getUsers();
          setUsers(userList);
        } else {
          const user = await getUserById();
          setUsers([user]); // Wrapping in an array for consistent rendering
        }
      } catch (err) {
        setError("Failed to fetch user details. Please try again later.");
        console.error(err);
      }
    };

    fetchData();
  }, [isAdmin]);

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
        </div>
      ))}
    </div>
  );
};

export default UserList;

