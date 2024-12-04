import React, { useState } from "react";
import ReservationList from "./ReservationList";
import AddReservation from "./AddReservation";

const ReservationManagement = () => {
  const [refreshSignal, setRefreshSignal] = useState(false);

  const handleReservationAdded = () => {
    setRefreshSignal((prev) => !prev); // Toggle signal to refresh ReservationList
  };

  return (
    <div>
      <AddReservation onReservationAdded={handleReservationAdded} />
      <ReservationList refreshSignal={refreshSignal} />
    </div>
  );
};

export default ReservationManagement;
