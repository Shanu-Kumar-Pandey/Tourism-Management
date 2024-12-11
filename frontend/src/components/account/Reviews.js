import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Reviews.css';
import ReviewModal from "./ReviewModal";

// Import Material Icons
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const Reviews = () => {
    const [tours, setTours] = useState([]);
    const [ratings, setRatings] = useState({});
    const [selectedTour, setSelectedTour] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Retrieve user role from local storage
    const user = JSON.parse(localStorage.getItem('user')); 
    const userRole = user?.role || ''; 

    useEffect(() => {
        const fetchEndedTours = async () => {
            try {
                const token = Cookies.get('token');
                let response;

                // If the user is an admin, fetch all reviews from the new API
                if (userRole === 'admin') {
                    response = await axios.get('http://localhost:5000/admin-reviews', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }

                // If the user is a tourist, fetch ended tours they've booked
                if (userRole === 'tourist') {
                    response = await axios.get('http://localhost:5000/ended-tours', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }

                // If the user is an agent, fetch tours created by the agent
                if (userRole === 'agent') {
                    response = await axios.get('http://localhost:5000/agent-tours', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }

                setTours(response.data); // Set the tours or reviews, depending on the role
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Fetch tours or reviews based on the user role
        if (userRole === 'tourist' || userRole === 'agent' || userRole === 'admin') {
            fetchEndedTours();
        }
    }, [userRole]);

    const fetchTourRatings = async () => {
        try {
            const token = Cookies.get('token');
            const ratingPromises = tours.map(async (tour) => {
                const response = await axios.get(`http://localhost:5000/tour-ratings/${tour._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return { tourId: tour._id, ratings: response.data };
            });

            const ratingsData = await Promise.all(ratingPromises);
            const ratingsMap = {};
            ratingsData.forEach((data) => {
                ratingsMap[data.tourId] = data.ratings;
            });
            setRatings(ratingsMap);
        } catch (error) {
            console.error('Error fetching ratings and reviews:', error);
        }
    };

    useEffect(() => {
        if (tours.length > 0) {
            fetchTourRatings(); // Fetch ratings after tours or reviews are fetched
        }
    }, [tours]);

    const handleTourClick = (tour) => {
        setSelectedTour(tour);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedTour(null);
    };

    const refreshReviews = () => {
        fetchTourRatings(); 
    };

    const truncateText = (text, maxLength) => {
        return text && text.length > maxLength ? `${text.slice(0, maxLength)}..` : text;
    };

    const renderStars = (rating) => {
        const maxStars = 5;
        const stars = [];
        for (let i = 0; i < maxStars; i++) {
            if (i < rating) {
                stars.push(<StarIcon key={i} style={{ color: '#FFD700' }} />);
            } else {
                stars.push(<StarBorderIcon key={i} style={{ color: '#C0C0C0' }} />);
            }
        }
        return stars;
    };



    // Conditionally render based on the user's role
    if (userRole === 'agent') {
        return (
            <div className="reviews">
                <h2>Ratings and Reviews </h2>
                <table className="reviews-table">
                    <thead>
                        <tr>
                            <th>Package Name</th>
                            <th>Tour Date</th>
                            <th>Destination Title</th>
                            <th>Rating</th>
                            <th>Review</th>
                            <th>Tourist Name</th> {/* Column for tourist name */}
                        </tr>
                    </thead>
                    <tbody>
                        {tours.map((tour) => (
                            tour.ratings.map((rating, index) => ( // Map over ratings to show all
                                <tr key={tour._id + '-' + index}> {/* Ensure unique keys for each rating */}
                                    <td>{tour.packageName}</td>
                                    <td>{tour.departureDate} - {tour.returnDate}</td>
                                    <td>{tour.destinationTitle}</td>
                                    <td>{renderStars(rating.rating)}</td> {/* Render stars for each rating */}
                                    <td>{truncateText(rating.review, 50)}</td> {/* Show the review */}
                                    <td>{rating.user_id.name}</td> {/* Display tourist's name */}
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (userRole === 'tourist') {
        return (
            <div className="reviews">
                <h2>Your Reviews</h2>
                <table className="reviews-table">
                    <thead>
                        <tr>
                            <th>Package Name</th>
                            <th>Tour Date</th>
                            <th>Destination Title</th>
                            <th>Rating</th>
                            <th>Review</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tours.map((tour) => (
                            <tr key={tour._id} onClick={() => handleTourClick(tour)}>
                                <td>{tour.packageName}</td>
                                <td>{tour.departureDate} - {tour.returnDate}</td>
                                <td>{tour.destinationTitle}</td>
                                <td>
                                    {ratings[tour._id] && ratings[tour._id][0]?.rating
                                        ? renderStars(ratings[tour._id][0].rating)
                                        : renderStars(0)}
                                </td>
                                <td>{truncateText(ratings[tour._id] && ratings[tour._id][0]?.review || 'N/A', 50)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {modalOpen && selectedTour && (
                    <ReviewModal tour={selectedTour} onClose={handleModalClose} refreshReviews={refreshReviews} />
                )}
            </div>
        );
    }

    if (userRole === 'admin') {
        return ( 
        <div className="reviews">
            <h2>Ratings and Reviews </h2>
            <table className="reviews-table">
                <thead>
                    <tr>
                        <th>Package Name</th>
                        <th>Tour Date</th>
                        <th>Destination Title</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>Tourist Name</th> {/* Column for tourist name */}
                    </tr>
                </thead>
                <tbody>
                    {tours.map((tour) => (
                        tour.ratings.map((rating, index) => ( // Map over ratings to show all
                            <tr key={tour._id + '-' + index}> {/* Ensure unique keys for each rating */}
                                <td>{tour.packageName}</td>
                                <td>{tour.departureDate} - {tour.returnDate}</td>
                                <td>{tour.destinationTitle}</td>
                                <td>{renderStars(rating.rating)}</td> {/* Render stars for each rating */}
                                <td>{truncateText(rating.review, 50)}</td> {/* Show the review */}
                                <td>{rating.user_id.name}</td> {/* Display tourist's name */}
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>
        </div>
    );
    }

    return null; 

};

export default Reviews;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import './Reviews.css';
// import ReviewModal from "./ReviewModal";

// // Import Material Icons
// import StarIcon from '@mui/icons-material/Star';
// import StarBorderIcon from '@mui/icons-material/StarBorder';

// const Reviews = () => {
//     const [tours, setTours] = useState([]);
//     const [ratings, setRatings] = useState({});
//     const [selectedTour, setSelectedTour] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);

//     // Retrieve user role from local storage
//     const user = JSON.parse(localStorage.getItem('user')); // Assuming 'user' contains the role
//     const userRole = user?.role || ''; // Get the role from the user object, or empty string if not available

//     useEffect(() => {
//         const fetchEndedTours = async () => {
//             try {
//                 const token = Cookies.get('token');
//                 let response;

//                 // If the user is a tourist, fetch ended tours they've booked
//                 if (userRole === 'tourist') {
//                     response = await axios.get('http://localhost:5000/ended-tours', {
//                         headers: { Authorization: `Bearer ${token}` }
//                     });
//                 }

//                 // If the user is an agent, fetch tours created by the agent
//                 if (userRole === 'agent') {
//                     response = await axios.get('http://localhost:5000/agent-tours', {
//                         headers: { Authorization: `Bearer ${token}` }
//                     });
//                 }
    
//                 setTours(response.data); // Set the tours, which now also includes their ratings
//             } catch (error) {
//                 console.error('Error fetching ended tours:', error);
//             }
//         };

//         // Fetch tours only if user is a tourist or agent
//         if (userRole === 'tourist' || userRole === 'agent') {
//             fetchEndedTours();
//         }
//     }, [userRole]);

//     const fetchTourRatings = async () => {
//         try {
//             const token = Cookies.get('token');
//             const ratingPromises = tours.map(async (tour) => {
//                 const response = await axios.get(`http://localhost:5000/tour-ratings/${tour._id}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 return { tourId: tour._id, ratings: response.data };
//             });

//             const ratingsData = await Promise.all(ratingPromises);
//             const ratingsMap = {};
//             ratingsData.forEach((data) => {
//                 ratingsMap[data.tourId] = data.ratings;
//             });
//             setRatings(ratingsMap);
//         } catch (error) {
//             console.error('Error fetching ratings and reviews:', error);
//         }
//     };

//     useEffect(() => {
//         if (tours.length > 0) {
//             fetchTourRatings(); // Fetch ratings after tours are fetched
//         }
//     }, [tours]);

//     const handleTourClick = (tour) => {
//         setSelectedTour(tour);
//         setModalOpen(true);
//     };

//     const handleModalClose = () => {
//         setModalOpen(false);
//         setSelectedTour(null);
//     };

//     // Refresh reviews when the modal closes
//     const refreshReviews = () => {
//         fetchTourRatings(); // Refresh the reviews by refetching the ratings
//     };

//     const truncateText = (text, maxLength) => {
//         return text && text.length > maxLength ? `${text.slice(0, maxLength)}..` : text;
//     };

//     const renderStars = (rating) => {
//         const maxStars = 5;
//         const stars = [];
//         for (let i = 0; i < maxStars; i++) {
//             if (i < rating) {
//                 stars.push(<StarIcon key={i} style={{ color: '#FFD700' }} />); // Filled star
//             } else {
//                 stars.push(<StarBorderIcon key={i} style={{ color: '#C0C0C0' }} />); // Hollow star
//             }
//         }
//         return stars;
//     };

//     // Conditionally render based on the user's role
//     if (userRole === 'agent') {
//         return (
//             <div className="reviews">
//                 <h2>Ratings and Reviews </h2>
//                 <table className="reviews-table">
//                     <thead>
//                         <tr>
//                             <th>Package Name</th>
//                             <th>Tour Date</th>
//                             <th>Destination Title</th>
//                             <th>Rating</th>
//                             <th>Review</th>
//                             <th>Tourist Name</th> {/* Column for tourist name */}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {tours.map((tour) => (
//                             tour.ratings.map((rating, index) => ( // Map over ratings to show all
//                                 <tr key={tour._id + '-' + index}> {/* Ensure unique keys for each rating */}
//                                     <td>{tour.packageName}</td>
//                                     <td>{tour.departureDate} - {tour.returnDate}</td>
//                                     <td>{tour.destinationTitle}</td>
//                                     <td>{renderStars(rating.rating)}</td> {/* Render stars for each rating */}
//                                     <td>{truncateText(rating.review, 50)}</td> {/* Show the review */}
//                                     <td>{rating.user_id.name}</td> {/* Display tourist's name */}
//                                 </tr>
//                             ))
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         );
//     }

//     if (userRole === 'tourist') {
//         return (
//             <div className="reviews">
//                 <h2>Your Reviews</h2>
//                 <table className="reviews-table">
//                     <thead>
//                         <tr>
//                             <th>Package Name</th>
//                             <th>Tour Date</th>
//                             <th>Destination Title</th>
//                             <th>Rating</th>
//                             <th>Review</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {tours.map((tour) => (
//                             <tr key={tour._id} onClick={() => handleTourClick(tour)}>
//                                 <td>{tour.packageName}</td>
//                                 <td>{tour.departureDate} - {tour.returnDate}</td>
//                                 <td>{tour.destinationTitle}</td>
//                                 <td>
//                                     {ratings[tour._id] && ratings[tour._id][0]?.rating
//                                         ? renderStars(ratings[tour._id][0].rating)
//                                         : renderStars(0)}
//                                 </td>
//                                 <td>{truncateText(ratings[tour._id] && ratings[tour._id][0]?.review || 'N/A', 50)}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 {modalOpen && selectedTour && (
//                     <ReviewModal tour={selectedTour} onClose={handleModalClose} refreshReviews={refreshReviews} />
//                 )}
//             </div>
//         );
//     }

//     return null; // Handle other roles if necessary
// };

// export default Reviews;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import './Reviews.css';
// import ReviewModal from "./ReviewModal";

// // Import Material Icons
// import StarIcon from '@mui/icons-material/Star';
// import StarBorderIcon from '@mui/icons-material/StarBorder';

// const Reviews = () => {
//     const [tours, setTours] = useState([]);
//     const [ratings, setRatings] = useState({});
//     const [selectedTour, setSelectedTour] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);

//     // Retrieve user role from local storage
//     const user = JSON.parse(localStorage.getItem('user')); // Assuming 'user' contains the role
//     const userRole = user?.role || ''; // Get the role from the user object, or empty string if not available

//     useEffect(() => {
//         const fetchEndedTours = async () => {
//             try {
//                 const token = Cookies.get('token');
//                 const response = await axios.get('http://localhost:5000/ended-tours', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setTours(response.data);
//             } catch (error) {
//                 console.error('Error fetching ended tours:', error);
//             }
//         };

//         // Fetch tours only if user is a tourist
//         if (userRole === 'tourist') {
//             fetchEndedTours();
//         }
//     }, [userRole]);

//     const fetchTourRatings = async () => {
//         try {
//             const token = Cookies.get('token');
//             const ratingPromises = tours.map(async (tour) => {
//                 const response = await axios.get(`http://localhost:5000/tour-ratings/${tour._id}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 return { tourId: tour._id, ratings: response.data };
//             });

//             const ratingsData = await Promise.all(ratingPromises);
//             const ratingsMap = {};
//             ratingsData.forEach((data) => {
//                 ratingsMap[data.tourId] = data.ratings;
//             });
//             setRatings(ratingsMap);
//         } catch (error) {
//             console.error('Error fetching ratings and reviews:', error);
//         }
//     };

//     useEffect(() => {
//         if (tours.length > 0) {
//             fetchTourRatings(); // Fetch ratings after tours are fetched
//         }
//     }, [tours]);

//     const handleTourClick = (tour) => {
//         setSelectedTour(tour);
//         setModalOpen(true);
//     };

//     const handleModalClose = () => {
//         setModalOpen(false);
//         setSelectedTour(null);
//     };

//     // Refresh reviews when the modal closes
//     const refreshReviews = () => {
//         fetchTourRatings(); // Refresh the reviews by refetching the ratings
//     };

//     const truncateText = (text, maxLength) => {
//         return text && text.length > maxLength ? `${text.slice(0, maxLength)}..` : text;
//     };

//     const renderStars = (rating) => {
//         const maxStars = 5;
//         const stars = [];
//         for (let i = 0; i < maxStars; i++) {
//             if (i < rating) {
//                 stars.push(<StarIcon key={i} style={{ color: '#FFD700' }} />); // Filled star
//             } else {
//                 stars.push(<StarBorderIcon key={i} style={{ color: '#C0C0C0' }} />); // Hollow star
//             }
//         }
//         return stars;
//     };

//     // Conditionally render based on the user's role
//     if (userRole !== 'tourist') {
//         return <div>Hello {userRole}</div>; // Show "Hello [role]" if the user is not a tourist
//     }

//     return (
//         <div className="reviews">
//             <h2>Reviews</h2>
//             <table className="reviews-table">
//                 <thead>
//                     <tr>
//                         <th>Package Name</th>
//                         <th>Tour Date</th>
//                         <th>Destination Title</th>
//                         <th>Rating</th>
//                         <th>Review</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {tours.map((tour) => (
//                         <tr key={tour._id} onClick={() => handleTourClick(tour)}>
//                             <td>{tour.packageName}</td>
//                             <td>{tour.departureDate} - {tour.returnDate}</td>
//                             <td>{tour.destinationTitle}</td>
//                             <td>
//                                 {ratings[tour._id] && ratings[tour._id][0]?.rating
//                                     ? renderStars(ratings[tour._id][0].rating)
//                                     : renderStars(0)}
//                             </td>
//                             <td>{truncateText(ratings[tour._id] && ratings[tour._id][0]?.review || 'N/A', 50)}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {modalOpen && selectedTour && (
//                 <ReviewModal tour={selectedTour} onClose={handleModalClose} refreshReviews={refreshReviews} />
//             )}
//         </div>
//     );
// };

// export default Reviews;
