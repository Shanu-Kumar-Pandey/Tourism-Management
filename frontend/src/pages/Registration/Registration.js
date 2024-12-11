import React, { useState, useRef } from "react";
import axios from "axios";
import { NavLink, useNavigate } from 'react-router-dom';
import './Registration.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  

function Registration() {
    const [selectedRole, setSelectedRole] = useState('tourist');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState('');
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setIsCheckboxChecked(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const { name, email, password, confirmPassword, phone } = formData;

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!name) {
            setError("Please Enter Your Name.");
            nameRef.current.focus();
            return;
        } else if (!nameRegex.test(name)) {
            setError("Name should contain only alpha and spaces.");
            nameRef.current.focus();
            return;
        }

        // Validate email
        if (!email) {
            setError("Please Enter Your Email");
            emailRef.current.focus();
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phone) {
            setError("Please Enter Your Phone");
            phoneRef.current.focus();
            return;
        } else if (!phoneRegex.test(phone)) {
            setError("Phone number should be 10 digits.");
            phoneRef.current.focus();
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!password) {
            setError("Please Enter Your Password");
            passwordRef.current.focus();
            return;
        } else if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, and one special character.");
            passwordRef.current.focus();
            return;
        }

        if (!confirmPassword) {
            setError("Please Enter Your Confirm Password");
            confirmPasswordRef.current.focus();
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            confirmPasswordRef.current.focus();
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/register", {
                name,
                email,
                password,
                role: selectedRole,
                phone
            });

            if (response.status === 201) {
                setSuccess("Registration done Successfully.");
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                emailRef.current.focus();
                setError("User already exists");
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="Alert-box">
            <div className="registration-container">
                <div className="registration-box">
                    <div className="welcome-section">
                        <span className="welcome-section-2">Join us on this exciting journey!</span>
                        <img src="logos/logo2.svg" alt="Registration illustration" />
                        <p>Already have an account? <NavLink to="/login">Sign in</NavLink></p>
                    </div>
                    <div className="registration-form">
                        <div className="role-selection">
                            <label>
                                <input
                                    type="radio"
                                    value="tourist"
                                    checked={selectedRole === 'tourist'}
                                    onChange={handleRoleChange}
                                />
                                Tourist
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="agent"
                                    checked={selectedRole === 'agent'}
                                    onChange={handleRoleChange}
                                />
                                Agent
                            </label>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label>Full name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                ref={nameRef}
                            />
                            <label>Email address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                ref={emailRef}
                            />
                            <label>Phone Number</label>
                            <input
                                type="number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter your Phone"
                                ref={phoneRef}
                            />
                            <label>Password (min. 8 char)</label>
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter password"
                                    ref={passwordRef}
                                />
                                <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <label>Confirm password</label>
                            <div className="password-container">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm password"
                                    ref={confirmPasswordRef}
                                />
                                <button type="button" className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <div className="terms">
                                <input
                                    type="checkbox"
                                    className="terms-check"
                                    checked={isCheckboxChecked}
                                    onChange={handleCheckboxChange}
                                />
                                <span>By joining, I agree to the <a href="/terms">Terms of use</a> and <a href="/privacy">Privacy policy</a></span>
                            </div>

                            {error && <p className="error-msg">{error}</p>}
                            {success && <p className="success-msg">{success}</p>}
                            <button type="submit" className="sign-up-button" disabled={!isCheckboxChecked}>Sign up</button>
                        </form>
                        <a href="/" className="go-back">← Go back</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registration;


// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { NavLink, useNavigate } from 'react-router-dom';
// import './Registration.css';

// function Registration() {
//     const [selectedRole, setSelectedRole] = useState('tourist');
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         phone: ''
//     });
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState('');
//     const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
//     const nameRef = useRef(null);
//     const emailRef = useRef(null);
//     const phoneRef = useRef(null);
//     const passwordRef = useRef(null);
//     const confirmPasswordRef = useRef(null);

//     const handleRoleChange = (event) => {
//         setSelectedRole(event.target.value);
//     };

//     const handleInputChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleCheckboxChange = (e) => {
//         setIsCheckboxChecked(e.target.checked);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");
//         const { name, email, password, confirmPassword, phone } = formData;

//         // Validate name (only letters and spaces)
//         const nameRegex = /^[A-Za-z\s]+$/;
//         if (!name) {
//             setError("Please Enter Your Name.");
//             nameRef.current.focus();
//             return;
//         } else if (!nameRegex.test(name)) {
//             setError("Name should contain only alpha and spaces.");
//             nameRef.current.focus();
//             return;
//         }

//         // Validate email
//         if (!email) {
//             setError("Please Enter Your Email");
//             emailRef.current.focus();
//             return;
//         }

//         // Validate phone (only numbers and exactly 10 digits)
//         const phoneRegex = /^[0-9]{10}$/;


//         if (!phone) {
//             setError("Please Enter Your Phone");
//             phoneRef.current.focus();
//             return;
//         } else if (!phoneRegex.test(phone)) {
//             setError("Phone number should be 10 digits.");
//             phoneRef.current.focus();
//             return;
//         }

//         // Validate password (minimum 8 characters, at least one uppercase, one lowercase, and one special character)
//         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
//         if (!password) {
//             setError("Please Enter Your Password");
//             passwordRef.current.focus();
//             return;
//         } else if (!passwordRegex.test(password)) {
//             setError("Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, and one special character.");
//             passwordRef.current.focus();
//             return;
//         }

//         // Validate confirm password
//         if (!confirmPassword) {
//             setError("Please Enter Your Confirm Password");
//             confirmPasswordRef.current.focus();
//             return;
//         }

//         // Check password match
//         if (password !== confirmPassword) {
//             setError("Passwords do not match");
//             confirmPasswordRef.current.focus();
//             return;
//         }

//         try {
//             const response = await axios.post("http://localhost:5000/register", {
//                 name,
//                 email,
//                 password,
//                 role: selectedRole,
//                 phone
//             });

//             if (response.status === 201) {
//                 setSuccess("Registration done Successfully.");
//                 setTimeout(() => {
//                     navigate("/login");
//                 }, 1000);
//             }
//         } catch (error) {
//             if (error.response && error.response.status === 400) {
//                 emailRef.current.focus();
//                 setError("User already exists");
//             }
//         }
//     };


//     return (
//         <div className="Alert-box">

//             <div className="registration-container">
//                 <div className="registration-box">
//                     <div className="welcome-section">
//                         <span className="welcome-section-2">Join us on this exciting journey!</span>
//                         <img src="logos/logo2.svg" alt="Registration illustration" />
//                         <p>Already have an account? <NavLink to="/login">Sign in</NavLink></p>
//                     </div>
//                     <div className="registration-form">
//                         <div className="role-selection">
//                             <label>
//                                 <input
//                                     type="radio"
//                                     value="tourist"
//                                     checked={selectedRole === 'tourist'}
//                                     onChange={handleRoleChange}
//                                 />
//                                 Tourist
//                             </label>
//                             <label>
//                                 <input
//                                     type="radio"
//                                     value="agent"
//                                     checked={selectedRole === 'agent'}
//                                     onChange={handleRoleChange}
//                                 />
//                                 Agent
//                             </label>
//                         </div>
//                         <form onSubmit={handleSubmit}>
//                             <label>Full name</label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter your full name"
//                                 ref={nameRef}
//                             />
//                             <label>Email address</label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter your email"
//                                 ref={emailRef}
//                             />
//                             <label>Phone Number</label>
//                             <input
//                                 type="number"
//                                 name="phone"
//                                 value={formData.phone}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter your Phone"
//                                 ref={phoneRef}
                                
//                             />
//                             <label>Password (min. 8 char)</label>
//                             <input
//                                 type="password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter password"
//                                 ref={passwordRef}
//                             />
//                             <label>Confirm password</label>
//                             <input
//                                 type="password"
//                                 name="confirmPassword"
//                                 value={formData.confirmPassword}
//                                 onChange={handleInputChange}
//                                 placeholder="Confirm password"
//                                 ref={confirmPasswordRef}
//                             />
//                             <div className="terms">
//                                 <input
//                                     type="checkbox"
//                                     className="terms-check"
//                                     checked={isCheckboxChecked}
//                                     onChange={handleCheckboxChange}
//                                 />
//                                 <span>By joining, I agree to the <a href="/terms">Terms of use</a> and <a href="/privacy">Privacy policy</a></span>
//                             </div>

//                             {error && <p className="error-msg">{error}</p>}
//                             {success && <p className="success-msg">{success}</p>}
//                             <button type="submit" className="sign-up-button" disabled={!isCheckboxChecked}>Sign up</button>
//                         </form>
//                         <a href="/" className="go-back">← Go back</a>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Registration;
