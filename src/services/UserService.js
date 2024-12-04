import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

const API_URL = "https://localhost:7020/api/User";

// Helper function to get the authentication token
const getAuthToken = () => {
  return localStorage.getItem("token"); // Assuming token is stored in localStorage
};

// Helper function to decode token and extract user details
const getUserIdFromToken = () => {
  const token = getAuthToken();
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId; // Ensure the token contains a `userId` claim
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  return null;
};

// Get all users (Only visible to Admin and Agent)
const getUsers = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

// Get a single user by ID (Visible to the user and Admin)
// For customers, the ID is retrieved from the login token.
const getUserById = async () => {
  try {
    const token = getAuthToken();
    const userId = getUserIdFromToken();

    if (!userId) {
      throw new Error("User ID could not be retrieved from the token.");
    }

    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
// Update a user by ID
const updateUser = async (userId, userDto) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/${userId}`, userDto, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw error;
  }
};

export { getUsers, getUserById, updateUser };
