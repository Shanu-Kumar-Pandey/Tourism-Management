import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './ReviewModal.css';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const ReviewModal = ({ tour, onClose, refreshReviews }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');

    useEffect(() => {
        const fetchRatingReview = async () => {
            const token = Cookies.get('token');
            try {
                const response = await axios.get(`http://localhost:5000/tour-ratings/${tour._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.length > 0) {
                    const existingRating = response.data[0];
                    setRating(existingRating.rating);
                    setReview(existingRating.review);
                }
            } catch (error) {
                console.error('Error fetching rating and review:', error);
            }
        };

        fetchRatingReview();
    }, [tour]);

    const handleSave = async () => {
        const token = Cookies.get('token');
        try {
            const response = await axios.post('http://localhost:5000/save-rating', {
                tour_id: tour._id,
                rating,
                review,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                refreshReviews(); // Refresh the reviews after saving
                onClose(); // Close the modal
            }
        } catch (error) {
            console.error('Error saving rating:', error);
            alert('Failed to save rating');
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} onClick={() => setRating(i)} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                    {i <= rating ? (
                        <StarIcon style={{ color: '#FFD700', transform: `scale(${i <= rating ? 1.2 : 1})` }} />
                    ) : (
                        <StarBorderIcon style={{ color: '#C0C0C0', transform: `scale(${i <= rating ? 1.2 : 1})` }} />
                    )}
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <div className="tour-image">
                    <img src={tour.coverImage} alt={tour.packageName} />
                </div>
                <div className="rating-section">
                    <div className="stars-container">
                     
                        {renderStars()}
                    </div>
                </div>
                <div className="review-section">
                    <textarea
                        placeholder="Write your review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                </div>
                <button onClick={handleSave} className="save-button">Save Rating</button>
            </div>
        </div>
    );
};

export default ReviewModal;
