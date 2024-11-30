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
            <li>
              <Link to="/login">Login</Link>
            </li>
            
          ) : (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
            <li>
                <Link to="/reset-password">Reset Password</Link>
            </li>
          
          <li>
            <Link to="/register">Register</Link>
          </li>
          {auth && (
            <>
              <li>
                <Link to="/carextras">Car Extras</Link>
              </li>
              <li>
                <Link to="/cars">Cars</Link>
              </li>
              {/* Render User List link only if the user is an admin */}
              
              <li>
                <Link to="/users">Users</Link>
              </li>
              <li>
                <Link to="/reviews">Reviews</Link>
              </li>
              <li>
                <Link to="/reservations">Reservations</Link>
              </li>
              <li>
                <Link to="/payments">Payment</Link>
              </li>
              
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;