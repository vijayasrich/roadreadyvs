import axios from "axios";

const API_URL = "https://localhost:7020/api/Payments";

// Get payment history for a customer or all payments for an admin
const getPayments = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    const response = await axios.get(API_URL, {
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

