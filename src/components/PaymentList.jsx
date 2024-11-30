import React, { useEffect, useState } from 'react';
import { getPayments } from "../services/PaymentService";
import "./PaymentList.css";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getPayments();
        console.log(data);  // Debugging: Check what data is returned from the API

        if (data && data.length > 0) {
          setPayments(data);
        } else {
          setError('No payments found.');
        }
      } catch (error) {
        console.error("Error fetching payments:", error);  // Debugging: Log the error
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

export default PaymentHistory;

