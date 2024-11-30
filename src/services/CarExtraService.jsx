import axios from "axios";

const API_URL = "https://localhost:7020/api/CarExtra";

const getAllCarExtras = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching CarExtras:", error);
    throw error;
  }
};

// Get a single CarExtra by ID
const getCarExtraById = async (extraId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/${extraId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching car extra with ID ${extraId}:`, error);
    throw error;
  }
};

// Add a new CarExtra
const addCarExtra = async (carExtra) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_URL, carExtra, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the created car extra data
  } catch (error) {
    console.error("Error adding car extra:", error);
    throw error;
  }
};

// Update an existing CarExtra
const updateCarExtra = async (extraId, carExtra) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/${extraId}`, carExtra, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return the updated car extra data
  } catch (error) {
    console.error(`Error updating car extra with ID ${extraId}:`, error);
    throw error;
  }
};

// Delete a CarExtra by ID
const deleteCarExtra = async (extraId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/${extraId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Return confirmation of deletion
  } catch (error) {
    console.error(`Error deleting car extra with ID ${extraId}:`, error);
    throw error;
  }
};

export {
  getAllCarExtras,
  getCarExtraById,
  addCarExtra,
  updateCarExtra,
  deleteCarExtra,
};