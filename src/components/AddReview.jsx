import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddReview = () => {
    const [cars, setCars] = useState([]);
    const [selectedCarId, setSelectedCarId] = useState('');
    const [rating, setRating] = useState(1);
    const [reviewText, setReviewText] = useState('');
    const [userId, setUserId] = useState(null);

    // Fetch reservations for the logged-in user
    useEffect(() => {
        const fetchUserReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUserId(decodedToken.userId);

                // Fetch all reservations for the logged-in user
                const response = await axios.get(`https://localhost:7020/api/Reservations/all/${decodedToken.userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Filter completed reservations
                const completedReservations = response.data.completedReservations;
                const completedCars = completedReservations.map((reservation) => reservation.carId);
                setCars(completedCars); // Assuming carId is available in the reservation
            } catch (error) {
                console.error('Error fetching reservations:', error);
                toast.error('Failed to fetch completed reservations.');
            }
        };

        fetchUserReservations();
    }, []);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCarId || !rating || !reviewText) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const reviewData = { userId, carId: selectedCarId, rating, reviewText };
            await axios.post('https://localhost:7020/api/Reviews/addReview', reviewData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success('Review added successfully!');
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error('Failed to add review. Please try again.');
        }
    };

    return (
        <div className="add-review-container">
            <h2>Add Review</h2>
            <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                    <label htmlFor="car">Select Car:</label>
                    <select
                        id="car"
                        value={selectedCarId}
                        onChange={(e) => setSelectedCarId(e.target.value)}
                        required
                    >
                        <option value="">Select a car</option>
                        {cars.map((carId) => (
                            <option key={carId} value={carId}>
                                Car ID: {carId}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="rating">Rating:</label>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    >
                        {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                                {star}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="reviewText">Review:</label>
                    <textarea
                        id="reviewText"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                        placeholder="Write your review here"
                    />
                </div>

                <button type="submit" className="submit-button">
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default AddReview;
