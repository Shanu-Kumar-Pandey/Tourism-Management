import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Booking.css';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    tourId, 
    userId, 
    pricePerPerson, 
    passengerDetails: initialPassengerDetails, 
    contactInfo: initialContactInfo,
    numAdults: initialNumAdults = 1,
    numInfants: initialNumInfants = 0 
  } = location.state || {};

  // Initialize state with data from location.state if it exists, otherwise use defaults
  const [numAdults, setNumAdults] = useState(initialNumAdults);
  const [numInfants, setNumInfants] = useState(initialNumInfants);
  const [passengerDetails, setPassengerDetails] = useState(initialPassengerDetails || []);
  const [contactInfo, setContactInfo] = useState(initialContactInfo || { email: '', phone: '' });
  const [errors, setErrors] = useState({});

  // Pre-fill passenger details when the component mounts
  useEffect(() => {
    if (initialPassengerDetails) {
      setPassengerDetails(initialPassengerDetails);
    }
  }, [initialPassengerDetails]);

  useEffect(() => {
    const updatedDetails = [...passengerDetails];
    const totalPassengers = numAdults + numInfants;
    while (updatedDetails.length < totalPassengers) {
      updatedDetails.push({ name: '', age: '', gender: '' });
    }
    setPassengerDetails(updatedDetails);
  }, [numAdults, numInfants, passengerDetails]);

  const handlePassengerDetails = (index, detail, value) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index] = { ...updatedDetails[index], [detail]: value };
    setPassengerDetails(updatedDetails);
  };

  const handleContactInfo = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!numAdults) newErrors.numAdults = 'No of adults is required';

    // Validate Passenger Details
    passengerDetails.forEach((passenger, index) => {
      if (!passenger.name) newErrors[`name_${index}`] = 'Name is required';
      if (!passenger.age) newErrors[`age_${index}`] = 'Age is required';
      if (!passenger.gender) newErrors[`gender_${index}`] = 'Gender is required';
    });

    // Validate Contact Information
    if (!contactInfo.email) newErrors.email = 'Email is required';
    if (!contactInfo.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleGoBack = () => {
    navigate('/places');
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) return; // Prevent form submission if validation fails

    const totalAmount = (numAdults + numInfants / 2) * pricePerPerson;
    navigate('/payment', {
      state: { 
        tourId, 
        userId, 
        passengerDetails, 
        contactInfo, 
        totalAmount, 
        numAdults, 
        numInfants  // Send numAdults and numInfants to the Payment page
      }
    });
  };

  return (
    <div className="booking-container-unique">
      <h2 className="booking-header">Enter Tourist Details</h2>
      <form className="tourist-details-form" onSubmit={(e) => e.preventDefault()}>
        <div className="tdgridclass">
          <div className="trdgrid-item">
            <label className="tourist-label">Number of Adults:</label>
            <input
              type="number"
              className="tourist-input"
              value={numAdults}
              onChange={(e) => setNumAdults(parseInt(e.target.value, 10))}
              min="1"

            />
             {errors.numAdults && <span className="error-text">{errors.numAdults}</span>}
          </div>
          <div className="trdgrid-item">
            <label className="tourist-label">Number of Infants:</label>
            <input
              type="number"
              className="tourist-input"
              value={numInfants}
              onChange={(e) => setNumInfants(parseInt(e.target.value, 10))}
              min="0"
            />
          </div>
        </div>
        {Array.from({ length: numAdults + numInfants }, (_, index) => (
          <div key={index} className="passenger-details-group">
            <h4 className="passenger-header">Passenger {index + 1}</h4>
            <div className="trdgrid-container">
              <div className="trdgrid-item">
                <label className="tourist-label">Name:</label>
                <input
                  type="text"
                  className="tourist-input"
                  value={passengerDetails[index]?.name || ''}  // Check if passengerDetails[index] exists
                  onChange={(e) => handlePassengerDetails(index, 'name', e.target.value)}
                />
                {errors[`name_${index}`] && <span className="error-text">{errors[`name_${index}`]}</span>}
              </div>
              <div className="trdgrid-item">
                <label className="tourist-label">Age:</label>
                <input
                  type="number"
                  className="tourist-input"
                  value={passengerDetails[index]?.age || ''}  // Check if passengerDetails[index] exists
                  onChange={(e) => handlePassengerDetails(index, 'age', e.target.value)}
                />
                {errors[`age_${index}`] && <span className="error-text">{errors[`age_${index}`]}</span>}
              </div>
              <div className="trdgrid-item">
                <label className="tourist-label">Gender:</label>
                <select
                  className="tourist-select"
                  value={passengerDetails[index]?.gender || ''}  // Check if passengerDetails[index] exists
                  onChange={(e) => handlePassengerDetails(index, 'gender', e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors[`gender_${index}`] && <span className="error-text">{errors[`gender_${index}`]}</span>}
              </div>
            </div>
          </div>
        ))}
        <div className="contact-info-group">
          <h3 className="contact-header">Contact Information</h3>
          <div className="trdgrid-container">
            <div className="trdgrid-item">
              <label className="tourist-label">Email:</label>
              <input
                type="email"
                className="tourist-input"
                value={contactInfo.email}
                onChange={(e) => handleContactInfo('email', e.target.value)}
                required
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="trdgrid-item">
              <label className="tourist-label">Phone Number:</label>
              <input
                type="tel"
                className="tourist-input"
                value={contactInfo.phone}
                onChange={(e) => handleContactInfo('phone', e.target.value)}
                required
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>
        </div>
        <button type="button" className="proceed-button" onClick={handleProceedToPayment}>
          Proceed to Payment
        </button>

        
      </form>
      <br></br>
      <button className="proceed-button" onClick={handleGoBack}>Back</button>
    </div>
  );
};

export default Booking;







// import React, { useState, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './Booking.css';

// const Booking = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { tourId, userId, pricePerPerson } = location.state;

//   const [numAdults, setNumAdults] = useState(1);
//   const [numInfants, setNumInfants] = useState(0);
//   const [passengerDetails, setPassengerDetails] = useState([]);
//   const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
//   const [error, setError] = useState("");

//   const emailRef = useRef(null);
//   const phoneRef = useRef(null);
//   const passengerRefs = useRef([]);

//   const handlePassengerDetails = (index, detail, value) => {
//     const updatedDetails = [...passengerDetails];
//     updatedDetails[index] = { ...updatedDetails[index], [detail]: value };
//     setPassengerDetails(updatedDetails);
//   };

//   const handleContactInfo = (field, value) => {
//     setContactInfo((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleProceedToPayment = () => {
//     setError("");

//     // Validate passenger details
//     for (let i = 0; i < numAdults + numInfants; i++) {
//       const passenger = passengerDetails[i] || {};
//       if (!passenger.name) {
//         setError(`Please enter the name for Passenger ${i + 1}.`);
//         passengerRefs.current[i].name.focus();
//         return;
//       }
//       if (!passenger.age) {
//         setError(`Please enter the age for Passenger ${i + 1}.`);
//         passengerRefs.current[i].age.focus();
//         return;
//       }
//       if (!passenger.gender) {
//         setError(`Please select the gender for Passenger ${i + 1}.`);
//         passengerRefs.current[i].gender.focus();
//         return;
//       }
//     }

//     // Validate contact information
//     if (!contactInfo.email) {
//       setError("Please enter your email.");
//       emailRef.current.focus();
//       return;
//     }
//     if (!contactInfo.phone) {
//       setError("Please enter your phone number.");
//       phoneRef.current.focus();
//       return;
//     }

//     const totalAmount = (numAdults + numInfants / 2) * pricePerPerson;
//     navigate('/payment', {
//       state: { tourId, userId, passengerDetails, contactInfo, totalAmount }
//     });
//   };

//   return (
//     <div className="booking-container-unique">
//       <h2 className="booking-header">Enter Tourist Details</h2>
//       <form className="tourist-details-form" onSubmit={(e) => e.preventDefault()}>
//         <div className="tdgridclass">
//           <div className="trdgrid-item">
//             <label className="tourist-label">Number of Adults:</label>
//             <input
//               type="number"
//               className="tourist-input"
//               value={numAdults}
//               onChange={(e) => setNumAdults(parseInt(e.target.value, 10))}
//               min="1"
//             />
//           </div>
//           <div className="trdgrid-item">
//             <label className="tourist-label">Number of Infants:</label>
//             <input
//               type="number"
//               className="tourist-input"
//               value={numInfants}
//               onChange={(e) => setNumInfants(parseInt(e.target.value, 10))}
//               min="0"
//             />
//           </div>
//         </div>
//         {Array.from({ length: numAdults + numInfants }, (_, index) => (
//           <div key={index} className="passenger-details-group">
//             <h4 className="passenger-header">Passenger {index + 1}</h4>
//             <div className="trdgrid-container">
//               <div className="trdgrid-item">
//                 <label className="tourist-label">Name:</label>
//                 <input
//                   type="text"
//                   className="tourist-input"
//                   ref={(el) => (passengerRefs.current[index] = { ...passengerRefs.current[index], name: el })}
//                   onChange={(e) => handlePassengerDetails(index, 'name', e.target.value)}
//                 />
//               </div>
//               <div className="trdgrid-item">
//                 <label className="tourist-label">Age:</label>
//                 <input
//                   type="number"
//                   className="tourist-input"
//                   ref={(el) => (passengerRefs.current[index] = { ...passengerRefs.current[index], age: el })}
//                   onChange={(e) => handlePassengerDetails(index, 'age', e.target.value)}
//                 />
//               </div>
//               <div className="trdgrid-item">
//                 <label className="tourist-label">Gender:</label>
//                 <select
//                   className="tourist-select"
//                   ref={(el) => (passengerRefs.current[index] = { ...passengerRefs.current[index], gender: el })}
//                   onChange={(e) => handlePassengerDetails(index, 'gender', e.target.value)}
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         ))}
//         <div className="contact-info-group">
//           <h3 className="contact-header">Contact Information</h3>
//           <div className="trdgrid-container">
//             <div className="trdgrid-item">
//               <label className="tourist-label">Email:</label>
//               <input
//                 type="email"
//                 className="tourist-input"
//                 value={contactInfo.email}
//                 ref={emailRef}
//                 onChange={(e) => handleContactInfo('email', e.target.value)}
//               />
//             </div>
//             <div className="trdgrid-item">
//               <label className="tourist-label">Phone Number:</label>
//               <input
//                 type="tel"
//                 className="tourist-input"
//                 value={contactInfo.phone}
//                 ref={phoneRef}
//                 onChange={(e) => handleContactInfo('phone', e.target.value)}
//               />
//             </div>
//           </div>
//         </div>
//         {error && <p className="error-msg">{error}</p>}
//         <button type="button" className="proceed-button" onClick={handleProceedToPayment}>
//           Proceed to Payment
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Booking;

// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './Booking.css';

// const Booking = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { tourId, userId, pricePerPerson } = location.state;

//   const [numAdults, setNumAdults] = useState(1);
//   const [numInfants, setNumInfants] = useState(0);
//   const [passengerDetails, setPassengerDetails] = useState([]);
//   const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });

//   const handlePassengerDetails = (index, detail, value) => {
//     const updatedDetails = [...passengerDetails];
//     updatedDetails[index] = { ...updatedDetails[index], [detail]: value };
//     setPassengerDetails(updatedDetails);
//   };

//   const handleContactInfo = (field, value) => {
//     setContactInfo((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleProceedToPayment = () => {
//     const totalAmount = (numAdults + (numInfants/2)) * pricePerPerson;
//     navigate('/payment', {
//       state: { tourId, userId, passengerDetails, contactInfo, totalAmount }
//     });
//   };

//   return (
//     <div className="booking-container-unique">
//       <h2 className="booking-header">Enter Tourist Details</h2>
//       <form className="tourist-details-form" onSubmit={(e) => e.preventDefault()}>
//         <div className="tdgridclass">
//           <div className="trdgrid-item">
//             <label className="tourist-label">Number of Adults:</label>
//             <input
//               type="number"
//               className="tourist-input"
//               value={numAdults}
//               onChange={(e) => setNumAdults(parseInt(e.target.value, 10))}
//               min="1"
//             />
//           </div>
//           <div className="trdgrid-item">
//             <label className="tourist-label">Number of Infants:</label>
//             <input
//               type="number"
//               className="tourist-input"
//               value={numInfants}
//               onChange={(e) => setNumInfants(parseInt(e.target.value, 10))}
//               min="0"
//             />
//           </div>
//         </div>
//         {Array.from({ length: numAdults + numInfants }, (_, index) => (
//           <div key={index} className="passenger-details-group">
//             <h4 className="passenger-header">Passenger {index + 1}</h4>
//             <div className="trdgrid-container">
//               <div className="trdgrid-item">
//                 <label className="tourist-label">Name:</label>
//                 <input
//                   type="text"
//                   className="tourist-input"
//                   onChange={(e) => handlePassengerDetails(index, 'name', e.target.value)}
//                 />
//               </div>
//               <div className="trdgrid-item">
//                 <label className="tourist-label">Age:</label>
//                 <input
//                   type="number"
//                   className="tourist-input"
//                   onChange={(e) => handlePassengerDetails(index, 'age', e.target.value)}
//                 />
//               </div>
//               <div className="trdgrid-item">
//                 <label className="tourist-label">Gender:</label>
//                 <select
//                   className="tourist-select"
//                   onChange={(e) => handlePassengerDetails(index, 'gender', e.target.value)}
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         ))}
//         <div className="contact-info-group">
//           <h3 className="contact-header">Contact Information</h3>
//           <div className="trdgrid-container">
//             <div className="trdgrid-item">
//               <label className="tourist-label">Email:</label>
//               <input
//                 type="email"
//                 className="tourist-input"
//                 value={contactInfo.email}
//                 onChange={(e) => handleContactInfo('email', e.target.value)}
//                 required
//               />
//             </div>
//             <div className="trdgrid-item">
//               <label className="tourist-label">Phone Number:</label>
//               <input
//                 type="tel"
//                 className="tourist-input"
//                 value={contactInfo.phone}
//                 onChange={(e) => handleContactInfo('phone', e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//         </div>
//         <button type="button" className="proceed-button" onClick={handleProceedToPayment}>
//           Proceed to Payment
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Booking;
