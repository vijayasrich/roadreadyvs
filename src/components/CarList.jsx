import React, { useEffect, useState, useContext } from "react";
import { getCars } from "../services/CarService";
import { deleteCar } from "../services/CarService";
import "./CarList.css";
import { useNavigate } from "react-router-dom";
import AuthContext from "../utils/AuthContext";
import "./DeleteCar.css";

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carData = await getCars();
        setCars(carData);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleDelete = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await deleteCar(carId); // Call delete service
        setCars((prevCars) => prevCars.filter((car) => car.carId !== carId)); // Remove car from list
        alert("Car deleted successfully!");
      } catch (error) {
        console.error("Error deleting car:", error);
        alert("Failed to delete the car. Please try again.");
      }
    }
  };

  const handleAddCarClick = () => {
    navigate("/add-car");
  };

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
              <div className="car-image-container">
                <img src={car.imageUrl} alt={car.make} className="car-image" />
              </div>
              <div className="car-details">
                <h3>{`${car.make} ${car.model}`}</h3>
                <p><strong>Car ID:</strong> {car.carId}</p>
                <p><strong>Year:</strong> {car.year}</p>
                <p><strong>Price per Day:</strong> ${car.pricePerDay}</p>
                <p><strong>Type:</strong> {car.carType}</p>
                <p><strong>Availability:</strong> {car.availability ? "Available" : "Not Available"}</p>
              </div>
            </div>
            {userRole === "Admin" && (
              <div className="admin-actions">
                <button onClick={() => navigate(`/edit-car/${car.carId}`)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(car.carId)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {userRole === "Admin" && (
        <button onClick={handleAddCarClick}>Add Car</button>
      )}
    </div>
  );
};

export default CarList;
