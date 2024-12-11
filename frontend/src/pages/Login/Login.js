import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);  
  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
        
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please Enter Your Email.");
      emailRef.current.focus(); 
      return;
    }
    if (!password) {
      setError("Please Enter Your Password.");
      passwordRef.current.focus();  
      return;
    }

    let data = JSON.stringify({
      email: email,
      password: password
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:5000/login',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        if (response.data.status) {
          // Store JWT token in cookies
          Cookies.set('token', response.data.token, { expires: 28 });

          // Store user details in session storage
          localStorage.setItem('user', JSON.stringify(response.data.user));

          // Redirect to home page
          setSuccess('Logged In Successfully.');
          setTimeout(() => {
            navigate('/');
        }, 1000); 
          
        } else {
          setError(response.data.msg || 'Login failed!!!!.');
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate('/blocked-account');
        } else if (error.response && error.response.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError('An error occurred during login. Please try again.');
        }
      });
  };

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="welcome-section">
          <h1>Hey there! Welcome back.</h1>
          <img src="logos/logo1.svg" alt="Login illustration" />
          <p>
            Don't have an account? <a href="/register">Sign up here</a>
          </p>
        </div>
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              ref={emailRef} 
            />
            <label>Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}  
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef} 
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <a href="/forgot-password" className="forgot-password">Forgot password?</a>
            {error && <p className="error-msg">{error}</p>}
            {success && <p className="success-msg">{success}</p>}

            <button type="submit" className="sign-in-button">Sign in</button>
          </form>
          <a href="/" className="go-back">← Go back</a>
        </div>
      </div>
    </div>
  );
}

export default Login;


// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import './Login.css';

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   const emailRef = useRef(null);
//   const passwordRef = useRef(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
        
//     setError("");
//     setSuccess("");

//     if (!email) {
//       setError("Please Enter Your Email.");
//       emailRef.current.focus(); 
//       return;
//     }
//     if (!password) {
//       setError("Please Enter Your Password.");
//       passwordRef.current.focus();  
//       return;
//     }



//     let data = JSON.stringify({
//       email: email,
//       password: password
//     });

//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'http://localhost:5000/login',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       data: data
//     };

//     axios.request(config)
//       .then((response) => {
//         if (response.data.status) {
//           // Store JWT token in cookies
//           Cookies.set('token', response.data.token, { expires: 28 });

//           // Store user details in session storage
//           localStorage.setItem('user', JSON.stringify(response.data.user));

//           // Redirect to home page
//           setSuccess('Logged In Sucessfuly.');
//           setTimeout(() => {
//             navigate('/');
//         }, 1000); 
          
//         } else {
//           setError(response.data.msg || 'Login failed!!!!.');
//         }
//       })
//       .catch((error) => {
//         if (error.response && error.response.status === 403) {
       
//           navigate('/blocked-account');
//         } else if (error.response && error.response.status === 401) {
          
//           setError('Invalid email or password. Please try again.');
//         } else {
//           setError('An error occurred during login. Please try again.');
//         }
//       });
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <div className="welcome-section">
//           <h1>Hey there! Welcome back.</h1>
//           <img src="logos/logo1.svg" alt="Login illustration" />
//           <p>
//             Don't have an account? <a href="/register">Sign up here</a>
//           </p>
//         </div>
//         <div className="login-form">
//           <form onSubmit={handleSubmit}>
//             <label>Email address</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               ref={emailRef} 
//             />
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               ref={passwordRef} 
//             />
//             <a href="/forgot-password" className="forgot-password">Forgot password?</a>
//             {error && <p className="error-msg">{error}</p>}
//             {success && <p className="success-msg">{success}</p>}

//             <button type="submit" className="sign-in-button">Sign in</button>
//           </form>
//           <a href="/" className="go-back">← Go back</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

















// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import './Login.css';

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let data = JSON.stringify({
//       email: email,
//       password: password
//     });

//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'http://localhost:5000/login',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       data: data
//     };

//     axios.request(config)
//       .then((response) => {
//         if (response.data.status) {
//           // Store JWT token in cookies
//           Cookies.set('token', response.data.token, { expires: 28 });

//           // Store user details in session storage
//           localStorage.setItem('user', JSON.stringify(response.data.user));

//           // Redirect to account page
//           navigate('/');
//         } else {
//           console.error('Login failed:', response.data.msg);
//         }
//       })
//       .catch((error) => {
//         if (error.response && error.response.status === 403) {
//           // If account is blocked, redirect to BlockedAccount component
//           navigate('/blocked-account');
//         } 
//         else {
//           setError('An error occurred during login. Please try again.');
//         }
//       });
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <div className="welcome-section">
//           <h1>Hey there! Welcome back.</h1>
//           <img src="logos/logo1.svg" alt="Login illustration" />
//           <p>
//             Don't have an account? <a href="/register">Sign up here</a>
//           </p>
//         </div>
//         <div className="login-form">
//           <form onSubmit={handleSubmit}>
//             <label>Email address</label>
//             <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <label>Password</label>
//             <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <a href="/forgot-password" className="forgot-password">Forgot password?</a>
//             {error && <p className="error-msg">{error}</p>}

//             <button type="submit" className="sign-in-button">Sign in</button>
//           </form>
//           <a href="/" className="go-back">← Go back</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;


// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import './Login.css';

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let data = JSON.stringify({
//       email: email,
//       password: password
//     });

//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: 'http://localhost:5000/login',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       data: data
//     };

//     axios.request(config)
//       .then((response) => {
//         if (response.data.status) {
//           // Store JWT token in cookies
//           Cookies.set('token', response.data.token, { expires: 28 });

//           // Store user details in session storage
//           localStorage.setItem('user', JSON.stringify(response.data.user));


//           // Redirect to account page
//           navigate('/');
//         } else {
//           console.error('Login failed:', response.data.msg);
//         }
//       })
//       .catch((error) => {
//         console.error('An error occurred during login:', error);
//       });
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <div className="welcome-section">
//           <h1>Hey there! Welcome back.</h1>
//           <img src="logos/logo1.svg" alt="Login illustration" />
//           <p>
//             Don't have an account? <a href="/register">Sign up here</a>
//           </p>
//         </div>
//         <div className="login-form">
//           <form onSubmit={handleSubmit}>
//             <label>Email address</label>
//             <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <label>Password</label>
//             <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <a href="/forgot-password" className="forgot-password">Forgot password?</a>
//             <button type="submit" className="sign-in-button">Sign in</button>
//           </form>
//           <a href="/" className="go-back">← Go back</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
