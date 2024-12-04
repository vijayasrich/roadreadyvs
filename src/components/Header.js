import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../utils/AuthContext"; // Importing the AuthContext
import "./Header.css";

const Header = () => {
  const { auth, logout, userRole } = useContext(AuthContext); // Access userRole from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Calls the logout function from AuthContext
    localStorage.setItem("token", ""); // Clears the token from localStorage
    navigate("/login"); // Navigates to login page after logout
  };

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {!auth ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}

          {auth && (
            <>
              <li>
                <Link to="/cars">Cars</Link>
              </li>
              <li>
                <Link to="/carextras">Car Extras</Link>
              </li>
              
              {/* Conditionally render "Booking" link only for Customer role */}
              {userRole === "Customer" && (
                
                <li>
                  <Link to="/add-reservation">Book</Link>
                </li>
                
                
              )}
              <li>
                <Link to="/reviews">Reviews</Link>
              </li>
              <li>
                <Link to="/reservations">Reservation History</Link>
              </li>
              <li>
                <Link to="/payments">Payment History</Link>
              </li>
              <li>
                <Link to="/users">User Details</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
