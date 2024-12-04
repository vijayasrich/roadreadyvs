import React, { useEffect, useState } from "react";
import { getAllReservations, getReservationsByUserId } from "../services/ReservationService";
import { deleteReservation} from "../services/ReservationService";
import { getCarById } from "../services/CarService";
import {jwtDecode} from "jwt-decode";
import "./ReservationList.css";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
};

const ReservationList = ({ addedReservation }) => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState(null);

  // Fetch reservations on initial load
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setRole(userRole);

        let data = [];
        if (userRole === "Customer") {
          data = await getReservationsByUserId();
        } else if (userRole === "Admin" || userRole === "Agent") {
          data = await getAllReservations();
        } else {
          throw new Error("Unauthorized access. Invalid role.");
        }

        const updatedReservations = await Promise.all(
          data.map(async (reservation) => {
            const carDetails = await getCarById(reservation.carId);
            return { ...reservation, carMake: carDetails.make, carModel: carDetails.model };
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
  }, [addedReservation]);

  const handleDelete = async (reservationId) => {
    try {
      await deleteReservation(reservationId);
      setReservations((prev) => prev.filter((res) => res.reservationId !== reservationId));
    } catch (err) {
      console.error("Error deleting reservation:", err);
    }
  };

  const isDeleteEnabled = (pickupDate) => {
    const today = new Date();
    const pickup = new Date(pickupDate);
    return pickup > today; // Enable delete if pickup date is in the future
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="reservation-list">
      <h2>{role === "Admin" || role === "Agent" ? "All Reservations" : "Your Reservations"}</h2>
      <table>
        <thead>
          <tr>
            <th>Car</th>
            <th>Pickup Date</th>
            <th>Dropoff Date</th>
            <th>Status</th>
            {role === "Admin" || role === "Agent" ? <th>User ID</th> : null}
            {(role === "Admin" || role === "Agent") && <th>Actions</th>}
            {/*<th>Actions</th>*/}
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <tr key={reservation.reservationId}>
                <td>{`${reservation.carMake} ${reservation.carModel}`}</td>
                <td>{formatDate(reservation.pickupDate)}</td>
                <td>{formatDate(reservation.dropoffDate)}</td>
                <td>{reservation.status}</td>
  
                {/* Display userId column only for Admin or Agent */}
                {role === "Admin" || role === "Agent" ? <td>{reservation.userId}</td> : null}
  
                {/* Only render the Actions column if the role is Admin or Agent */}
                {role === "Admin" || role === "Agent" ? (
                  <td>
                    <button
                      onClick={() => handleDelete(reservation.reservationId)}
                      disabled={!isDeleteEnabled(reservation.pickupDate)}
                    >
                      Reject
                    </button>
                  </td>
                ) : null}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={role === "Admin" || role === "Agent" ? "6" : "5"}>No reservations found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  
};

export default ReservationList;
