import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onFilter }) => {
  const [fromselectCity, setFromselectCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [maxDays, setMaxDays] = useState('');
  const [maxNights, setMaxNights] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // New state for filter application
  const [filterApplied, setFilterApplied] = useState(false);

  const handlefromCity = (e) => {
    setFromselectCity(e.target.value);
  };
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handlePriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleDaysChange = (e) => {
    setMaxDays(e.target.value);
  };

  const handleNightsChange = (e) => {
    setMaxNights(e.target.value);
  };

  const handleDateChange = (e, type) => {
    type === 'start' ? setStartDate(e.target.value) : setEndDate(e.target.value);
  };

  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Increment the date by one
    return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };


  // const getMinReturnDate = () => {
  //   if (!departureDate) return getTomorrowDate(); // If no departure date, default to tomorrow
  //   const departure = new Date(departureDate);
  //   departure.setDate(departure.getDate() + 0);
  //   return departure.toISOString().slice(0, 16);
  // };

  const getMinToDate = () => {
    if (!startDate) return getTomorrowDate(); // Default to tomorrow if no start date
    const nextDay = new Date(startDate);
    nextDay.setDate(nextDay.getDate() + 1); // Add one day to the start date
    return nextDay.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };


  const applyFilters = () => {
    setFilterApplied(true);
    onFilter(fromselectCity,selectedCity, maxPrice, maxDays, maxNights, startDate, endDate);
  };

  const clearFilters = () => {
    setFromselectCity('');
    setSelectedCity('');
    setMaxPrice(10000);
    setMaxDays('');
    setMaxNights('');
    setStartDate('');
    setEndDate('');
    setFilterApplied(false);
    onFilter('','', 10000, '', '', '', '');
  };

  return (
    <div className="sidebar">
      <h3>Filters</h3>

    

      {/* City Filter */}

      <div className="filter-section">
        <h4>From City</h4>
        <select value={selectedCity} onChange={handleCityChange} className="filter-select">
          <option value="">All</option>
          <option value="Ahmedabad">Ahmedabad</option>
          <option value="Jaisalmer">Jaisalmer</option>
          <option value="Goa">Goa</option>
          <option value="Jaipur">Jaipur</option>
          <option value="Sirohi">Sirohi</option>
        </select>
      </div>

      <div className="filter-section">
        <h4>To City</h4>
        <select value={fromselectCity} onChange={handlefromCity} className="filter-select">
        <option value="">All</option>
          <option value="Manali">Manali</option>
          <option value="Ahmedabad">Ahmedabad</option>
          <option value="Jaisalmer">Jaisalmer</option>
          <option value="Goa">Goa</option>
          <option value="Jaipur">Jaipur</option>
          <option value="Sirohi">Sirohi</option>
        </select>
      </div>




      {/* Price Range Filter */}
      <div className="filter-section">
        <h4>Price</h4>
        <div className="slider-container">
          <label>Up to: ₹{maxPrice}</label>
          <input type="range" min="1000" max="50000" value={maxPrice} onChange={handlePriceChange} className="price-slider" />
        </div>
      </div>

      {/* Date Filter */}
      <div className="filter-section">
        <h4>Date Range</h4>
        From
        <input type="date" value={startDate} min={getTomorrowDate()} onChange={(e) => handleDateChange(e, 'start')} />
        To
        <input type="date" value={endDate} 
         min={getMinToDate()} 
         
        onChange={(e) => handleDateChange(e, 'end')} />
      </div>

      {/* Days and Nights Filter */}
      <div className="filter-section">
        <h4>Days & Nights</h4>
        <div className="days-nights-input">
          <label> Days </label>
          <input type="number" placeholder="Days" value={maxDays} onChange={handleDaysChange} />
          <label>Nights</label>
          <input type="number" placeholder="Nights" value={maxNights} onChange={handleNightsChange} />
        </div>
        <div className="filter-buttons">
          <button onClick={applyFilters} className="apply-button-">Apply</button>
          <button onClick={clearFilters} className="clear-button-">Clear</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
