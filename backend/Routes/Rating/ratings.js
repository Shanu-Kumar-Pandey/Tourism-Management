const Bookings = require("../../models/booking")
const { verifyToken } = require("../../middleware/middleware");
const Tour = require("../../models/tour");
const jwt = require('jsonwebtoken');
const Rating = require("../../models/rating");


module.exports = async function (app, db) {



    // app.get('/ended-tours', verifyToken, async (req, res) => {
    //     try {
    //         const userId = req.user.id; // Get user ID from the token
    
    //         console.log('Fetching ended tours for user:', userId); // Log user ID
    
    //         const endedTours = await Tour.find({
    //             returnDate: { $lt: new Date().toISOString() }
    //         }).exec();
    
    //         // Format the ended tours
    //         const formattedEndedTours = endedTours.map((tour) => ({
    //             ...tour._doc,
    //             returnDate: new Date(tour.returnDate).toISOString().split('T')[0] + 
    //                 '(' + new Date(tour.returnDate).toLocaleTimeString('en-GB') + ')',
    //         }));
    
    //         console.log('Ended tours found:', formattedEndedTours.length); // Log the number of ended tours found
    
    //         res.json(formattedEndedTours); 
    //     } catch (error) {
    //         console.error('Error fetching ended tours:', error.message); // Log error message
    //         res.status(500).json({ error: 'Error fetching ended tours' });
    //     }
    // });


    app.get('/ended-tours', verifyToken, async (req, res) => {
        try {
            const userId = req.user.id; 
    
             
    
           
            const bookings = await Bookings.find({ user_id: userId }).populate('tour_id');
    
          
            const bookedTourIds = bookings.map(booking => booking.tour_id._id);
    
           
            const endedTours = await Tour.find({
                _id: { $in: bookedTourIds },
                returnDate: { $lt: new Date().toISOString() } 
            }).exec();
    
            
            const formattedEndedTours = endedTours.map((tour) => ({
                ...tour._doc,
                returnDate: new Date(tour.returnDate).toISOString().split('T')[0] + 
                    '(' + new Date(tour.returnDate).toLocaleTimeString('en-GB') + ')',
            }));
    
           
    
            res.json(formattedEndedTours); 
        } catch (error) {
            console.error('Error fetching ended tours:', error.message); // Log error message
            res.status(500).json({ error: 'Error fetching ended tours' });
        }
    });
    

    // app.get('/tour-ratings/:tour_id', verifyToken, async (req, res) => {
    //     try {
    //         const tourId = req.params.tour_id;
    //         const ratings = await Rating.find({ tour_id: tourId });
    //         res.json(ratings);
    //     } catch (error) {
    //         console.error('Error fetching ratings and reviews:', error);
    //         res.status(500).json({ error: 'Error fetching ratings and reviews' });
    //     }
    // });

    app.get('/tour-ratings/:tour_id', verifyToken, async (req, res) => {
        try {
            const tourId = req.params.tour_id;
            const userId = req.user.id;
    
            
            const userReview = await Rating.findOne({ tour_id: tourId, user_id: userId });
    
            if (userReview) {
                res.json([userReview]);
            } else {
                res.json([]); 
            }
        } catch (error) {
            console.error('Error fetching ratings and reviews:', error);
            res.status(500).json({ error: 'Error fetching ratings and reviews' });
        }
    });



    app.post('/save-rating', verifyToken, async (req, res) => {
        const { tour_id, rating, review } = req.body;
        const user_id = req.user.id; // Retrieved from the token in the middleware
    
        try {
            // Check if a rating by the same user for the same tour already exists
            const existingRating = await Rating.findOne({ tour_id, user_id });
    
            if (existingRating) {
                // If it exists, update the existing record
                existingRating.rating = rating;
                existingRating.review = review;
    
                await existingRating.save(); // Save the updated rating
                res.status(200).json({ message: 'Rating updated successfully' });
            } else {
                // If it doesn't exist, create a new rating
                const newRating = new Rating({
                    tour_id,
                    user_id,
                    rating,
                    review
                });
    
                await newRating.save();
                res.status(200).json({ message: 'Rating saved successfully' });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
 

    app.get('/agent-tours', verifyToken, async (req, res) => {
        try {
            const agentId = req.user.id; 
    
            const agentTours = await Tour.find({ agent_id: agentId });
    
            const tourIds = agentTours.map(tour => tour._id);
            const ratings = await Rating.find({ tour_id: { $in: tourIds } }).populate('user_id', 'name'); 
    
            const toursWithRatings = agentTours
                .map(tour => {
                    const tourRatings = ratings.filter(rating => rating.tour_id.toString() === tour._id.toString());
                    return {
                        ...tour._doc,
                        ratings: tourRatings
                    };
                })
                .filter(tour => tour.ratings.length > 0); 
    
            res.json(toursWithRatings);
        } catch (error) {
            console.error('Error fetching tours or ratings for agent:', error);
            res.status(500).json({ error: 'Error fetching tours or ratings for agent' });
        }
    });

   

    app.get('/admin-reviews', verifyToken, async (req, res) => {
        try {
            const userRole = req.user.role; 
    
            // Only allow access if the user is an admin
            if (userRole !== 'admin') {
                return res.status(403).json({ error: 'Access denied. Admins only.' });
            }
    
            // Fetch all tours
            const allTours = await Tour.find({});
    
            // Fetch all ratings for the tours
            const tourIds = allTours.map(tour => tour._id);
            const ratings = await Rating.find({ tour_id: { $in: tourIds } }).populate('user_id', 'name'); 
    
            // Combine tours with their corresponding ratings
            const toursWithRatings = allTours.map(tour => {
                const tourRatings = ratings.filter(rating => rating.tour_id.toString() === tour._id.toString());
                return {
                    ...tour._doc,
                    ratings: tourRatings
                };
            });
    
            res.json(toursWithRatings); 
        } catch (error) {
            console.error('Error fetching all tours or ratings for admin:', error); 
            res.status(500).json({ error: 'Error fetching all tours or ratings for admin' });
        }
    });
    
    








    
    module.exports = app;

}


