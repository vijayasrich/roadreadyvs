import React from 'react';
import './Home.css';
import logo from '../images/logo.png';  // Import the logo

const Home = () => {
  return (
    <div className="home-page">
      <img src={logo} alt="Logo" className="logo" /> {/* Logo image */}
      <div className="main-content">
        <h1>Welcome to RoadReady</h1>
        <p>Your trusted platform for renting cars, making reservations, and managing your bookings. Start your journey with us today!</p>
      </div>
    </div>
  );
};

export default Home;
