import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ViewTourDetails.css';

const ViewTourDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const tour = state?.tour;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [agentDetails, setAgentDetails] = useState(null);

  useEffect(() => {
    if (tour && tour.agent_id) {
      console.log('Agent ID:', tour.agent_id); // Check if agent ID is being logged
      axios.get(`http://localhost:5000/agents/${tour.agent_id}`) 
        .then(response => {
          setAgentDetails(response.data);
        })
        .catch(error => {
          console.error('Error fetching agent details:', error);
        });
    }
  }, [tour]);


  if (!tour) {
    return <p>Tour not found</p>;
  }

  // Helper function 
  const getImages = (data) => {
    return data?.images || []; // Return an empty array if images is undefined
  };

  // Collect all images from the day details safely
  const allImages = [
    ...getImages(tour.dayDetails[0].destination.data),
    ...getImages(tour.dayDetails[0].accommodation.data),
    ...getImages(tour.dayDetails[0].activities?.data || {}),
  ];

  // Function to handle image navigation in the carousel
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };

  // Function to get the description for the current image
  const getImageDescription = () => {
    const { destination, accommodation, activities } = tour.dayDetails[0];

    // Check if destination, accommodation, and activities exist before accessing their properties
    if (currentImageIndex < getImages(destination.data).length) {
      return destination.data.description || ''; // Return empty string if description is undefined
    } else if (
      currentImageIndex <
      getImages(destination.data).length + getImages(accommodation.data).length
    ) {
      return accommodation.data.description || ''; // Return empty string if description is undefined
    } else if (
      activities &&
      currentImageIndex <
      getImages(destination.data).length +
      getImages(accommodation.data).length +
      getImages(activities.data).length
    ) {
      return activities.data.description || ''; // Return empty string if description is undefined
    }
    return '';
  };

  // Function to format the description into list items
  const getDescriptionList = (description) => {
    if (!description) {
      return <li style={{ listStyleType: 'none', margin: 0 }}>-</li>; // Show a hyphen if description is not available
    }

    return description.split('. ').map((sentence, index) => (
      <li key={index} style={{ textAlign: 'left' }}>
        {sentence.trim()}
        {sentence.endsWith('.') ? '' : '.'}
      </li>
    ));
  };

  const handleBackButtonClick = () => {
    navigate("/places", { replace: true });
  };

  return (
    <div className="view-tour-details">
      {/* Combined Image Carousel */}
      <div className="carousel">
        <button onClick={handlePrevImage} className="carousel-button">❮</button>
        {allImages.length > 0 ? (
          <img
            src={allImages[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
            className="carousel-image"
          />
        ) : (
          <p>No images available</p>
        )}
        <button onClick={handleNextImage} className="carousel-button">❯</button>
        <div className="caption">{getImageDescription()}</div>
      </div>

      <h2 className="tour-title">{tour.packageName}</h2>
      <p>{tour.description}</p>
      <div className="trip-info">
        <table className="tour-info-table">
          <tbody>
            <tr>
              <th>Destination:</th>
              <td>{tour.destinationTitle}</td>
            </tr>
            <tr>
              <th>Duration:</th>
              <td>{tour.days} Days | {tour.nights} Nights</td>
            </tr>
            <tr>
              <th>Price:</th>
              <td>₹{tour.price} / Person</td>
            </tr>
            <tr>
              <th>Capacity:</th>
              <td>{tour.capacity} Seats</td>
            </tr>
            {/* <tr>
              <th>Agent</th>
              <td>{tour.agent_id}</td>
            </tr> */}
          </tbody>
        </table>
      </div>

      <h3>Day Wise Tour Details</h3>
      {Object.entries(tour.dayDetails).map(([day, details]) => (
        <div key={day} className="day-details">
          <h4>Day {parseInt(day) + 1}</h4>
          <table className="day-info-table">
            <tbody>
              {details.transportation.enabled && (
                <React.Fragment>
                  <tr>
                    <th colSpan="2">Transportation</th>
                  </tr>
                  <tr>
                    <td><strong>Type:</strong></td>
                    <td>{details.transportation.data.transportation_type}</td>
                  </tr>
                  <tr>
                    <td><strong>Company:</strong></td>
                    <td>{details.transportation.data.company}</td>
                  </tr>
                  <tr>
                    <td><strong>Departure:</strong></td>
                    <td>{details.transportation.data.departureLocation} at {new Date(details.transportation.data.departureDateTime).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Arrival:</strong></td>
                    <td>{details.transportation.data.arrivalLocation} at {new Date(details.transportation.data.arrivalDateTime).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Description:</strong></td>
                    <td>
                      <ul style={{ paddingLeft: '20px' }}>
                        {getDescriptionList(details.transportation.data.description)}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Price:</strong></td>
                    <td>₹{details.transportation.data.price}</td>
                  </tr>
                </React.Fragment>
              )}
              {details.destination.enabled && (
                <React.Fragment>
                  <tr>
                    <th colSpan="2">Destination Details</th>
                  </tr>
                  <tr>
                    <td><strong>City:</strong></td>
                    <td>{details.destination.data.city}</td>
                  </tr>
                  <tr>
                    <td><strong>State:</strong></td>
                    <td>{details.destination.data.state}</td>
                  </tr>
                  <tr>
                    <td><strong>ZIP Code:</strong></td>
                    <td>{details.destination.data.zipCode}</td>
                  </tr>
                  <tr>
                    <td><strong>Street Name:</strong></td>
                    <td>{details.destination.data.streetName}</td>
                  </tr>
                  <tr>
                    <td><strong>Description:</strong></td>
                    <td>
                      <ul style={{ paddingLeft: '20px' }}>
                        {getDescriptionList(details.destination.data.description)}
                      </ul>
                    </td>
                  </tr>
                </React.Fragment>
              )}
              {details.accommodation.enabled && (
                <React.Fragment>
                  <tr>
                    <th colSpan="2">Accommodation</th>
                  </tr>
                  <tr>
                    <td><strong>Hotel Name:</strong></td>
                    <td>{details.accommodation.data.hotelName}</td>
                  </tr>
                  <tr>
                    <td><strong>Check-in:</strong></td>
                    <td>{new Date(details.accommodation.data.checkin).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Check-out:</strong></td>
                    <td>{new Date(details.accommodation.data.checkout).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td><strong>Description:</strong></td>
                    <td>
                      <ul style={{ paddingLeft: '20px' }}>
                        {getDescriptionList(details.accommodation.data.description)}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Map Location:</strong></td>
                    <td>
                      <a href={details.accommodation.data.location} target="_blank" rel="noopener noreferrer">
                        View on Map
                      </a>
                    </td>
                  </tr>
                </React.Fragment>
              )}
              {details.activities.enabled && (
                <React.Fragment>
                  <tr>
                    <th colSpan="2">Activities</th>
                  </tr>
                  <tr>
                    <td><strong>Title:</strong></td>
                    <td>{details.activities.data.title}</td>
                  </tr>
                  <tr>
                    <td><strong>Type:</strong></td>
                    <td>{details.activities.data.type}</td>
                  </tr>
                  <tr>
                    <td><strong>Places Covered:</strong></td>
                    <td>{details.activities.data.placesCovered}</td>
                  </tr>
                  <tr>
                    <td><strong>Description:</strong></td>
                    <td>
                      <ul style={{ paddingLeft: '20px' }}>
                        {getDescriptionList(details.activities.data.description)}
                      </ul>
                    </td>
                  </tr>                              <tr>
                    <td><strong>Map Location:</strong></td>
                    <td>
                      <a href={details.activities.data.location} target="_blank" rel="noopener noreferrer">
                        View on Map
                      </a>
                    </td>
                  </tr>            </React.Fragment>
              )}
            </tbody>
          </table>
        </div>
      ))}

       {/* Contact Details Section */}
       <h3>Agent Contact Details</h3>
      {agentDetails ? (
        <table className="tour-info-table">
          <tbody>
            <tr>
              <th>Agent Name:</th>
              <td>{agentDetails.name}</td>
            </tr>
            <tr>
              <th>Agent Email:</th>
              <td>{agentDetails.email}</td>
            </tr>
            <tr>
              <th>Agent Phone Number:</th>
              <td>{agentDetails.phoneNumber}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading contact details...</p>
      )}

      <button className="view-button" onClick={handleBackButtonClick}>Back</button>
    </div>
  );
};

export default ViewTourDetails;


