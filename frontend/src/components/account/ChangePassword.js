import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './ChangePassword.css';
import Cookies from 'js-cookie';

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match.');
            return;
        }

        try {
            const token = Cookies.get('token');

            if (!token) {
                console.error('Token is not available');
                return;
            }

            const response = await fetch('http://localhost:5000/changePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.status === 406) {
                setError('Your current password is incorrect. Please try again.');
            } else if (data.status) {
                setSuccess('Password changed successfully.');
                
                setTimeout(() => {
                    navigate('/account/personal-info');
                }, 1000); 
            } else {
                setError(data.msg || 'Failed to change password.');
            }
        } catch (error) {
            setError('Error occurred while changing the password.');
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}
                <button id='cp-button' type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ChangePassword;
