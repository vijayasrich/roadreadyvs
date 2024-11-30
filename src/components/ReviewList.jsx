import React, { useEffect, useState } from "react";
import { getReviews, addReview } from "../services/ReviewService"; // Importing the service
import "./ReviewList.css"; // Importing the CSS file

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    carId: "",
    rating: "",
    comment: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const addedReview = await addReview(newReview);
      setReviews((prevReviews) => [...prevReviews, addedReview]);
      setNewReview({
        carId: "",
        rating: "",
        comment: "",
      });
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div className="review-list">
      <h2>Car Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.carId}>
            {/* Only show carId, rating, and reviewText */}
            <h3>Car ID: {review.carId}</h3>
            <p>Rating: {review.rating}</p>
            <p>{review.reviewText}</p>
          </li>
        ))}
      </ul>

      <h3>Add a Review</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Car ID"
          value={newReview.carId}
          onChange={(e) =>
            setNewReview({ ...newReview, carId: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Rating (0-5)"
          min="0"
          max="5"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({ ...newReview, rating: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Comment"
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          required
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewList;
