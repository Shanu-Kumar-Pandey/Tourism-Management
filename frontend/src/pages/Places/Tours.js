import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/places/SearchBar';
import Sidebar from '../../components/places/Sidebar';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Tours.css';

const Tours = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [query, setQuery] = useState('');
  

  const [fromselectCity, setFromselectCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [maxDays, setMaxDays] = useState('');
  const [maxNights, setMaxNights] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tours, setTours] = useState([]);

  useEffect(() => {
    // Fetch user ID from token stored in cookie
    const token = Cookies.get('token'); // Replace 'token' with your cookie name

    if (token) {
      try {
        // Decode the JWT payload to get user information
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserId(decodedToken.id); 
      } catch (error) {
        console.error('Error decoding token:', error);
        alert('Session expired or invalid token. Please log in again.');
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('http://localhost:5000/all-tours');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTours(data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    fetchTours();
  }, []);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery.toLowerCase());
  };

  const handleFilter = (frcity,city, price, days, nights, start, end) => {


    setFromselectCity(frcity);
    setSelectedCity(city);
    setMaxPrice(price);
    setMaxDays(days);
    setMaxNights(nights);
    setStartDate(start);
    setEndDate(end);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const filteredTours = tours.filter((tour) => {
    const departureLocation = tour.dayDetails?.[0]?.destination?.data?.city || '';
    const matchesFrcity = fromselectCity === '' || departureLocation === fromselectCity;
    const matchesCity = selectedCity === '' || tour.city === selectedCity;
    const matchesPrice = tour.price <= maxPrice;
    const matchesQuery =
      tour.packageName.toLowerCase().includes(query) || tour.city.toLowerCase().includes(query)  || departureLocation.toLowerCase().includes(query);

    const tourStartDate = new Date(tour.departureDate);
    const tourEndDate = new Date(tour.returnDate);
    const filterStartDate = new Date(startDate);
    const filterEndDate = new Date(endDate);

    const matchesDateRange =
      (startDate === '' || tourStartDate >= filterStartDate) &&
      (endDate === '' || tourEndDate <= filterEndDate);

    const matchesDays = maxDays === '' || tour.days <= parseInt(maxDays);
    const matchesNights = maxNights === '' || tour.nights <= parseInt(maxNights);

    return matchesFrcity && matchesCity && matchesPrice && matchesQuery && matchesDateRange && matchesDays && matchesNights;
  });

  const handleViewTour = (tour) => {
    navigate('/viewToursDetails', { state: { tour } });
  };

  const handleBookTour = (tour) => {
    const token = Cookies.get('token'); // Retrieve the token from cookies
    if (!token) {
      alert('Please log in to book a tour.');
      navigate('/login');
    } else {
      navigate('/booking', { state: { tourId: tour._id, userId, pricePerPerson: tour.price } });
    }
  };

  return (
    <div className="tours-page">
      <Sidebar onFilter={handleFilter} />
      <div className="tours-right-content">
        <SearchBar onSearch={handleSearch} />
        <div className="tours-container">
          <div className="tours-cards">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <div key={tour._id} className="tour-card-id">
                  <img src={tour.coverImage} alt={tour.packageName} className="tour-image" />
                  <div className="tour-info">
                    <h3>{tour.packageName}</h3>
                    <p>{tour.city} - {tour.dayDetails?.[0]?.destination?.data?.city || ''}</p>
                    <p className="tour-price">Per Person: ₹{tour.price}</p>
                    <div className="tour-dates">
                      <span className="tour-start-end">
                        {formatDate(tour.departureDate)} to {formatDate(tour.returnDate)}
                      </span>
                      <span className="tour-days-nights">{tour.days} Days | {tour.nights} Nights</span>
                    </div>
                    <div className="tour-dates">
                      {/* <span className="tour-start-end">Seats Available: {tour.capacity}</span> */}
                    </div>
                    <div className="tour-buttons">
                      <button className="view-button" onClick={() => handleViewTour(tour)}>View Tour</button>
                      <button className="book-button" onClick={() => handleBookTour(tour)}>Book Tour</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No tours found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tours;
