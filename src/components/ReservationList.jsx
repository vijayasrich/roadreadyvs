import React, { useEffect, useState } from "react";
import { getAllReservations, getReservationsByUserId } from "../services/ReservationService"; // Import your API methods
import "./ReservationList.css";
import { getCarById } from "../services/CarService";

// Format the date string into a more readable format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  // Check if the date is valid
  return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
};

const ReservationList = ({ userId }) => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        let fetchedReservations;
        if (userId) {
          // Fetch reservations by userId if provided
          fetchedReservations = await getReservationsByUserId(userId);
        } else {
          // Otherwise, fetch all reservations
          fetchedReservations = await getAllReservations();
        }

        // Assuming carId is available, fetch car details and map the data accordingly
        const updatedReservations = await Promise.all(
          fetchedReservations.map(async (reservation) => {
            const carDetails = await getCarById(reservation.carId);
            return {
              ...reservation,
              carMake: carDetails.make,
              carModel: carDetails.model,
            };
          })
        );

        setReservations(updatedReservations);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("An error occurred while fetching reservations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [userId]); // Re-run the effect when userId changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="reservation-list">
      {error && <div className="error-message">{error}</div>}
      {reservations.length === 0 ? (
        <div className="no-reservations">No reservations found.</div>
      ) : (
        reservations.map((reservation) => (
          <div key={reservation.reservationId} className="reservation-card">
            <div className="reservation-header">
              <h3>Reservation ID: {reservation.reservationId}</h3>
            </div>
            <div className="reservation-body">
              <p>
                <strong>Car:</strong> {reservation.carMake} - {reservation.carModel}
              </p>
              <p><strong>Pickup Date:</strong> {formatDate(reservation.pickupDate)}</p>
              <p><strong>Dropoff Date:</strong> {formatDate(reservation.dropoffDate)}</p>
              <p><strong>Status:</strong> {reservation.status}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReservationList;
