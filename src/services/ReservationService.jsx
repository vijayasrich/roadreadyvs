import axios from "axios";

const API_URL = "https://localhost:7020/api/Reservations";

const getReservations = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    const response = await axios.get(API_URL, {
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

const getReservationById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching reservation with ID ${id}:`, error);
    throw error;
  }
};

const addReservation = async (reservation) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_URL, reservation, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the created reservation data
  } catch (error) {
    console.error("Error adding reservation:", error);
    throw error;
  }
};

const updateReservation = async (id, reservation) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/${id}`, reservation, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the updated reservation data
  } catch (error) {
    console.error(`Error updating reservation with ID ${id}:`, error);
    throw error;
  }
};

const deleteReservation = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return confirmation of deletion
  } catch (error) {
    console.error(`Error deleting reservation with ID ${id}:`, error);
    throw error;
  }
};

export {
  getReservations,
  getReservationById,
  addReservation,
  updateReservation,
  deleteReservation,
};
