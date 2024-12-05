import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCarExtraById, updateCarExtra } from "../services/CarExtraService"; 
import "./EditCarExtra.css";
import {toast} from "react-toastify";
const EditCarExtra = () => {
  const { id } = useParams(); // Get car extra ID from route params
  const navigate = useNavigate(); // For navigation after editing

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarExtra = async () => {
      try {
        const carExtraData = await getCarExtraById(id); // Fetch car extra data by ID
        setName(carExtraData.name);
        setDescription(carExtraData.description);
        setPrice(carExtraData.price);
      } catch (error) {
        console.error("Error fetching car extra details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarExtra();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedCarExtra = {
      extraId: id,
      name,
      description,
      price,
    };
  
    console.log('Submit triggered'); // Log to see if handleSubmit is called multiple times
  
    try {
      await updateCarExtra(id, updatedCarExtra); // Call update service
      console.log('Update success');
      
      toast.success("Car extra details updated successfully!");
  
      navigate("/carextras"); // Redirect to the car extras list page
    } catch (error) {
      console.error("Error updating car extra:", error);
      
      toast.error("Failed to update car extra. Please try again.", {
        style: {
          backgroundColor: "#f44336", // Red background for error
          color: "white",
          borderRadius: "8px",
          padding: "10px",
        },
      });
    }
  };

  if (loading) {
    return <div>Loading car extra details...</div>;
  }

  return (
    <div className="edit-car-extra">
      <h2>Edit Car Extra Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Car Extra</button>
      </form>
    </div>
  );
};

export default EditCarExtra;
