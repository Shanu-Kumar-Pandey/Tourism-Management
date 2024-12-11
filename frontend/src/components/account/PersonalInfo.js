import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import './PersonalInfo.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function PersonalInfo({ user, setUser }) {
    const [editingFields, setEditingFields] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [setUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEditClick = (field) => {
        if (!editingFields.includes(field)) {
            setEditingFields(prevFields => [...prevFields, field]);
        }
    };

    const handleSaveChanges = async () => {
        try {
            const token = Cookies.get('token');

            if (!token) {
                console.error('Token is not available');
                return;
            }

            const response = await fetch('http://localhost:5000/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();

            if (data.status) {
                const { password, _id, created_at, updated_at, ...filteredUser } = data.data;
                localStorage.setItem('user', JSON.stringify(filteredUser));
                setUser(filteredUser);
                setEditingFields([]);
            } else {
                console.error('Failed to update profile:', data.msg);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="personal-info">
            {/* Render personal information and edit fields */}
            <div className="info-item">
                <label>Full Name</label>
                {editingFields.includes('name') ? (
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                    />
                ) : (
                    <p>{user.name}</p>
                )}
                <button className="edit-btn" onClick={() => handleEditClick('name')}>
                    <FaRegEdit />
                </button>
            </div>
            <div className="info-item">
                <label>Address</label>
                {editingFields.includes('address') ? (
                    <input
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleInputChange}
                    />
                ) : (
                    <p>{user.address}</p>
                )}
                <button className="edit-btn" onClick={() => handleEditClick('address')}>
                    <FaRegEdit />
                </button>
            </div>
            {/* Additional info fields */}
            <div className="info-item">
                <label>Date of Birth</label>
                {editingFields.includes('dob') ? (
                    <input
                        type="date"
                        name="dob"
                        value={user.dob}
                        onChange={handleInputChange}
                    />
                ) : (
                    <p>{user.dob || "Not specified"}</p>
                )}
                <button className="edit-btn" onClick={() => handleEditClick('dob')}>
                    <FaRegEdit />
                </button>
            </div>
            <div className="info-item">
                <label>Phone</label>
                {editingFields.includes('phone') ? (
                    <input
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                    />
                ) : (
                    <p>{user.phone || "Not specified"}</p>
                )}
                <button className="edit-btn" onClick={() => handleEditClick('phone')}>
                    <FaRegEdit />
                </button>
            </div>
            <div className="info-item">
                <label>Email</label>
                <p>{user.email}</p>
            </div>
            {/* Change password section */}
            <div className="info-item">
                <div className="label-btn-group">
                    <label>Password</label>
                    <button className="change-password-btn" onClick={() => navigate('/change-password')}>
                        Change Password
                    </button>
                </div>
            </div>
            <div className="account-nav">
                <button onClick={handleSaveChanges}>Save Changes</button>
            </div>
        </div>
    );
}

export default PersonalInfo;
