


const Bookings = require("../../models/booking")
const { verifyToken } = require("../../middleware/middleware");
const Tour = require("../../models/tour");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const otps = {};

module.exports = async function (app, db) {


    // app.get('/all-tours', async (req, res) => {
    //     try {
    //         const tours = await Tour.find();
    //         res.json(tours);

    //     } catch (error) {
    //         console.error('Error fetching all tours:', error);
    //         res.status(500).json({ message: 'Failed to fetch tours.', error: error.message });
    //     }
    // });
    
    app.get('/all-tours', async (req, res) => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
        
            console.log("Today's date for comparison (start of the day):", today.toISOString());
        
            const tours = await Tour.find({
                $expr: {
                    $gte: [
                        { $dateFromString: { dateString: "$departureDate" } },
                        today
                    ]
                }
            });
    
            console.log('Number of tours fetched:', tours.length);
            res.json(tours);
        } catch (error) {
            console.error('Error fetching all tours:', error);
            res.status(500).json({ message: 'Failed to fetch tours.', error: error.message });
        }
    });

    app.post('/book-tour', async (req, res) => {
        const bookingData = req.body;

        try {
            const newBooking = new Bookings(bookingData);
            await newBooking.save();
            res.status(201).send({ message: 'Booking created successfully' });
        } catch (error) {
            res.status(400).send({ error: 'Error creating booking' });
        }
    });



    app.get('/bookingdata', verifyToken, async (req, res) => {
        try {
            const userId = req.user.id;


            const bookings = await Bookings.find({ user_id: userId })
                .populate('tour_id', 'packageName')
                .exec();

            const formattedBookings = bookings.map((booking) => ({
                ...booking._doc,
                bookingDate: new Date(booking.bookingDate).toISOString().split('T')[0] +
                    '(' + new Date(booking.bookingDate).toLocaleTimeString('en-GB') + ')',
                packageName: booking.tour_id.packageName,
            }));

            res.json(formattedBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ error: 'Error fetching bookings' });
        }
    });


    app.get('/agent-bookings', verifyToken, async (req, res) => {
        try {
            const agentId = req.user.id;

            const tours = await Tour.find({ agent_id: agentId }).select('_id');
            const tourIds = tours.map(tour => tour._id);

            const bookings = await Bookings.find({ tour_id: { $in: tourIds } })
                .populate('tour_id', 'packageName')
                .exec();

            const formattedBookings = bookings.map((booking) => ({
                ...booking._doc,
                bookingDate: new Date(booking.bookingDate).toISOString().split('T')[0] +
                    '(' + new Date(booking.bookingDate).toLocaleTimeString('en-GB') + ')',
                packageName: booking.tour_id.packageName,
            }));

            res.json(formattedBookings);
        } catch (error) {
            console.error("Error fetching agent's bookings:", error);
            res.status(500).json({ error: "Error fetching agent's bookings" });
        }
    });


    app.get('/admin-bookings', verifyToken, async (req, res) => {
        try {

            const userRole = req.user.role;
            console.log("User Role:", userRole);

            if (userRole !== 'admin') {
                console.log('Access denied. Not an admin.');
                return res.status(403).json({ error: 'Access denied. Admins only.' });
            }


            const bookings = await Bookings.find()
                .populate('tour_id', 'packageName') // Populate the tour details
                .exec();



            const formattedBookings = bookings.map((booking) => ({
                ...booking._doc,
                bookingDate: new Date(booking.bookingDate).toISOString().split('T')[0] +
                    '(' + new Date(booking.bookingDate).toLocaleTimeString('en-GB') + ')',
                packageName: booking.tour_id.packageName,
            }));



            res.json(formattedBookings);
        } catch (error) {
            console.error('Error fetching all bookings:', error);
            res.status(500).json({ error: 'Error fetching bookings' });
        }
    });


    app.post('/send-otp', async (req, res) => {
        const { email, customerName, tripPackageName, numberOfPersons, totalPrice, cardLast4 } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

        // Store OTP with 5 minutes expiration
        otps[email] = { otp, expiresAt: Date.now() + 300000 };

        // Load the HTML template
        const templatePath = path.join(__dirname, 'emailTemplates', 'booking_otp.html');
        fs.readFile(templatePath, 'utf8', (err, htmlTemplate) => {
            if (err) {
                console.error('Error reading HTML template:', err);
                return res.status(500).json({ status: false, msg: 'Server error' });
            }

            // Replace placeholders in the template with actual values
            const emailHtml = htmlTemplate
                .replace('{{otp}}', otp)
                .replace('{{customerName}}', customerName)
                .replace('{{tripPackageName}}', tripPackageName)
                .replace('{{numberOfPersons}}', numberOfPersons)
                .replace('{{totalPrice}}', totalPrice)
                .replace('{{cardLast4}}', cardLast4);




            // Configure the email transporter
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'projectljtourism@gmail.com',
                    pass: 'enter your app password', 
                },
            });

            // Define email options
            const mailOptions = {
                to: email,
                from: 'projectljtourism@gmail.com',
                subject: 'Your Booking OTP',
                html: emailHtml,
            };

            // Send the email
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('Error while sending email:', err);
                    return res.status(500).json({ status: false, msg: 'Error sending OTP' });
                }
                res.json({ status: true, msg: 'OTP sent successfully' });
            });
        });
    });

    app.post('/verify-otp', (req, res) => {
        const { email, otp } = req.body;
        const storedOtpData = otps[email];

        // Check if OTP exists and is valid
        if (!storedOtpData) {
            return res.status(400).json({ status: false, msg: 'OTP expired or invalid' });
        }

        if (storedOtpData.otp === otp && storedOtpData.expiresAt > Date.now()) {
            // Clear OTP after successful verification
            delete otps[email];
            res.json({ status: true, msg: 'OTP verified successfully' });
        } else {
            res.status(400).json({ status: false, msg: 'Invalid or expired OTP' });
        }
    });

    app.get('/get-package-name/:tourId', async (req, res) => {
        const { tourId } = req.params;

        try {
            // Find the tour with the given tourId
            const tour = await Tour.findById(tourId);

            if (!tour) {
                return res.status(404).json({ status: false, msg: 'Tour not found' });
            }

            // Respond with the package_name of the tour
            res.json({ status: true, package_name: tour.packageName });

        } catch (error) {
            console.error('Error fetching package name:', error);
            res.status(500).json({ status: false, msg: 'Server error' });
        }
    });


    module.exports = app;

}


