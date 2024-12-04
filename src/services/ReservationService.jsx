import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const API_URL = "https://localhost:7020/api/Reservations";

// Get reservations by UserId - Accessible only by the customer who made the reservation
const getReservationsByUserId = async (userId) => {
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

// Get all reservations - Accessible only by Admin or Agent
const getAllReservations = async () => {
  try {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Use the correct claim name for role
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

// Add reservation (only for customers)
const addReservation = async (reservationData) => {
  try {
    const token = localStorage.getItem("token");
    
    // Decode the token to get the user's role
    const decodedToken = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log("Role from token:", role); 
    // Only allow customers to add reservations
    if (role !== "Customer") {
      throw new Error("Unauthorized: Only customers can add reservations.");
    }

    const response = await axios.post(API_URL, reservationData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding reservation:", error);
    throw error;
  }
};

// Calculate total price based on car cost and extra charges
const calculateTotalPrice = (pickupDate, dropoffDate, carCostPerDay, extraIds) => {
  const diffInTime = new Date(dropoffDate).getTime() - new Date(pickupDate).getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);

  // Calculate extra cost from extraIds
  let extraCost = 0;
  extraIds.forEach((extraId) => {
    extraCost += 10; // Assume each extra has a fixed cost, change this to your logic
  });

  // Total price logic
  const totalPrice = carCostPerDay * diffInDays + extraCost;
  return totalPrice;
};
// Delete reservation (only for Admin)
const deleteReservation = async (reservationId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    // Decode the token to get user information
    const decodedToken = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]; // Correct claim for role
    console.log("Role from token:", role);

    // Only allow Admin to delete reservations
    if (role !== "Admin") {
      throw new Error("Unauthorized: Only Admin can delete reservations.");
    }

    // Perform the delete action
    const response = await axios.delete(`https://localhost:7020/api/Reservations/${reservationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Reservation deleted successfully:', response.data);
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw error;
  }
};


export { getReservationsByUserId, getAllReservations, addReservation, calculateTotalPrice,deleteReservation };
