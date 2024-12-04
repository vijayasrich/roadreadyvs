import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://localhost:7020/api/Payments";

// Get all payments (for admins)
const getAllPayments = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    if (!token) {
      throw new Error("No token found");
    }

    // Decode the token to get user information
    const decodedToken = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Use the correct claim name for role
    console.log("Role from token:", role); 

    // Ensure the user is an admin to fetch all payments
    if (role !== "Admin") {
      throw new Error("Unauthorized access. Only admins can fetch all payments.");
    }

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    });
    return response.data; // Return all payments
  } catch (error) {
    console.error("Error fetching all payments:", error);
    throw error;
  }
};

// Get payments by userId (for customers)
const getPaymentsByUserId = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    if (!token) {
      throw new Error("No token found");
    }

    // Decode the token to get user information
    const decodedToken = jwtDecode(token);
    const userId = decodedToken?.userId; // Assuming the token contains 'userId' field
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Use the correct claim name for role
    console.log("Role from token:", role);

    // If the user is a customer, fetch payments related to that specific user
    if (role === "Customer" && userId) {
      const url = `${API_URL}/user/${userId}`; // This is where we pass the userId to filter payments for the customer
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      return response.data; // Return the customer's payments
    } else {
      throw new Error("Unauthorized access. Only customers can fetch their own payments.");
    }
  } catch (error) {
    console.error("Error fetching payments by userId:", error);
    throw error;
  }
};

// Export the functions
export { getAllPayments, getPaymentsByUserId };
