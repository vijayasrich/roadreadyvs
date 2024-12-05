import React from 'react';
import './Home.css';
import logo from '../images/logo.png';  

const Home = () => {
  return (
    <div className="home-page">
      <img src={logo} alt="Logo" className="logo" /> 
      <div className="main-content">
        <h1>Welcome to RoadReady</h1>
        <p>Your trusted platform for renting cars, making reservations, and managing your bookings. Start your journey with us today!</p>
        <p>Have a safe travel with us!</p>
      </div>
    </div>
  );
};

export default Home;
