import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCars } from "../services/CarService"; // Import Car service
import { getAllCarExtras } from "../services/CarExtraService"; // Import CarExtra service
import ClipLoader from "react-spinners/ClipLoader"; // To show a loading spinner
import moment from "moment"; // To calculate date differences easily
import "./AddReservation.css"; // Add your styling here
import { jwtDecode } from "jwt-decode";

const AddReservation =({ onReservationAdded }) =>{
  const [cars, setCars] = useState([]); // State to store car data
  const [carExtras, setCarExtras] = useState([]); // State to store car extras
  const [selectedCar, setSelectedCar] = useState(null); // State to store selected car
  const [selectedExtras, setSelectedExtras] = useState([]); // State for selected car extras
  const [loading, setLoading] = useState(false); // State for loading status
  const [totalPrice, setTotalPrice] = useState(0); // State to store the total price
  const [paymentMethod, setPaymentMethod] = useState("");
  const [formData, setFormData] = useState({
    pickupDate: new Date().toISOString().slice(0, 16),
    dropoffDate: new Date().toISOString().slice(0, 16),
    carId: "",
    extras: [],
    status: "Pending", 
    paymentMethod: "",// Default status is Pending
  });

  // Fetch cars and car extras on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch car data
        const carsData = await getCars();
        setCars(carsData);

        // Fetch car extras data
        const carExtrasData = await getAllCarExtras();
        setCarExtras(carExtrasData);
      } catch (error) {
        console.error("Failed to fetch cars or car extras:", error);
        toast.error("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle car selection
  const handleCarSelect = (carId) => {
    setSelectedCar(Number(carId)); // Convert to number
    setFormData((prevFormData) => ({ ...prevFormData, carId: Number(carId) }));
  };
  
  // Handle car extra selection
  const handleExtraSelect = (extraId) => {
    setSelectedExtras((prevExtras) =>
      prevExtras.includes(extraId)
        ? prevExtras.filter((id) => id !== extraId) // Deselect
        : [...prevExtras, extraId] // Select
    );
  };

  // Calculate total price based on car and car extras
  const calculateTotalPrice = () => {
    if (!selectedCar || !formData.pickupDate || !formData.dropoffDate) {
      console.log("Missing data for calculation.");
      setTotalPrice(0);
      return;
    }

    // Find the selected car
    const car = cars.find((car) => car.carId === Number(selectedCar));
if (!car) {
  console.error("Car not found with ID:", selectedCar);
}
    // Calculate the number of days
    const days = moment(formData.dropoffDate).diff(moment(formData.pickupDate), "days");
    if (days < 1) {
      toast.error("Drop-off date must be later than pickup date.");
      setTotalPrice(0);
      return;
    }

    let price = car.pricePerDay * days;

    // Add extra prices
    selectedExtras.forEach((extraId) => {
      const extra = carExtras.find((extra) => extra.extraId === extraId);
      if (extra) price += extra.price;
    });

    setTotalPrice(price);
  };
 
  
  // Trigger price recalculation whenever there are changes in form data
  useEffect(() => {
    calculateTotalPrice();
  }, [selectedCar, selectedExtras, formData.pickupDate, formData.dropoffDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the payment method is selected
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    // Check if the user is a customer
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      // Decode the token to get the user's role
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log("Role from token:", userRole);

      // Only allow customers to add reservations
      if (userRole !== "Customer") {
        toast.error("Unauthorized: Only customers can add reservations.");
        return;
      }

      // If the role is valid, proceed with reservation creation
      const newReservation = {
        ...formData,
        reservationId: Math.floor(Math.random() * 10000),
        paymentMethod: paymentMethod, // Include selected payment method
      };

      // Call onReservationAdded if it's provided
      if (onReservationAdded && typeof onReservationAdded === "function") {
        onReservationAdded(newReservation); // Pass the new reservation to the parent
      }

      toast.success("Reservation added successfully!");
    } catch (error) {
      console.error("Error decoding token or adding reservation:", error);
      toast.error("Error adding reservation. Please try again.");
    }
  };

    
  // Get the current date to restrict calendar selection
  const currentDate = new Date().toISOString().slice(0, 16);

  if (loading) {
    return (
      <div className="loading-container">
        <ClipLoader size={50} color="#00BFFF" />
      </div>
    );
  }

  return (
    <div className="add-reservation-form">
      <h2>Create a Reservation</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Pickup Date</label>
          <input
            type="datetime-local"
            name="pickupDate"
            value={formData.pickupDate}
            min={currentDate} // Disable past dates
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Dropoff Date</label>
          <input
            type="datetime-local"
            name="dropoffDate"
            value={formData.dropoffDate}
            min={currentDate} // Disable past dates
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Select Car</label>
          <select
  name="carId"
  value={formData.carId}
  onChange={(e) => handleCarSelect(e.target.value)} // Update selectedCar when dropdown changes
  required
>
  <option value="">-- Choose a car --</option>
  {cars.map((car) => (
    <option key={car.carId} value={car.carId}>
      {car.name} ({car.model}) - ${car.pricePerDay} per day
    </option>
  ))}
</select>

        </div>

        <div className="form-group">
          <label>Select Extras</label>
          <div className="car-extras">
            {carExtras.map((extra) => (
              <div key={extra.extraId} className="car-extra-checkbox">
                <input
                  type="checkbox"
                  id={`extra-${extra.extraId}`}
                  checked={selectedExtras.includes(extra.extraId)}
                  onChange={() => handleExtraSelect(extra.extraId)}
                />
                <label htmlFor={`extra-${extra.extraId}`}>{extra.name} - ${extra.price}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
  <label>Total Price Breakdown</label>
  <div className="price-breakdown">
    {selectedCar && formData.pickupDate && formData.dropoffDate ? (
      <>
        <p>
          Car (
          {cars.find((car) => car.carId === selectedCar)?.model || "None"}): $
          {(() => {
            const car = cars.find((car) => car.carId === selectedCar);
            const days = moment(formData.dropoffDate).diff(moment(formData.pickupDate), "days");
            return car && days > 0
              ? (car.pricePerDay * days).toFixed(2)
              : "0.00";
          })()}
        </p>
        <p>
          Extras: $
          {selectedExtras.reduce((acc, extraId) => {
            const extra = carExtras.find((extra) => extra.extraId === extraId);
            return acc + (extra ? extra.price : 0);
          }, 0).toFixed(2)}
        </p>
        <p>
          <strong>Total: $
            {(() => {
              const car = cars.find((car) => car.carId === selectedCar);
              const days = moment(formData.dropoffDate).diff(moment(formData.pickupDate), "days");
              const carPrice = car && days > 0 ? car.pricePerDay * days : 0;
              const extrasPrice = selectedExtras.reduce((acc, extraId) => {
                const extra = carExtras.find((extra) => extra.extraId === extraId);
                return acc + (extra ? extra.price : 0);
              }, 0);
              return (carPrice + extrasPrice).toFixed(2);
            })()}
          </strong>
        </p>
      </>
    ) : (
      <p>Please select a car and valid dates.</p>
    )}
  </div>
</div>
{/* Payment Method Selection */}
<div>
          <label>Payment Method:</label>
          <select
            name="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            <option value="paypal">PayPal</option>
            <option value="upi">UPI</option>
            <option value="credit_card">Credit Card</option>
          </select>
        </div>



        <button type="submit" className="submit-btn">
          Submit Reservation
        </button>
      </form>
    </div>
  );
};

export default AddReservation;