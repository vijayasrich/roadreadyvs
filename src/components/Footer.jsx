import React from "react";
import "./Footer.css";
import "../App.css"

const Footer = () => {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} RoadReady</p>
    </footer>
  );
};

export default Footer;