import React, { useEffect, useState } from 'react';
import { getPaymentsByUserId, getAllPayments } from "../services/PaymentService";
import "./PaymentList.css";
import { jwtDecode } from 'jwt-decode';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Get the user's role from the token
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        setRole(userRole);
        
        let data = [];
        if (userRole === "Customer") {
          // If the user is a customer, fetch their specific payments
          data = await getPaymentsByUserId();
        } else if (userRole === "Admin") {
          // If the user is an admin, fetch all payments
          data = await getAllPayments();
        } else {
          throw new Error("Unauthorized access. Invalid role.");
        }

        if (data && data.length > 0) {
          setPayments(data);
        } else {
          setError('No payments found.');
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError('Failed to load payment history.');
      }
    };

    fetchPayments();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Payment History</h2>
      {payments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Reservation ID</th>
              <th>Payment Method</th>
              <th>Payment Date</th>
              <th>Amount</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.paymentId}>
                <td>{payment.paymentId}</td>
                <td>{payment.reservationId}</td>
                <td>{payment.paymentMethod}</td>
                <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>{payment.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payments found.</p>
      )}
    </div>
  );
};

export default PaymentList;
