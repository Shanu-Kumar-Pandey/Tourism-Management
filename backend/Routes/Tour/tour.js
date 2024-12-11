const Tour = require("../../models/tour");
const User = require("../../models/user");
const { verifyToken } = require("../../middleware/middleware");

const jwt = require('jsonwebtoken');


module.exports = async function (app, db) {


    app.post('/add-tour', verifyToken, async (req, res) => {
        try {
            const agentId = req.user.id;
            const tourData = { ...req.body, agent_id: agentId, };
            const tour = new Tour(tourData);
            await tour.save(); // Save to the database
            res.status(201).send('Tour successfully added!');
        } catch (error) {
            console.error('Error adding tour:', error);
            res.status(500).json({ message: 'Failed to add tour.', error: error.message }); // Send error message
        }
    });

    app.get('/tour', verifyToken, async (req, res) => {
        try {
           
            const userId = req.user.id;

            
            const tours = await Tour.find({ agent_id: userId });

            res.json(tours);
        } catch (error) {
            console.error('Error fetching tours:', error);
            res.status(500).json({ message: 'Failed to fetch tours.', error: error.message });
        }
    });

    app.delete('/tour/:id', verifyToken, async (req, res) => {
        try {
            // Assuming that the current user ID is stored in req.user.id
            const userId = req.user.id;
            const tourId = req.params.id;

            // Find and delete the tour
            const tour = await Tour.findOneAndDelete({ _id: tourId, agent_id: userId });

            if (!tour) {
                return res.status(404).json({ message: 'Tour not found or not authorized' });
            }

            res.status(200).json({ message: 'Tour successfully deleted' });
        } catch (error) {
            console.error('Error deleting tour:', error);
            res.status(500).json({ message: 'Failed to delete tour.', error: error.message });
        }
    });


    app.get('/tours/:tourId', async (req, res) => {
        try {
            const tour = await Tour.findById(req.params.tourId);
            if (!tour) return res.status(404).json({ message: 'Tour not found' });
            res.json(tour);

        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    });

    app.put('/tours/:tourId', async (req, res) => {
        try {
            const tour = await Tour.findByIdAndUpdate(req.params.tourId, req.body, { new: true });
            if (!tour) return res.status(404).json({ message: 'Tour not found' });
            res.json(tour);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    });

    app.get('/agents/:id', async (req, res) => {
        try {
          const agentId = req.params.id;
      
          const agent = await User.findById(agentId);
          
          if (!agent) {
            console.log('Agent not found');
            return res.status(404).json({ message: 'Agent not found' });
          }
      
          const responseData = {
            name: agent.name,
            email: agent.email,
            phoneNumber: agent.phone,
          };
      
      
          res.json(responseData);
        } catch (error) {
          console.error('Server error:', error);
          res.status(500).json({ message: 'Server error' });
        }
      });




    module.exports = app;

}


