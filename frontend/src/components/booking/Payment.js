import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    tourId, 
    userId, 
    passengerDetails, 
    contactInfo, 
    totalAmount, 
    numAdults,  
    numInfants  
  } = location.state;

  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cvv: '',
    expiryDate: '',
    notes: ''
  });
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [berror, setBerror] = useState('');
  const [sucess, setSuccess] = useState('');
  const [bsucess, setBsuccess] = useState('');

  const handleCardDetailsChange = (field, value) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleSendOtp = async () => {
    try {


      const packageNameResponse = await fetch(`http://localhost:5000/get-package-name/${location.state.tourId}`);
    const packageData = await packageNameResponse.json();

    if (!packageData.status) {
      throw new Error('Failed to fetch package name');
    } 
    
      const response = await fetch('http://localhost:5000/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({

          email: contactInfo.email,
          customerName:passengerDetails[0].name,
          tripPackageName: packageData.package_name,
          numberOfPersons: passengerDetails.length,
          totalPrice: totalAmount,
          cardLast4: cardDetails.cardNumber.slice(-4)
        })
      });
  
      if (response.ok) {
        setIsOtpSent(true);
        setSuccess('Otp sent sucessfuly to your Email');
      } else {
        throw new Error('Failed to send OTP.');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const validateForm = () => {
    let errorMessage = '';

    // Validate Card Number
    if (!cardDetails.cardNumber || !/^\d{16}$/.test(cardDetails.cardNumber)) {
      errorMessage = 'Please enter a valid 16-digit card number.';
    }
    // Validate CVV
    else if (!cardDetails.cvv || !/^\d{3}$/.test(cardDetails.cvv)) {
      errorMessage = 'Please enter a valid 3-digit CVV.';
    }
    // Validate Expiry Date
    else if (!cardDetails.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
      errorMessage = 'Expiry date must be in MM/YY format.';
    }
    // Validate Notes (Optional)
    else if (cardDetails.notes.length > 100) {
      errorMessage = 'Notes should not exceed 100 characters.';
    }

    setError(errorMessage); // Set the error message or clear it
    return !errorMessage;
  };

  const handlePayment = () => {
    if (validateForm()) {
      handleSendOtp();
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contactInfo.email, otp })
      });
  
      if (response.ok) {
        const bookingData = {
          tour_id: tourId,
          user_id: userId,
          bookingDate: new Date().toISOString(),
          numberOfPeople: passengerDetails.length,
          totalAmount,
          passengerDetails,
          status: 'Confirmed',
          paymentStatus: 'Paid',
          paymentMethod,
          notes: cardDetails.notes,
          email: contactInfo.email,
          phone: contactInfo.phone,
        };
  
        const bookingResponse = await fetch('http://localhost:5000/book-tour', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        });
  
        if (bookingResponse.ok) {
       
          setError('');
          setBsuccess('Booking confirmed successfully!');
          setTimeout(() => {
            navigate('/account/favorites');
        }, 1000); 



        } else {
          throw new Error('Booking confirmation failed.');
        }
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      
      setBerror('Booking failed. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate('/booking', {
      state: {
        tourId,
        userId,
        passengerDetails,
        contactInfo,
        pricePerPerson: totalAmount / (numAdults + numInfants / 2),
        numAdults,
        numInfants
      }
    });
  };

  return (
    <div className="paymentclass">
      <h2 className="payment-title">Select Payment Method</h2>
      <div className="payment-method-options">
        <label className="payment-label">
          <input
            type="radio"
            name="paymentMethod"
            value="Credit Card"
            checked={paymentMethod === 'Credit Card'}
            onChange={() => handlePaymentMethodChange('Credit Card')}
          />
          Credit Card
        </label>
        <label className="payment-label">
          <input
            type="radio"
            name="paymentMethod"
            value="Debit Card"
            checked={paymentMethod === 'Debit Card'}
            onChange={() => handlePaymentMethodChange('Debit Card')}
          />
          Debit Card
        </label>
      </div>

      {paymentMethod && (
        <div className="card-details">
          <h3 className="payment-subtitle">Enter Card Details</h3>
          <div className="card-inputs">
            <label className="payment-label">Card Number:</label>
            <input
              type="text"
              className="payment-input"
              value={cardDetails.cardNumber}
              onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value)}
            />

            <label className="payment-label">CVV:</label>
            <input
              type="text"
              className="payment-input"
              value={cardDetails.cvv}
              onChange={(e) => handleCardDetailsChange('cvv', e.target.value)}
            />

            <label className="payment-label">Expiry Date:</label>
            <input
              type="text"
              className="payment-input"
              placeholder="MM/YY"
              value={cardDetails.expiryDate}
              onChange={(e) => handleCardDetailsChange('expiryDate', e.target.value)}
            />

            <label className="payment-label">Notes (optional):</label>
            <input
              type="text"
              className="payment-input"
              placeholder="Optional"
              value={cardDetails.notes}
              onChange={(e) => handleCardDetailsChange('notes', e.target.value)}
            />
          </div>

          <button className="payment-button" onClick={handlePayment}>Make Payment</button>
        </div>
      )}

             {sucess && <div className="success-text">{sucess} </div>}

      {isOtpSent && (
        <div className="otp-verification">
          <h3 className="payment-subtitle">Enter OTP</h3>
          <input
            type="text"
            className="payment-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />


          <button className="payment-button" onClick={handleConfirmBooking}>Confirm Booking</button>
        </div>
      )}

      {error && <div className="error-text">{error}</div>}
      {berror && <div className="error-text">{berror}</div>}
      {bsucess && <div className="success-text">{bsucess}</div>}
    
      <br></br>

      {/* Back button */}
      <button className="proceed-button" onClick={handleGoBack}>Back</button>
    </div>
  );
};

export default Payment;






// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import './Payment.css';

// const Payment = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { tourId, userId, passengerDetails, contactInfo, totalAmount } = location.state;

//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [cardDetails, setCardDetails] = useState({
//     cardNumber: '',
//     cvv: '',
//     expiryDate: '',
//     notes: ''  // Add notes to the state
//   });
//   const [otp, setOtp] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false);

//   const handleCardDetailsChange = (field, value) => {
//     setCardDetails((prev) => ({ ...prev, [field]: value }));
//   };

//   const handlePaymentMethodChange = (method) => {
//     setPaymentMethod(method);
//   };

//   const handleSendOtp = () => {
//     alert('OTP sent to your registered email: 123456');
//     setIsOtpSent(true);
//   };

//   const handlePayment = () => {
//     if (cardDetails.cardNumber && cardDetails.cvv && cardDetails.expiryDate) {
//       handleSendOtp();
//     } else {
//       alert('Please fill in all card details');
//     }
//   };

//   const handleConfirmBooking = () => {
//     if (otp === '123456') {
//       const bookingData = {
//         tour_id: tourId,
//         user_id: userId,
//         bookingDate: new Date().toISOString(),
//         numberOfPeople: passengerDetails.length,
//         totalAmount,
//         passengerDetails,
//         status: 'Confirmed',
//         paymentStatus: 'Paid',
//         paymentMethod,
//         notes: cardDetails.notes,
//         email: contactInfo.email, // Include email in booking data
//         phone: contactInfo.phone, // Include phone in booking data
//       };
  
//       console.log('Booking Data:', bookingData);
  
//       fetch('http://localhost:5000/book-tour', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(bookingData),
//       })
//         .then((response) => {
//           if (response.ok) {
//             alert('Booking confirmed successfully!');
//             navigate('/');
//           } else {
//             return response.json().then((errorData) => {
//               alert(`Booking failed: ${errorData.error || 'Please try again.'}`);
//             });
//           }
//         })
//         .catch((error) => {
//           console.error('Error confirming booking:', error);
//           alert('Booking failed. Please try again.');
//         });
//     } else {
//       alert('Invalid OTP. Please try again.');
//     }
//   };
  
//   return (
//     <div className="paymentclass">
//       <h2 className="payment-title">Select Payment Method</h2>
//       <div className="payment-method-options">
//         <label className="payment-label">
//           <input
//             type="radio"
//             name="paymentMethod"
//             value="Credit Card"
//             checked={paymentMethod === 'Credit Card'}
//             onChange={() => handlePaymentMethodChange('Credit Card')}
//           />
//           Credit Card
//         </label>
//         <label className="payment-label">
//           <input
//             type="radio"
//             name="paymentMethod"
//             value="Debit Card"
//             checked={paymentMethod === 'Debit Card'}
//             onChange={() => handlePaymentMethodChange('Debit Card')}
//           />
//           Debit Card
//         </label>
//       </div>

//       {paymentMethod && (
//         <div className="card-details">
//           <h3 className="payment-subtitle">Enter Card Details</h3>
//           <div className="card-inputs">
//             <label className="payment-label">Card Number:</label>
//             <input
//               type="text"
//               className="payment-input"
//               value={cardDetails.cardNumber}
//               onChange={(e) => handleCardDetailsChange('cardNumber', e.target.value)}
//             />
//             <label className="payment-label">CVV:</label>
//             <input
//               type="text"
//               className="payment-input"
//               value={cardDetails.cvv}
//               onChange={(e) => handleCardDetailsChange('cvv', e.target.value)}
//             />
//             <label className="payment-label">Expiry Date:</label>
//             <input
//               type="text"
//               className="payment-input"
//               placeholder="MM/YY"
//               value={cardDetails.expiryDate}
//               onChange={(e) => handleCardDetailsChange('expiryDate', e.target.value)}
//             />
//             <label className="payment-label">Notes (optional):</label>
//             <input
//               type="text"
//               className="payment-input"
//               placeholder="Optional"
//               value={cardDetails.notes}
//               onChange={(e) => handleCardDetailsChange('notes', e.target.value)} // Handle notes change
//             />
//           </div>
//           <button className="payment-button" onClick={handlePayment}>Make Payment</button>
//         </div>
//       )}

//       {isOtpSent && (
//         <div className="otp-verification">
//           <h3 className="payment-subtitle">Enter OTP</h3>
//           <input
//             type="text"
//             className="payment-input"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//           />
//           <button className="payment-button" onClick={handleConfirmBooking}>Confirm Booking</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Payment;
