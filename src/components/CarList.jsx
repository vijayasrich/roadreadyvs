import React, { useEffect, useState } from "react";
import { getCars } from "../services/CarService"; // Your CarService to fetch car data
import "./CarList.css"

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carData = await getCars();
        setCars(carData); // Set the car data into state
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) {
    return <div>Loading cars...</div>;
  }

  return (
    <div className="car-list">
      <h2>Available Cars</h2>
      <div className="cars">
        {cars.map((car) => (
          <div key={car.carId} className="car-card">
            <div className="car-card-inner">
              {/* Left side: Image */}
              <div className="car-image-container">
                <img
                  src={require(`../images/${car.imageUrl}`).default}
                  alt={car.make}
                  className="car-image"
                />
              </div>

              {/* Right side: Details */}
              <div className="car-details">
                <h3>{`${car.make} ${car.model}`}</h3>
                <p><strong>Car ID:</strong> {car.carId}</p> {/* Displaying the carId */}
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Location:</strong> {car.location}</p>
                <p><strong>Price per Day:</strong> ${car.pricePerDay}</p>
                <p><strong>Type:</strong> {car.carType}</p>
                <p><strong>Availability:</strong> {car.availability ? "Available" : "Not Available"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;
