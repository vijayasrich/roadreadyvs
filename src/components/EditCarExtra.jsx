import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getCarExtraById, updateCarExtra } from "../services/CarExtraService"; 
import "./EditCarExtra.css"; 

const EditCarExtra = () => {
  const [carExtra, setCarExtra] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get the car extra ID from the URL
  const navigate = useNavigate();

  // Fetch the car extra details by ID when the component mounts
  useEffect(() => {
    const fetchCarExtra = async () => {
      try {
        const data = await getCarExtraById(id); // Fetch car extra details from the API
        setCarExtra(data); // Set the car extra details to state
      } catch (err) {
        setError("Failed to load car extra details");
        toast.error("Failed to load car extra details");
      } finally {
        setLoading(false);
      }
    };

    fetchCarExtra();
  }, [id]);

  // Handle form submission to update the car extra
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        ...carExtra,
        price: parseFloat(carExtra.price), // Ensure price is a number
      };
      await updateCarExtra(id, updatedData); // Call the update service
      /*toast.success("Car extra updated successfully!");*/
      
      navigate("/carextras"); // Redirect to the car extras list after successful update
    } catch (error) {
      console.error("Failed to update car extra:", error);
      toast.error("Failed to update car extra. Please try again.");
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarExtra({
      ...carExtra,
      [name]: value,
    });
  };

  return (
    <div className="edit-car-extra-container">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <form onSubmit={handleSubmit} className="edit-car-extra-form">
          <h2>Edit Car Extra</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={carExtra.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={carExtra.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={carExtra.price}
              onChange={handleChange}
              required
              step="0.01"
            />
          </div>

          <button type="submit" className="submit-button">
            Update Car Extra
          </button>
        </form>
      )}
    </div>
  );
};

export default EditCarExtra;
