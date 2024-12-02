import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../utils/AuthContext";
import "./Header.css";

const Header = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.setItem("token", "");
    navigate("/login");
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
          {/*<li>
            <Link to="/reset-password">Reset Password</Link>
          </li>*/}

          {auth && (
            <>
              <li>
                <Link to="/carextras">Car Extras</Link>
              </li>
              <li>
                <Link to="/cars">Cars</Link>
              </li>
              
              <li>
                <Link to="/reviews">Reviews</Link>
              </li>
              <li>
                <Link to="/add-reservation">Booking</Link>
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
