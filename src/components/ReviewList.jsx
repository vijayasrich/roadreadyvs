import React, { useEffect, useState } from "react";
import { getReviews } from "../services/ReviewService"; // Importing the service
import { useNavigate } from "react-router-dom"; // For navigation
import "./ReviewList.css"; // Importing the CSS file

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch reviews on component mount
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getReviews();
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleAddReviewClick = () => {
    // Redirect to the "Add Review" page
    navigate("/add-review");
  };

  return (
    <div className="review-list">
      <h2>Car Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.carId}>
            <h3>Car ID: {review.carId}</h3>
            <p>Rating: {review.rating}</p>
            <p>{review.reviewText}</p>
          </li>
        ))}
      </ul>

      <button onClick={handleAddReviewClick}>Add Review</button>
    </div>
  );
};

export default ReviewList;
