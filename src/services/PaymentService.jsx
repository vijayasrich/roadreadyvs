import axios from "axios";
import{ jwtDecode } from "jwt-decode";

const API_URL = "https://localhost:7020/api/Payments";

// Get payment history for a customer or all payments for an admin
const getPayments = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    if (!token) {
      throw new Error("No token found");
    }

    // Decode the token to get user information
    const decodedToken = jwtDecode(token);
    const userId = decodedToken?.userId; // Assuming the token contains 'userId' field
    const role = decodedToken?.role; // Assuming the token contains 'role' field (admin or customer)

    // If the user is an admin, fetch all payments
    let url = API_URL;
    if (role === "admin") {
      url = `${API_URL}`; // Admin fetches all payments (no additional query parameter needed)
    } else if (role === "customer") {
      // If the user is a customer, fetch payments related to that specific user
      url = `${API_URL}/${userId}`; // Assuming the API accepts userId to filter payments for the customer
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export { getPayments };


