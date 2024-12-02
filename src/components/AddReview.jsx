import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // For navigation and params
import { getAllReservations, getReservationsByUserId } from "../services/ReservationService";
//import ReservationService from "../services/ReservationService"; // Updated to use the new service
import { addReview } from "../services/ReviewService"; // Importing the service
import { toast } from "react-toastify"; // Optional for notifications
import "./AddReview.css";

const AddReviewPage = () => {
  const { carId } = useParams(); // Using params to get the carId, if applicable
  const [userReservations, setUserReservations] = useState([]);
  const [newReview, setNewReview] = useState({
    carId: "",
    rating: "",
    comment: "",
  });
  const [isCarReserved, setIsCarReserved] = useState(false);
  const navigate = useNavigate();
  const userId = 1; // Assuming you can get the logged-in user id. Update as needed.

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Using the ReservationService to fetch reservations
        const reservations = await getReservationsByUserId(userId);
        setUserReservations(reservations);

        // Check if the selected car has been reserved by the user
        const hasReservation = reservations.some(
          (reservation) => reservation.carId === carId
        );
        setIsCarReserved(hasReservation);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [userId, carId]); // Dependency on userId and carId

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isCarReserved) {
      toast.error("You must have a reservation for this car to leave a review.");
      return;
    }

    try {
      const addedReview = await addReview(newReview);
      toast.success("Review added successfully!");
      navigate("/reviews"); // Redirect to the reviews list after successful submission
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Error adding review.");
    }
  };

  const handleCarSelect = (e) => {
    const selectedCarId = e.target.value;
    setNewReview((prevReview) => ({
      ...prevReview,
      carId: selectedCarId,
    }));

    // Check if the user has a reservation for this car
    const hasReservation = userReservations.some(
      (reservation) => reservation.carId === selectedCarId
    );
    setIsCarReserved(hasReservation);
  };

  return (
    <div className="add-review-page">
      <h2>Add Review</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="carId"
          value={newReview.carId}
          onChange={handleCarSelect}
          required
        >
          <option value="">-- Choose a Car --</option>
          {userReservations.map((reservation) => (
            <option key={reservation.carId} value={reservation.carId}>
              Car ID: {reservation.carId} - {reservation.carModel} {/* Assuming the car model is available */}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="rating"
          placeholder="Rating (0-5)"
          min="0"
          max="5"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({ ...newReview, rating: e.target.value })
          }
          required
        />

        <textarea
          name="comment"
          placeholder="Comment"
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          required
        />

        <button type="submit" disabled={!isCarReserved}>
          Submit Review
        </button>
      </form>

      {!isCarReserved && (
        <p>You must have a reservation for this car to leave a review.</p>
      )}
    </div>
  );
};

export default AddReviewPage;
