import React, { useState } from "react";
import { addCar } from "../services/CarService"; 
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import "./AddCar.css"; 

const AddCar = () => {
  // State to hold form data
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [carType, setCarType] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("true"); 
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false); 

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!make || !model || !year || !pricePerDay || !carType || !location || !imageUrl) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true); 

    const carDTO = {
      carId: 0, // carId will be autogenerated by the backend
      make,
      model,
      year: parseInt(year), // Convert to number
      pricePerDay: parseFloat(pricePerDay), // Convert to number
      carType,
      location,
      availability: availability === "true", 
      imageUrl,
    };

    try {
      const response = await addCar(carDTO);
      if (response) {
        toast.success("Car added successfully!");
        // Clear form or redirect to car list or another page
        setMake("");
        setModel("");
        setYear("");
        setPricePerDay("");
        setCarType("");
        setLocation("");
        setAvailability("true");
        setImageUrl("");
      }
    } catch (error) {
      toast.error("Failed to add car. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="add-car-container">
      <h2>Add New Car</h2>
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
            placeholder="Enter car year"
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
            placeholder="Enter location"
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
            placeholder="Enter car image URL"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Car"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
