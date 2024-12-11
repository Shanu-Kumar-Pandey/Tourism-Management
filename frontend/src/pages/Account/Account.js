import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaUserAlt, FaCalendarCheck, FaStar, FaEdit } from "react-icons/fa";
import PersonalInfo from '../../components/account/PersonalInfo';
import Favorites from '../../components/account/Favorites';
import Reviews from '../../components/account/Reviews';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase';

import './Account.css';

function Account() {
    const [activeSection, setActiveSection] = useState('personalInfo');
    const [user, setUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const location = useLocation();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        if (location.pathname.includes('personal-info')) {
            setActiveSection('personalInfo');
        } else if (location.pathname.includes('favorites')) {
            setActiveSection('favorites');
        } else if (location.pathname.includes('reviews')) {
            setActiveSection('reviews');
        }
    }, [location]);

    const updateUserImage = async (userEmail, imageUrl) => {
        try {
            const response = await fetch('http://localhost:5000/update-image', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail, imageUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to update image');
            }

            const updatedUser = await response.json();
            return updatedUser;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        
        // Ensure a valid file is selected
        if (!file) {
            console.error('No file selected or file is invalid');
            return;
        }
    
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file)); // This should now be safe
    };

 

    const handleUpload = async () => {
        if (!selectedImage) return;
    
        // Check if user email is defined
        if (!user || !user.email) {
            console.error('User email is undefined');
            return;
        }
    
        setIsLoading(true); // Start loader
    
        try {
            const storageRef = ref(storage, `profile-pics/${user.email}`);
            await uploadBytes(storageRef, selectedImage);
            const downloadURL = await getDownloadURL(storageRef);
    
            // Save image URL to MongoDB
            const updatedUser = await updateUserImage(user.email, downloadURL);
            setUser(updatedUser);
    
            // Clear the preview and selected image
            setSelectedImage(null);
            setImagePreview(null);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsLoading(false); // Stop loader
        }
    };
    
    const renderSection = () => {
        switch (activeSection) {
            case 'personalInfo':
                return <PersonalInfo user={user} setUser={setUser} />;
            case 'favorites':
                return <Favorites />;
            case 'reviews':
                return <Reviews />;
            default:
                return null;
        }
    };

    return (
        <div className="account-page">
            <div className="account-header">
                <div className="profile-pic-container">
                    <img src={user?.profile_img || "../logos/image1.jpg"} alt="../logos/image1.jpg" className="profile-pic" />
                    <FaEdit className="edit-icon" onClick={() => document.getElementById('image-upload').click()} />
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        
                        onChange={handleImageChange}
                    />
                </div>
                <h3>{user?.name || 'Loading...'}</h3>
            </div>

            {imagePreview && (
                <div className="image-preview">
                    <img src={imagePreview} alt="Preview" className="preview-pic" />
                    {isLoading ? (
                        <div className="loader"></div> // Display loader
                    ) : (
                        <div>
                            Want to update profile image<br></br><br></br>
                            <button onClick={handleUpload}>Yes</button>
                            <button onClick={() => setImagePreview(null)}>No</button>
                        </div>
                    )}
                </div>
            )}

            <div className="account-nav">
                <NavLink to="/account/personal-info">
                    <button
                        className={activeSection === 'personalInfo' ? 'active' : ''}
                        onClick={() => setActiveSection('personalInfo')}
                    >
                        <FaUserAlt className="icon" /> Personal Info
                    </button>
                </NavLink>
                <NavLink to="/account/favorites">
                    <button
                        className={activeSection === 'favorites' ? 'active' : ''}
                        onClick={() => setActiveSection('favorites')}
                    >
                        <FaCalendarCheck className="icon" /> Bookings
                    </button>
                </NavLink>
                <NavLink to="/account/reviews">
                    <button
                        className={activeSection === 'reviews' ? 'active' : ''}
                        onClick={() => setActiveSection('reviews')}
                    >
                        <FaStar className="icon" /> Reviews
                    </button>
                </NavLink>
            </div>

            <div className="account-content">
                {renderSection()}
            </div>
        </div>
    );
}

export default Account;
