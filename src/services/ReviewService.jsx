import axios from "axios";

const API_URL = "https://localhost:7020/api/Reviews";

// Get all Reviews
const getReviews = async () => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

// Get Review by CarId
const getReviewByCarId = async (carId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/ByCar/${carId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching review for car ID ${carId}:`, error);
    throw error;
  }
};

// Add a new Review
const addReview = async (review) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_URL, review, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// Export the service functions
export {
  getReviews,
  getReviewByCarId,
  addReview,
};
