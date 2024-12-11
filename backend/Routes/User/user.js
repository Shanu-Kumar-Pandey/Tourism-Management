const User = require("../../models/user");
const { verifyToken } = require("../../middleware/middleware");

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const resetPasswordSecret = 'your_jwt_reset_password_secret_key'; 
module.exports = async function (app, db) {




    app.post('/register', async (req, res) => {
        try {
            const { name, email, password, role, phone } = req.body;

            // Check if the user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ status: false, msg: 'User already exists' });
            }

            const newUser = new User({ name, email, password, role, phone });
            await newUser.save();
            return res.status(201).json({ status: true, msg: 'User registered successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: false, msg: error.message });
        }
    });

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            // Find user by email
            const user = await User.findOne({ email });
            if (!user || user.password !== password) {
                return res.status(401).json({ status: false, msg: 'Invalid email or password' });
            }
    
            // Check if the user account is deactivated
            if (user.status === 'deactive') {
                return res.status(403).json({ status: false, msg: 'Account blocked. Please contact the admin.' });
            }
    
            // Create JWT token
            const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, "My_secreat", { expiresIn: '28d' });
    
            // Send token and user details
            res.json({
                status: true,
                token,
                user: {
                    profile_img: user.profile_img,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    address: user.address,
                    dob: user.dob
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, msg: 'Server error' });
        }
    });


    // app.post('/login', async (req, res) => {
    //     const { email, password } = req.body;
    //     try {
    //         // Find user by email
    //         const user = await User.findOne({ email });
    //         if (!user || user.password !== password) {
    //             return res.status(401).json({ status: false, msg: 'Invalid email or password' });
    //         }

    //         // Create JWT token
    //         const token = jwt.sign({ id: user._id, email: user.email, name: user.name ,role: user.role}, "My_secreat", { expiresIn: '28d' });

    //         // Send token and user details
    //         res.json({
    //             status: true,
    //             token,
    //             user: {
    //                 profile_img:user.profile_img,
    //                 name: user.name,
    //                 email: user.email,
    //                 phone: user.phone,
    //                 role: user.role,
    //                 address:user.address,
    //                 dob:user.dob

    //             }
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ status: false, msg: 'Server error' });
    //     }
    // });



    app.post('/updateProfile', verifyToken, async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.json({ status: false, msg: 'User not found' });
            }
            
            Object.assign(user, req.body);
            await user.save();
            
            return res.json({ status: true, data: user });
        } catch (error) {
            return res.json({ status: false, msg: error.message });
        }
    });

    app.put('/update-image', async (req, res) => {
        const { userEmail, imageUrl } = req.body;
    
        try {
            const user = await User.findOneAndUpdate({ email: userEmail }, { profile_img: imageUrl }, { new: true });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    });




    app.post('/changePassword', verifyToken, async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id; // Assuming user ID is stored in the token
    
        try {
            // Find user by ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ status: false, msg: 'User not found.' });
            }
    
            // Check current password
            if (user.password !== currentPassword) {
                return res.status(406).json({ status: false, msg: 'Current password is incorrect.' });
            }
    
            // Hash new password and save
            user.password = newPassword;  // No bcrypt since you don't want encryption
            await user.save();
    
            res.json({ status: true, msg: 'Password changed successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, msg: 'Server error.' });
        }
    });

    app.post('/forgot-password', async (req, res) => {
        const { email } = req.body;
    
        try {
            const user = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
            
            if (!user) {
                
                return res.status(404).json({ status: false, msg: 'Email not found' });
            }
    
            
            const resetToken = jwt.sign(
                { email: user.email },
                resetPasswordSecret,
                { expiresIn: '5m' }
            );
    
            // Generate the reset link
            const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    
            // Read the HTML template 
            const filePath = path.join(__dirname, 'emailTemplates', 'resetPasswordTemplate.html');
            fs.readFile(filePath, 'utf8', (err, htmlData) => {
                if (err) {
                    console.error('Error reading HTML file:', err);
                    return res.status(500).json({ status: false, msg: 'Server error' });
                }
    
                
                const emailHtml = htmlData
                    .replace('{{email}}', user.email)
                    .replace(/{{resetLink}}/g, resetLink);  
    
                // Configure the nodemailer transporter
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'projectljtourism@gmail.com',
                        pass: 'enter your app password', 
                    },
                });
    
               
                const mailOptions = {
                    to: user.email,
                    from: 'projectljtourism@gmail.com',
                    subject: 'Request for Password Reset',
                    html: emailHtml, 
                };
    
                // Send the email
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error('Error while sending email:', err);
                        return res.status(500).json({ status: false, msg: 'Error sending email' });
                    }
                    
                    return res.json({ status: true, msg: 'Reset link sent' });
                });
            });
    
        } catch (err) {
            console.error('Server error:', err);  
            res.status(500).json({ status: false, msg: 'Server error' });
        }
    });
    
    

    app.post('/reset-password/:token', async (req, res) => {
        const { password } = req.body;
        const { token } = req.params;
    
        try {
            const decoded = jwt.verify(token, resetPasswordSecret);
    
           
            const user = await User.findOne({ email: decoded.email });
    
            if (!user) {
                return res.status(404).json({ status: false, msg: 'Invalid or expired token.' });
            }
    
            // Reset the password
            user.password = password; 
            await user.save();
    
            res.json({ status: true, msg: 'Password reset successfully.' });
        } catch (err) {
            console.error(err);
            if (err.name === 'TokenExpiredError') {
                return res.status(400).json({ status: false, msg: 'Token has expired.' });
            }
            res.status(500).json({ status: false, msg: 'Server error' });
        }
    });

    app.get('/check-token/:token', async (req, res) => {
        const { token } = req.params;
    
        try {
            const decoded = jwt.verify(token, resetPasswordSecret); 
         
            return res.status(200).json({ status: true });
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(400).json({ status: false, msg: 'Token has expired.' });
            }
            return res.status(500).json({ status: false, msg: 'Server error.' });
        }
    });



    app.get('/all-users', async (req, res) => {
        try {
            const users = await User.find({ role: { $ne: 'admin' } }); 
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    });
    // app.get('/all-users', verifyToken, async (req, res) => {
    //     try {
    //         // Check if the user has admin role
    //         const userRole = req.user.role; // Assumes verifyToken attaches the decoded token to req.user
    
    //         if (userRole !== 'admin') {
    //             return res.status(403).json({ message: 'Access denied. Only admins can view this resource.' });
    //         }
    
    //         // Fetch users excluding those with the admin role
    //         const users = await User.find({ role: { $ne: 'admin' } });
    //         res.json(users);
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error fetching users', error });
    //     }
    // });

    // app.get('/all-users', verifyToken ,async (req, res) => {
    //     try {
    //         // Log the user's role for debugging
    //         console.log("Authenticated user role:", req.user.role);
    
    //         // Check if the user is authenticated and has a valid role
    //         const userRole = req.user.role;
    
    //         // Allow only admins to fetch the user data
    //         if (userRole !== 'admin') {
    //             console.log("Access denied: User role is not admin.");
    //             return res.status(403).json({ message: 'Access denied. Only admins can view this resource.' });
    //         }
    
    //         // Fetch users excluding those with the admin role
    //         const users = await User.find({ role: { $ne: 'admin' } });
    //         res.json(users);
    //     } catch (error) {
    //         console.error("Error fetching users:", error);
    //         res.status(500).json({ message: 'Error fetching users', error });
    //     }
    // });

    app.put('/all-users/:id/toggle-status', async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Toggle status between active and deactive
            user.status = user.status === 'active' ? 'deactive' : 'active';
            user.updated_at = Date.now(); // Update the updated_at timestamp
            await user.save();
    
            res.json({ message: `User status changed to ${user.status}`, user });
        } catch (error) {
            res.status(500).json({ message: 'Error updating user status', error });
        }
    });


    








    module.exports = app;


}






