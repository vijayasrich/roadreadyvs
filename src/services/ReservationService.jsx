import axios from 'axios';

const API_URL = "https://localhost:7020/api/Reservations";

// Get reservations by UserId
const getReservationsByUserId = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

// Get all reservations
const getAllReservations = async () => {
  try {
    const token = localStorage.getItem("token");
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
const addReservation = async (reservationData) => {
  try {
    const token = localStorage.getItem("token");
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

export { getReservationsByUserId, getAllReservations,addReservation,calculateTotalPrice};
