import axios from "axios";

const API_URL = "https://localhost:7020/api/Cars"; // Assuming Cars API

// Fetch all cars
const getCars = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    });
    return response.data; // Assuming the response contains an array of car objects
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw error;
  }
};

// Fetch a car by ID
const getCarById = async (carId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/${carId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Returning car details for a specific carId
  } catch (error) {
    console.error(`Error fetching car with ID ${carId}:`, error);
    throw error;
  }
};

export { getCars, getCarById };
