import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // For routing and navigation
import { getCarById, updateCar } from "../services/CarService"; // Import service methods
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EditCar.css";

const EditCar = () => {
  const { id } = useParams(); // Extract car ID from the URL
  const navigate = useNavigate();

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [carType, setCarType] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("true");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch car details by ID
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const car = await getCarById(id);
        setMake(car.make);
        setModel(car.model);
        setYear(car.year);
        setPricePerDay(car.pricePerDay);
        setCarType(car.carType);
        setLocation(car.location);
        setAvailability(car.availability ? "true" : "false");
        setImageUrl(car.imageUrl);
      } catch (error) {
        toast.error("Failed to load car details. Please try again.");
      }
    };
    fetchCarDetails();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedCar = {
      carId: id,
      make,
      model,
      year: parseInt(year),
      pricePerDay: parseFloat(pricePerDay),
      carType,
      location,
      availability: availability === "true",
      imageUrl,
    };

    try {
      await updateCar(id, updatedCar);
      toast.success("Car updated successfully!");
      navigate("/cars"); // Redirect to the car listing page
    } catch (error) {
      toast.error("Failed to update car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-car-container">
      <h2>Edit Car Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Make */}
        <div className="form-group">
          <label htmlFor="make">Make</label>
          <input
            type="text"
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Enter car make"
          />
        </div>

        {/* Model */}
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input
            type="text"
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Enter car model"
          />
        </div>

        {/* Year */}
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter manufacturing year"
          />
        </div>

        {/* Price Per Day */}
        <div className="form-group">
          <label htmlFor="pricePerDay">Price Per Day</label>
          <input
            type="number"
            id="pricePerDay"
            value={pricePerDay}
            onChange={(e) => setPricePerDay(e.target.value)}
            placeholder="Enter price per day"
          />
        </div>

        {/* Car Type */}
        <div className="form-group">
          <label htmlFor="carType">Car Type</label>
          <input
            type="text"
            id="carType"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            placeholder="Enter car type"
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter car location"
          />
        </div>

        {/* Availability */}
        <div className="form-group">
          <label htmlFor="availability">Availability</label>
          <select
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>

        {/* Image URL */}
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Car"}
        </button>
      </form>
    </div>
  );
};

export default EditCar;
