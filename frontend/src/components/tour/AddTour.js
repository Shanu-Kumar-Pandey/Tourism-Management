import React, { useState, useEffect, useRef } from "react";
import AddTransportation from "./AddTransportation";
import AddDestination from "./AddDestination";
import AddAccommodation from "./AddAccommodation";
import AddActivities from "./AddActivities";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../../firebase';
import { v4 as uuidv4 } from "uuid";

import "./AddTour.css";

function AddTour() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [nights, setNights] = useState(0);
  const [days, setDays] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [dayDetails, setDayDetails] = useState({});
  const [imageName, setImageName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [basicInfo, setBasicInfo] = useState({
    destinationTitle: "",
    packageName: "",
    state: "",
    city: "",
    address: "",
    description: "",
    capacity:"",
    coverImage: "",
    price: ""

  });

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo((prevInfo) => ({
      ...prevInfo,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = `${Date.now()}-${uuidv4()}`;
      const storageRef = ref(storage, `coverImages/${fileName}`);

      setUploading(true);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Optional: Handle upload progress here
        },
        (error) => {
          console.error("Upload failed", error);
          setUploading(false);
          // if (fileInputRef.current) fileInputRef.current.value = "";
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setBasicInfo((prevInfo) => ({
              ...prevInfo,
              coverImage: downloadURL,
            }));
            setUploading(false);
            setUploadSuccess(true);
            // if (fileInputRef.current) fileInputRef.current.value = "";
          });
        }
      );
    }
  };

  const handleRemoveImage = async (event) => {
    event.preventDefault();

    if (basicInfo.coverImage) {
      try {
        // Extract the image path from the URL
        const imageUrl = basicInfo.coverImage;
        const fileName = imageUrl.split('%2F')[1].split('?')[0]; // Extract the filename correctly
        const imageRef = ref(storage, `coverImages/${fileName}`); // Reference the correct path

        // Delete the file from Firebase storage
        await deleteObject(imageRef);

        // Clear the image URL and name from state
        setImageURL("");
        setImageName("");
        setBasicInfo((prevInfo) => ({
          ...prevInfo,
          coverImage: "",
        }));

        // Reset the success and uploading state
        setUploadSuccess(false);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";

      } catch (error) {
        console.error("Error removing image:", error);
      }
    }
  };



  const calculateDaysAndNights = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate - startDate;
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalNights = Math.max(0, totalDays - 1);

    setDays(totalDays);
    setNights(totalNights);

    const newDayDetails = {};
    for (let i = 0; i < totalDays; i++) {
      newDayDetails[i] = {
        transportation: { enabled: false, data: {} },
        destination: { enabled: false, data: {} },
        accommodation: { enabled: false, data: {} },
        activities: { enabled: false, data: {} },
      };
    }
    setDayDetails(newDayDetails);
  };

  const handleDepartureChange = (e) => {
    setDepartureDate(e.target.value);
    setReturnDate("");
    if (returnDate) {
      calculateDaysAndNights(e.target.value, returnDate);
    }

  };

  const handleReturnChange = (e) => {
    setReturnDate(e.target.value);
    if (departureDate) {
      calculateDaysAndNights(departureDate, e.target.value);
    }
  };

  const handleDayClick = (index) => {
    setSelectedDay(index);
  };

  const handleCheckboxChange = (event, field) => {
    setDayDetails((prevDetails) => ({
      ...prevDetails,
      [selectedDay]: {
        ...prevDetails[selectedDay],
        [field]: {
          ...prevDetails[selectedDay][field],
          enabled: event.target.checked,
        },
      },
    }));
  };

  const handleFormDataChange = (field, subField, value) => {
    setDayDetails((prevDetails) => ({
      ...prevDetails,
      [selectedDay]: {
        ...prevDetails[selectedDay],
        [field]: {
          ...prevDetails[selectedDay][field],
          data: {
            ...prevDetails[selectedDay][field].data,
            [subField]: subField === "images" ? value : value,
          },
        },
      },
    }));
  };

  useEffect(() => {
    if (days > 0) {
      setSelectedDay(0);
    }
  }, [days]);



  const getTomorrowDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); 
    return today.toISOString().slice(0, 16); 
  };

  const getMinReturnDate = () => {
    if (!departureDate) return getTomorrowDate(); // If no departure date, default to tomorrow
    const departure = new Date(departureDate);
    departure.setDate(departure.getDate() + 0);
    return departure.toISOString().slice(0, 16);
  };

    //sumit button function
  const handleSubmit = async () => {
    const tourData = {
      ...basicInfo,
      departureDate,
      returnDate,
      days,
      nights,
      dayDetails,
    };


    console.log("data", tourData);

    try {
      const token = Cookies.get('token');
      const response = await fetch("http://localhost:5000/add-tour", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tourData),
      });

      if (response.ok) {
        alert("Tour successfully added!");
        navigate('/tour');
      } else {
        alert("Failed to add tour.");
      }
    } catch (error) {
      console.error("Error adding tour:", error);
    }
  };

  return (
    <div className="add-tour-container">
      <h2>Add Tour</h2>
      <form className="tour-form">
        <div className="form-section">
          <h3>Basic Info</h3>
          <div className="form-grid">
            <div>
              <label>Destination Title</label>
              <input type="text" placeholder="Title" value={basicInfo.destinationTitle} onChange={(e) => handleBasicInfoChange("destinationTitle", e.target.value)} />
            </div>
            <div>
              <label>Package Name</label>
              <input type="text" placeholder="Package Name" value={basicInfo.packageName}
                onChange={(e) => handleBasicInfoChange("packageName", e.target.value)} />
            </div>
            <div>
              <label>Country</label>
              <input type="text" placeholder="India" disabled />
            </div>
            <div>
              <label>State</label>
              <input type="text" placeholder="State" value={basicInfo.state}
                onChange={(e) => handleBasicInfoChange("state", e.target.value)} />
            </div>
            <div>
              <label>City</label>
              <input type="text" placeholder="Departure City" value={basicInfo.city}
                onChange={(e) => handleBasicInfoChange("city", e.target.value)} />
            </div>
            <div>
              <label>Destination Address</label>
              <input type="text" placeholder="Address" value={basicInfo.address}
                onChange={(e) => handleBasicInfoChange("address", e.target.value)} />
            </div>
            <div >
              <label>Description</label>
              <textarea
                placeholder="Add your description here"
                value={basicInfo.description}
                onChange={(e) => handleBasicInfoChange("description", e.target.value)}
              />
            </div>

            <div>
              <label>Total Capacity</label>
              <input
                type="number"
                placeholder="Total Capacity"
                value={basicInfo.capacity}
                onChange={(e) => handleBasicInfoChange("capacity", e.target.value)}
              />
            </div>

            <div>
              <label>Departure</label>
              <input
                type="datetime-local"
                value={departureDate}
                onChange={handleDepartureChange}
                min={getTomorrowDate()}
              />
            </div>
            <div>
              <label>Return</label>
              <input
                type="datetime-local"
                value={returnDate}
                onChange={handleReturnChange}
                min={getMinReturnDate()} 
                disabled={!departureDate}
              />
            </div>
            <div>
              <label>Cover Image</label>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              <div className="file-info">
                {uploading && <span className="loader"></span>}
                {uploadSuccess && (
                  <>
                    <span className="success-tick">✔</span>

                    <div className="remove-btn"><button
                      type="button" onClick={handleRemoveImage}
                      className="remove-button"
                    >
                      Remove
                    </button></div>
                  </>
                )}
              </div>


            </div>

            <div>
              <label>Price (₹)</label>
              <input type="number" placeholder="Price" value={basicInfo.price}
                onChange={(e) => handleBasicInfoChange("price", e.target.value)} />
            </div>
          </div>
        </div>
        {days > 0 && (
          <div className="days-nights-info">
            <p>
              {days} Days & {nights} Nights
            </p>
          </div>
        )}


      </form>

      {days > 0 && (
        <div className="day-selector-section">
          <div className="days-list">
            {Array.from({ length: days }, (_, index) => (
              <button
                key={index}
                className={`day-button ${selectedDay === index ? "selected-day" : ""
                  }`}
                onClick={() => handleDayClick(index)}
              >
                Day {index + 1}
              </button>
            ))}
          </div>

          {selectedDay !== null && (
            <div className="day-detail-section">
              <h4>Details for Day {selectedDay + 1}</h4>

              <div className="detail-toggle-section">
                {/* Transportation Toggle */}
                <div className="toggle-container">
                  <div className="toggle-header">
                    <label>Transportation Details</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={dayDetails[selectedDay]?.transportation?.enabled || false}
                        onChange={(e) => handleCheckboxChange(e, "transportation")}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  {dayDetails[selectedDay]?.transportation?.enabled && (
                    <AddTransportation
                      data={dayDetails[selectedDay]?.transportation?.data || {}}
                      onChange={(subField, value) =>
                        handleFormDataChange("transportation", subField, value)
                      }
                    />
                  )}
                </div>

                {/* Destination Toggle */}
                <div className="toggle-container">
                  <div className="toggle-header">
                    <label>Destination Details</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={dayDetails[selectedDay]?.destination?.enabled || false}
                        onChange={(e) => handleCheckboxChange(e, "destination")}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  {dayDetails[selectedDay]?.destination?.enabled && (
                    <AddDestination
                      data={dayDetails[selectedDay]?.destination?.data || {}}
                      onChange={(subField, value) =>
                        handleFormDataChange("destination", subField, value)
                      }
                    />
                  )}
                </div>

                {/* Accommodation Toggle */}
                <div className="toggle-container">
                  <div className="toggle-header">
                    <label>Accommodation Details</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={dayDetails[selectedDay]?.accommodation?.enabled || false}
                        onChange={(e) => handleCheckboxChange(e, "accommodation")}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  {dayDetails[selectedDay]?.accommodation?.enabled && (
                    <AddAccommodation
                      data={dayDetails[selectedDay]?.accommodation?.data || {}}
                      onChange={(subField, value) =>
                        handleFormDataChange("accommodation", subField, value)
                      }
                    />
                  )}
                </div>

                {/* Activities Toggle */}
                <div className="toggle-container">
                  <div className="toggle-header">
                    <label>Activities</label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={dayDetails[selectedDay]?.activities?.enabled || false}
                        onChange={(e) => handleCheckboxChange(e, "activities")}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  {dayDetails[selectedDay]?.activities?.enabled && (
                    <AddActivities
                      data={dayDetails[selectedDay]?.activities?.data || {}}
                      onChange={(subField, value) =>
                        handleFormDataChange("activities", subField, value)
                      }
                    />
                  )}
                </div>
                <div className="submit-button-container">
                  <button onClick={handleSubmit} className="submit-button">
                    Submit Tour
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AddTour;

