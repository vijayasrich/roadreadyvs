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


const addCar = async (carData) => {
  try {
    // Get token from localStorage (or wherever it's stored)
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "https://localhost:7020/api/Cars", 
      carData, 
      {
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
      }
    );
    console.log("Car added successfully", response.data);
    return response;
  } catch (error) {
    console.error("Error adding car:", error);
    throw error; // Ensure errors are thrown to be caught in the component
  }
};

const updateCar = async (id, carData) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from storage

    const response = await axios.put(
      `${API_URL}/${id}`, // Endpoint with the car ID
      carData, // Updated car data
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      }
    );

    console.log(`Car with ID ${id} updated successfully`, response.data);
    return response.data; // Return success message or updated data
  } catch (error) {
    console.error(`Error updating car with ID ${id}:`, error);
    throw error; // Ensure errors are propagated
  }
};
const deleteCar = async (id) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from storage

    const response = await axios.delete(
      `${API_URL}/${id}`, // Endpoint with the car ID
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      }
    );

    console.log(`Car with ID ${id} deleted successfully`, response.data);
    return response.data; // Return success message
  } catch (error) {
    console.error(`Error deleting car with ID ${id}:`, error);
    throw error; // Ensure errors are propagated
  }
};


export { getCars, getCarById, addCar,updateCar,deleteCar };
