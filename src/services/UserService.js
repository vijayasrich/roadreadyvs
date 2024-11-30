import axios from "axios";

const API_URL = "https://localhost:7020/api/User";

// Helper function to get the authentication token
const getAuthToken = () => {
  return localStorage.getItem("token"); // Assuming token is stored in localStorage
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
const getUserById = async (id) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export { getUsers, getUserById };
