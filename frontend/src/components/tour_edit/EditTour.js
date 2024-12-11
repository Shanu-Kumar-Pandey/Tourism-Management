import React, { useState, useEffect, useRef } from "react";
import EditTransportation from "./EditTransportation";
import EditDestination from "./EditDestination";
import EditAccommodation from "./EditAccommodation";
import EditActivities from "./EditActivities";
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from '../../firebase';
import { v4 as uuidv4 } from "uuid";
import "./EditTour.css";

function EditTour() {
    const navigate = useNavigate();
    const { tourId } = useParams();
    const fileInputRef = useRef(null);

    const [basicInfo, setBasicInfo] = useState({
        destinationTitle: "",
        packageName: "",
        state: "",
        city: "",
        address: "",
        description: "",
        capacity: "",
        coverImage: "",
        price: ""
    });
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [nights, setNights] = useState(0);
    const [days, setDays] = useState(0);
    const [dayDetails, setDayDetails] = useState({});
    const [selectedDay, setSelectedDay] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
        const fetchTourData = async () => {
            try {
                const token = Cookies.get('token');
                const response = await fetch(`http://localhost:5000/tours/${tourId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const tourData = await response.json();
                    setBasicInfo({
                        destinationTitle: tourData.destinationTitle || "",
                        packageName: tourData.packageName || "",
                        state: tourData.state || "",
                        city: tourData.city || "",
                        address: tourData.address || "",
                        description: tourData.description || "",
                        capacity: tourData.capacity || "",
                        coverImage: tourData.coverImage || "",
                        price: tourData.price || "",
                    });
                    setDepartureDate(tourData.departureDate || "");
                    setReturnDate(tourData.returnDate || "");
                    setDays(tourData.days || 0);
                    setNights(tourData.nights || 0);
                    setDayDetails(tourData.dayDetails || {});
                } else {
                    alert("Failed to fetch tour data.");
                }
            } catch (error) {
                console.error("Error fetching tour data:", error);
            }
        };

        fetchTourData();
    }, [tourId]);

    const handleBasicInfoChange = (field, value) => {
        setBasicInfo(prevInfo => ({
            ...prevInfo,
            [field]: value
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
                null,
                (error) => {
                    console.error("Upload failed", error);
                    setUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    setBasicInfo(prevInfo => ({
                        ...prevInfo,
                        coverImage: downloadURL,
                    }));
                    setUploading(false);
                    setUploadSuccess(true);
                }
            );
        }
    };

    const handleRemoveImage = async (event) => {
        event.preventDefault();
        if (basicInfo.coverImage) {
            try {
                const imageUrl = basicInfo.coverImage;
                const fileName = imageUrl.split('%2F')[1].split('?')[0];
                const imageRef = ref(storage, `coverImages/${fileName}`);
                await deleteObject(imageRef);

                setBasicInfo(prevInfo => ({ ...prevInfo, coverImage: "" }));
                setUploadSuccess(false);
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
            // Initialize the day details or use existing ones from fetched data
            newDayDetails[i] = dayDetails[i] || {
                transportation: { enabled: false, data: {} },
                destination: { enabled: false, data: {} },
                accommodation: { enabled: false, data: {} },
                activities: { enabled: false, data: {} },
            };
        }
        setDayDetails(newDayDetails);
    };

    const handleDateChange = (setter, value) => {
        setter(value);
        if (departureDate && returnDate) {
            calculateDaysAndNights(departureDate, returnDate);
        }
    };

    const handleDayClick = (index) => {
        setSelectedDay(index);
    };

    const handleDayDetailsChange = (dayIndex, section, field, value) => {
        setDayDetails(prevDetails => ({
            ...prevDetails,
            [dayIndex]: {
                ...prevDetails[dayIndex],
                [section]: {
                    ...prevDetails[dayIndex][section],
                    data: {
                        ...prevDetails[dayIndex][section]?.data,
                        [field]: value
                    }
                }
            }
        }));
    };


    const handleSubmit = async () => {
        const tourData = {
            ...basicInfo,
            departureDate,
            returnDate,
            days,
            nights,
            dayDetails,
        };

        try {
            const token = Cookies.get('token');
            const response = await fetch(`http://localhost:5000/tours/${tourId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(tourData),
            });

            if (response.ok) {
                alert("Tour successfully updated!");
                navigate('/tour');
            } else {
                alert("Failed to update tour.");
            }
        } catch (error) {
            console.error("Error updating tour:", error);
        }
    };

    return (
        <div className="edit-tour-container">
            <h2>Edit Tour</h2>

            <form className="tour-form">
                <div className="form-section">
                    <h3>Basic Info</h3>
                    <div className="form-grid">
                        <div>
                            <label>Destination Title</label>
                            <input
                                type="text"
                                placeholder="Title"
                                value={basicInfo.destinationTitle}
                                onChange={(e) => handleBasicInfoChange("destinationTitle", e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Package Name</label>
                            <input
                                type="text"
                                placeholder="Package Name"
                                value={basicInfo.packageName}
                                onChange={(e) => handleBasicInfoChange("packageName", e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Country</label>
                            <input
                                type="text"
                                placeholder="country"
                                disabled
                                value={"india"}
                                onChange={(e) => handleBasicInfoChange("country", e.target.value)}
                            />
                        </div>
                        <div>
                            <label>State</label>
                            <input
                                type="text"
                                placeholder="State"
                                value={basicInfo.state}
                                onChange={(e) => handleBasicInfoChange("state", e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Departure City</label>
                            <input
                                type="text"
                                placeholder="Departure City"
                                value={basicInfo.city}
                                onChange={(e) => handleBasicInfoChange("city", e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Destination Address</label>
                            <input
                                type="text"
                                placeholder="Address"
                                value={basicInfo.address}
                                onChange={(e) => handleBasicInfoChange("address", e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea
                                placeholder="Description"
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
                            <label>Departure Date</label>
                            <input
                                type="datetime-local"
                                value={departureDate}
                                onChange={(e) => handleDateChange(setDepartureDate, e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Return Date</label>
                            <input
                                type="datetime-local"
                                value={returnDate}
                                onChange={(e) => handleDateChange(setReturnDate, e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Price</label>
                            <input
                                type="number"
                                placeholder="Price"
                                value={basicInfo.price}
                                onChange={(e) => handleBasicInfoChange("price", e.target.value)}
                            />
                        </div>
                    </div>
                </div>


                {/* Image Upload Section */}
                <div >
                    <label>Cover Image</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                    />
                    {uploading && <div className="loader" />}
                    {uploadSuccess && (
                        <div className="file-info">
                            <span className="success-tick">✔️</span>
                            <button className="remove-button" onClick={handleRemoveImage}>Remove</button>
                        </div>
                    )}
                    {basicInfo.coverImage && !uploading && !uploadSuccess && (
                        <div className="file-info">
                            <span className="filename">{basicInfo.coverImage.split('/').pop().split('?')[0]}</span>
                            <button className="remove-button" onClick={handleRemoveImage}>Remove</button>
                        </div>
                    )}
                </div>


                {/* Day Selector Section */}

                <div className="day-selector-section">
                    <h3>Day Selector</h3>
                    <div className="days-list">
                        {Array.from({ length: days }, (_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`day-button ${selectedDay === index ? 'selected-day' : ''}`}
                                onClick={() => handleDayClick(index)}
                            >
                                Day {index + 1}
                            </button>
                        ))}
                    </div>

                    {/* Day Details Section */}
                    {selectedDay >= 0 && dayDetails[selectedDay] && (
                        <div className="day-detail-section">
                            <h4>Details for Day {selectedDay + 1}</h4>

                            <EditTransportation
                                dayDetails={dayDetails[selectedDay]?.transportation}
                                onChange={(field, value) =>
                                    handleDayDetailsChange(selectedDay, 'transportation', field, value)
                                }
                            />
                            <EditDestination
                                dayDetails={dayDetails[selectedDay]?.destination}
                                onChange={(field, value) =>
                                    handleDayDetailsChange(selectedDay, 'destination', field, value)
                                }
                            />

                            <EditAccommodation
                                dayDetails={dayDetails[selectedDay]?.accommodation}
                                onChange={(field, value) =>
                                    handleDayDetailsChange(selectedDay, 'accommodation', field, value)
                                }
                            />

                            <EditActivities
                                dayDetails={dayDetails[selectedDay]?.activities}
                                onChange={(field, value) =>
                                    handleDayDetailsChange(selectedDay, 'activities', field, value)
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="submit-button-container">
                    <button
                        type="button"
                        className="submit-button"
                        onClick={handleSubmit}
                    >
                        Update Tour
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditTour;
