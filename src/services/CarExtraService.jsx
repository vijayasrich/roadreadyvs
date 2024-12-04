import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://localhost:7020/api/CarExtra";

// Get all car extras
const getAllCarExtras = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching CarExtras:", error);
    throw error;
  }
};

// Get a single car extra by ID
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

// Add a car extra
const addCarExtra = async (carExtraData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to add a car extra.");
      return;
    }

    const response = await axios.post(API_URL, carExtraData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    toast.success("Car extra added successfully!");
    return response.data;
  } catch (error) {
    toast.error("Failed to add car extra. Please try again.");
    console.error("Error adding car extra:", error);
  }
};

// Update car extra
const updateCarExtra = async (extraId, carExtraData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to update a car extra.");
      return;
    }

    const response = await axios.put(`${API_URL}/${extraId}`, carExtraData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    toast.success(`Car extra with ID ${extraId} updated successfully!`);
    return response.data;
  } catch (error) {
    toast.error("Failed to update car extra. Please try again.");
    console.error("Error updating car extra:", error);
  }
};

// Delete car extra
const deleteCarExtra = async (extraId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to delete a car extra.");
      return;
    }

    const response = await axios.delete(`${API_URL}/${extraId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    toast.success(`Car extra with ID ${extraId} deleted successfully!`);
    return response.data;
  } catch (error) {
    toast.error("Failed to delete car extra. Please try again.");
    console.error("Error deleting car extra:", error);
  }
};

export { getAllCarExtras, getCarExtraById, addCarExtra, updateCarExtra, deleteCarExtra };
