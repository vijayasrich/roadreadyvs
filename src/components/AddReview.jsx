import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddReview = () => {
    const [selectedCarId, setSelectedCarId] = useState('');
    const [rating, setRating] = useState(1);
    const [reviewText, setReviewText] = useState('');
    const [cars, setCars] = useState([]);
    const navigate = useNavigate();

    // Fetch cars for the dropdown
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get('https://localhost:7020/api/Cars', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // or wherever your token is stored
                    },
                });
                setCars(response.data);
            } catch (error) {
                console.error('Error fetching car list:', error);
                toast.error('Failed to fetch cars. Please try again.');
            }
        };

        fetchCars();
    }, []);

    // Handle review submission
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCarId || !rating || !reviewText) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const reviewData = {
                carId: selectedCarId,
                rating,
                reviewText,
            };

            const response = await axios.post(
                'https://localhost:7020/api/Reviews',
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            toast.success('Review added successfully!');
            navigate('/reviews'); // Navigate to the reviews page after success
        } catch (error) {
            console.error('Error adding review:', error);
            if (error.response) {
                toast.error(`Error: ${error.response.data.message || 'Unable to add review'}`);
            } else {
                toast.error('An error occurred. Please try again later.');
            }
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
                        {cars.map((car) => (
                            <option key={car.carId} value={car.carId}>
                                {car.make} {car.model} (Car ID: {car.carId})
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
