import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { getAllCarExtras, deleteCarExtra } from "../services/CarExtraService"; // Import the necessary service
import "./CarExtraList.css"; 
import ClipLoader from "react-spinners/ClipLoader"; // To show a loading spinner
import { useNavigate } from "react-router-dom"; // For navigation
import AuthContext from "../utils/AuthContext"; 

const CarExtraList = () => {
    const [carExtras, setCarExtras] = useState([]);
    const [loading, setLoading] = useState(true); // To manage loading state
    const { userRole } = useContext(AuthContext); // Accessing the userRole from AuthContext
    const navigate = useNavigate();
  
    // Fetch car extras on component mount
    useEffect(() => {
      const fetchCarExtras = async () => {
        try {
          const data = await getAllCarExtras(); // Fetch car extras from the service
          setCarExtras(data); // Set the car extras to state
        } catch (error) {
          console.error("Failed to fetch car extras:", error);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      };
  
      fetchCarExtras(); // Call the fetch function when the component mounts
    }, []);
  
    const handleAddCarExtraClick = () => {
      navigate("/add-carextra");
    };

    const handleEditCarExtra = (extraId) => {
      navigate(`/edit-carextra/${extraId}`);
    };
    

    const handleDeleteCarExtra = async (extraId) => {
      try {
        const confirmation = window.confirm("Are you sure you want to delete this Car Extra?");
        if (confirmation) {
          await deleteCarExtra(extraId); // Call the service to delete the Car Extra
          setCarExtras(carExtras.filter(carExtra => carExtra.extraId !== extraId)); // Remove the deleted car extra from state
          /*toast.success("Car extra deleted successfully!");*/
        }
      } catch (error) {
        console.error("Error deleting car extra:", error);
        toast.error("Failed to delete car extra. Please try again.");
      }
    };

    return (
      <div className="car-extra-list">
        {loading ? (
          <ClipLoader size={50} color="#000000" /> // Show loading spinner while fetching data
        ) : carExtras.length > 0 ? (
          carExtras.map((carExtra) => (
            <div className="car-extra-card" key={carExtra.extraId}>
              <h2>{carExtra.name}</h2>
              <p>{carExtra.description}</p>
              <p>Price: ${carExtra.price}</p>
              <p>Extra ID: {carExtra.extraId}</p> 

              {/* Edit and Delete buttons for Admin */}
              {userRole === "Admin" && (
                <div className="car-extra-actions">
                  <button onClick={() => handleEditCarExtra(carExtra.extraId)}>Edit</button>
                  <button className="delete-car-extra-btn" onClick={() => handleDeleteCarExtra(carExtra.extraId)}>Delete</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No car extras available at the moment.</p>
        )}
        {userRole === "Admin" && (
          <button onClick={handleAddCarExtraClick}>Add CarExtra</button>
        )}
      </div>
    );
};

export default CarExtraList;
