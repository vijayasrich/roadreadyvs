import React, { useEffect, useState } from "react";
import {
  getAllReservations,
  getReservationsByUserId,
  deleteReservation,
  approveReservation,
  cancelReservation,
} from "../services/ReservationService";
import { getCarById } from "../services/CarService";
import { jwtDecode } from "jwt-decode";
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

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
        setRole(userRole);

        const userId = decodedToken.userId;
        setUserId(userId);

        let data;
        if (userRole === "Customer") {
          data = await getReservationsByUserId(userId);
        } else if (userRole === "Admin" || userRole === "Agent") {
          data = await getAllReservations();
        } else {
          throw new Error("Unauthorized access. Invalid role.");
        }

        let combinedReservations = [];
        if (userRole === "Customer") {
          const { completedReservations = [], ongoingReservations = [] } = data;
          combinedReservations = [...completedReservations, ...ongoingReservations];
        } else {
          if (!Array.isArray(data)) {
            throw new Error("Admin/Agent data is not an array.");
          }
          combinedReservations = data;
        }

        const updatedReservations = await Promise.all(
          combinedReservations.map(async (reservation) => {
            const carDetails = await getCarById(reservation.carId);
            return {
              ...reservation,
              carMake: carDetails.make || "N/A",
              carModel: carDetails.model || "N/A",
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
  }, [addedReservation]);

  const handleCancel = async (reservationId, status) => {
    // Debugging line to check the reservation status
    console.log("Reservation Status:", status);
  
    // Check if the status is 'pending'
    if (status !== "pending") {
      alert("Only reservations with 'Pending' status can be canceled.");
      return;
    }
  
    try {
      // Call the cancelReservation function to cancel the reservation
      const response = await cancelReservation(reservationId);
      console.log("Cancel response:", response);  // Log the response from the backend
  
      // Update the reservations state to remove the canceled reservation
      setReservations((prev) =>
        prev.filter((res) => res.reservationId !== reservationId)
      );
  
      alert("Reservation canceled successfully.");
    } catch (err) {
      // Log any errors and show an alert message
      console.error("Error canceling reservation:", err);
      alert(err.message || "Failed to cancel reservation.");
    }
  };
  
  const isCancelEnabled = (status) => status === "pending";
  const handleDelete = async (reservationId, userId) => {
    try {
      await deleteReservation(reservationId);
      setReservations((prev) =>
        prev.filter((res) => res.reservationId !== reservationId)
      );
      // Notify customer after rejecting reservation
      alert(`Reservation for user ID: ${userId} has been rejected.`);
    } catch (err) {
      console.error("Error deleting reservation:", err);
    }
  };

  const isDeleteEnabled = (pickupDate, status) => {
    const today = new Date();
    const pickup = new Date(pickupDate);
    return pickup > today && status !== "confirmed"&& status !== "Canceled"; // Enable delete only if pickup is in the future and status is not confirmed
  };

  const handleApprove = async (reservationId) => {
    try {
      const result = await approveReservation(reservationId);
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.reservationId === reservationId
            ? { ...reservation, status: "confirmed" }
            : reservation
        )
      );
    } catch (error) {
      console.error("Error approving reservation:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="reservation-list">
      <h2>
        {role === "Admin" || role === "Agent"
          ? "All Reservations"
          : "Your Reservations"}
      </h2>
      <table>
        <thead>
          <tr>
            <th>Car</th>
            <th>Pickup Date</th>
            <th>Dropoff Date</th>
            <th>Status</th>
            {role === "Admin" || role === "Agent" ? <th>User ID</th> : null}
            <th>Actions</th>
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
                {role === "Admin" || role === "Agent" ? (
                  <td>{reservation.userId}</td>
                ) : null}
                <td>
                  {role === "Customer" && isCancelEnabled(reservation.status) && (
                    <button onClick={() => handleCancel(reservation.reservationId, reservation.status)}
                    disabled={reservation.status !== "pending"} // Disable if not pending
                  >
                      Cancel
                    </button>
                  )}
                  {role === "Admin" || role === "Agent" ? (
                    <>
                      {reservation.status === "pending" && (
                        <button
                          onClick={() =>
                            handleApprove(reservation.reservationId)
                          }
                        >
                          Approve
                        </button>
                      )}
                      <button
  onClick={() => handleDelete(reservation.reservationId, reservation.userId)}
  disabled={!isDeleteEnabled(reservation.pickupDate, reservation.status)}
>
  Reject
</button>

                    </>
                  ) : null}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={role === "Admin" || role === "Agent" ? "6" : "5"}>
                No reservations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default ReservationList;