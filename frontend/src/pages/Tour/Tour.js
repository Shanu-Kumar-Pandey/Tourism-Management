import React, { useState, useEffect } from 'react';
import './Tour.css';
import { NavLink, useNavigate } from 'react-router-dom';  // Import useNavigate
import { FaPlusCircle, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Cookies from 'js-cookie';

function Tour() {
    const [tours, setTours] = useState([]);
    const navigate = useNavigate();  // Initialize useNavigate

    useEffect(() => {
        const fetchTours = async () => {
            const token = Cookies.get('token');

            try {
                const response = await fetch('http://localhost:5000/tour', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tours');
                }

                const data = await response.json();
                setTours(data);
            } catch (error) {
                console.error('Error fetching tours:', error);
            }
        };

        fetchTours();
    }, []);

    // Updated handleEdit to navigate to EditTour component
    const handleEdit = (id) => {
        navigate(`/edit-tour/${id}`);
    };

    const handleDelete = async (id) => {
        const token = Cookies.get('token');

        try {
            const response = await fetch(`http://localhost:5000/tour/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete tour');
            }

            // Remove the deleted tour from the state
            setTours(tours.filter(tour => tour._id !== id));
        } catch (error) {
            console.error('Error deleting tour:', error);
        }
    };

    return (
        <div className="tour-page">
            <div className="tour-content">
                <div className="tour-nav">
                    <NavLink to="/add-tour">
                        <button>
                            <FaPlusCircle className="icon" /> Add Tour
                        </button>
                    </NavLink>
                </div>

                <div className='tour-list'>
                    {tours.map((tour) => (
                        // <div key={tour._id} className="tour-card">
                        //     <img src={tour.coverImage} alt={tour.title} className="tour-cover" />
                        //     <div className="tour-actions">
                        //         {/* <FaEye size={20} className="action-icon" onClick={() => handleEdit(tour._id)} /> */}
                        //         <FaEdit size={18} className="action-icon" onClick={() => handleEdit(tour._id)} />
                        //         <FaTrash className="action-icon" onClick={() => handleDelete(tour._id)} />
                        //     </div>


                        // </div>
                        <div className="tour-card">
                            <img src={tour.coverImage} alt={tour.title} className="tour-cover" />

                            {/* Package Name Overlay */}
                            <div className="package-name-overlay">{tour.packageName}</div>

                            <div className="tour-actions">
                                <FaEdit size={18} className="action-icon" onClick={() => handleEdit(tour._id)} />
                                <FaTrash className="action-icon" onClick={() => handleDelete(tour._id)} />
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
}

export default Tour;
