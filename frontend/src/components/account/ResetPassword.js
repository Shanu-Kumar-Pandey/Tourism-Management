import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './ResetPassword.css';

import LinkExpired from '../Statuspages/LinkExpired'

function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isTokenExpired, setIsTokenExpired] = useState(false); // State to track token status
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            try {
                await axios.get(`http://localhost:5000/check-token/${token}`); // Add a new endpoint for token validation
            } catch (err) {
                if (err.response && err.response.status === 400) {
                    setIsTokenExpired(true); // Set the state to true if token is expired
                } else {
                    setError('An error occurred while checking the token.');
                }
            }
        };

        checkToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/reset-password/${token}`, {
                password: newPassword
            });

            if (response.data.status) {
                setSuccess("Password reset successfully.");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.data.msg || 'Failed to reset password.');
            }
        } catch (err) {
            setError('An error occurred while resetting the password.');
        }
    };

    if (isTokenExpired) {
        return <LinkExpired />;
    }else{

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}
                <button id="rp-submit" type="submit">Reset Password</button>
            </form>
        </div>
    );

}
}

export default ResetPassword;



// // ResetPassword.js
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import './ResetPassword.css';

// function ResetPassword() {
//     const [newPassword, setNewPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const { token } = useParams();
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         if (newPassword !== confirmPassword) {
//             setError('Passwords do not match.');
//             return;
//         }

//         try {
//             const response = await axios.post(`http://localhost:5000/reset-password/${token}`, {
//                 password: newPassword
//             });

//             if (response.data.status) {
//                 setSuccess("Password reset successfully.");
//                 setTimeout(() => navigate('/login'), 2000);
//             } else {
//                 setError(response.data.msg || 'Failed to reset password.');
//             }
//         } catch (err) {
//             setError('An error occurred while resetting the password.');
//         }
//     };

//     return (
//         <div className="reset-password-container">
//             <h2>Reset Password</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label>New Password</label>
//                     <input
//                         type="password"
//                         value={newPassword}
//                         onChange={(e) => setNewPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Confirm New Password</label>
//                     <input
//                         type="password"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 {error && <p className="error-msg">{error}</p>}
//                 {success && <p className="success-msg">{success}</p>}
//                 <button id="rp-submit" type="submit">Reset Password</button>
//             </form>
//         </div>
//     );
// }

// export default ResetPassword;
