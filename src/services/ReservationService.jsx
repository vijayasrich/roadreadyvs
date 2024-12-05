import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// Base API URLs
const API_URL = "https://localhost:7020/api/Reservations";
const API_URL_BY_USER = "https://localhost:7020/api/Reservations/all";

// Get reservations by user ID (for Customers only)
const getReservationsByUserId = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const decodedToken = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log("Decoded Role from token:", role);

    if (role === "Customer" && userId) {
      const url = `${API_URL_BY_USER}/${userId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } else {
      throw new Error("Unauthorized access. Only customers can fetch their own reservations.");
    }
  } catch (error) {
    console.error("Error fetching reservations:", error.response || error.message);
    throw error;
  }
};

// Get all reservations (for Admin and Agent roles)
const getAllReservations = async () => {
  try {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log("Role from token:", role);

    if (role !== "Admin" && role !== "Agent") {
      throw new Error("Unauthorized: Only Admin or Agent can access all reservations.");
    }

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    throw error;
  }
};

// Add a new reservation (only for Customer role)
const addReservation = async (reservationData) => {
  try {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log("Role from token:", role);

    if (role !== "Customer") {
      throw new Error("Unauthorized: Only customers can add reservations.");
    }

    // Ensure the carExtraIds is always an array, even if empty or undefined
    if (!reservationData.carExtraIds) {
      reservationData.carExtraIds = [];
    }

    console.log("Sending reservation data:", reservationData);

    const response = await axios.post(API_URL, reservationData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Reservation added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding reservation:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Delete a reservation (only for Admin role)
const deleteReservation = async (reservationId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    // Decode the token to get user information
    const decodedToken = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log("Role from token:", role);

    if (role !== "Admin") {
      throw new Error("Unauthorized: Only Admin can delete reservations.");
    }

    const response = await axios.delete(`${API_URL}/${reservationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Reservation deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting reservation:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Calculate the total price (you can modify this as per your actual pricing model)
const calculateTotalPrice = (pickupDate, dropoffDate, carCostPerDay, extraIds) => {
  const diffInTime = new Date(dropoffDate).getTime() - new Date(pickupDate).getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);

  // Calculate extra cost from extraIds
  let extraCost = 0;
  extraIds.forEach((extraId) => {
    extraCost += 10; // Assume each extra has a fixed cost, modify based on your logic
  });

  // Total price logic
  const totalPrice = carCostPerDay * diffInDays + extraCost;
  return totalPrice;
};
const approveReservation = async (reservationId) => {
  try {
    // Prepare the request payload
    const reservationData = {
      reservationId: reservationId, // Adjust based on the backend's expectations
      status: "confirmed",
    };

    // Make the PUT request
    const response = await axios.put(
      `https://localhost:7020/api/Reservations/${reservationId}/status`,
      reservationData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT for secure APIs
          'Content-Type': 'application/json', // Ensure JSON content type
        },
      }
    );

    console.log("Reservation approved:", response.data);
    return response.data;
  } catch (error) {
    // Handle error responses or generic issues
    if (error.response) {
      console.error("Error details:", error.response.data);
      throw new Error(error.response.data.message || "Failed to approve reservation.");
    } else {
      console.error("Error approving reservation:", error.message);
      throw new Error("Failed to approve reservation.");
    }
  }
};
const cancelReservation = async (reservationId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/cancel/${reservationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error canceling reservation:", error.response?.data || error.message);
    
    // Throw specific error message
    if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || "Failed to cancel reservation.");
    } else if (error.response?.status === 401) {
      throw new Error("Unauthorized: You do not have permission to cancel this reservation.");
    } else {
      throw new Error("An unexpected error occurred while canceling reservation.");
    }
  }
};


export { getReservationsByUserId, getAllReservations, addReservation, deleteReservation, calculateTotalPrice,approveReservation,cancelReservation };
