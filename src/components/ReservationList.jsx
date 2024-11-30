import React, { useEffect, useState } from "react";
import { getReservations, updateReservation } from "../services/ReservationService"; // Import updateReservation
import { useNavigate } from 'react-router-dom';
import "./ReservationList.css";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(localStorage.getItem("role")); // Assuming role is stored in localStorage
  const navigate = useNavigate(); // Use navigate instead of history

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const reservationData = await getReservations();
        setReservations(reservationData);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleApprove = async (id) => {
    const updatedReservation = { status: "approved" };
    await updateReservation(id, updatedReservation);
    setReservations(reservations.map(res => res.reservationId === id ? { ...res, status: "approved" } : res));
  };

  const handleReject = async (id) => {
    const updatedReservation = { status: "rejected" };
    await updateReservation(id, updatedReservation);
    setReservations(reservations.map(res => res.reservationId === id ? { ...res, status: "rejected" } : res));
  };

  const handleAddReservation = () => {
    // Redirect to a page where a user can add a new reservation
    navigate("/add-reservation"); // Use navigate instead of history.push
  };

  if (loading) {
    return <div>Loading reservations...</div>;
  }

  return (
    <div className="reservation-list">
      <h2>Reservations</h2>

      {/* Show the "Add Reservation" button for both Admin and Customer */}
      <button onClick={handleAddReservation}>Add Reservation</button>

      {/* Only show the reservations list to Admin */}
      {userRole === "Admin" ? (
        <>
          {reservations.length > 0 ? (
            <div className="reservations">
              {reservations.map((reservation) => (
                <div key={reservation.reservationId} className="reservation-card">
                  <h3>{reservation.carMake} {reservation.carModel}</h3>
                  <p><strong>Reservation ID:</strong> {reservation.reservationId}</p>
                  <p><strong>Customer:</strong> {reservation.customerName}</p>
                  <p><strong>Status:</strong> {reservation.status}</p>
                  <div className="admin-actions">
                    <button onClick={() => handleApprove(reservation.reservationId)}>Approve</button>
                    <button onClick={() => handleReject(reservation.reservationId)}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No reservations available.</p>
          )}
        </>
      ) : (
        <p> </p>
      )}
    </div>
  );
};

export default ReservationList;
