import React, { useState } from "react";
import axios from "axios";
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); 
    const [disabled, setDisabled] = useState(false); 
    const [timer, setTimer] = useState(0); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        setDisabled(true); 

        try {
            const response = await axios.post('http://localhost:5000/forgot-password', { email });

           
            if (response.data.status) {
                setMessage("A password reset link has been sent to your email.");
                setTimer(60); 
                startTimer(); 
            }
        } catch (err) {
           
            if (err.response && err.response.status === 404) {
                setError("User Email not found.");
            } else {
                setError("An error occurred while sending the reset link.");
            }
            setDisabled(false); 
        } finally {
            setLoading(false); 
        }
    };

    const startTimer = () => {
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setDisabled(false); 
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                
                {message && <p className="success-msg">{message}</p>}
                {error && <p className="error-msg">{error}</p>}

                <button id="fp-submit" type="submit" disabled={disabled}>
                    {loading ? <div id="loader" className="loader"></div> : "Send Reset Link"}
                </button>

                
                {disabled && timer > 0 && <p>Please wait {timer} seconds to resend.</p>}
            </form>
        </div>
    );
}

export default ForgotPassword;
