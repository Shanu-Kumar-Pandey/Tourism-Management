import React, { useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import './UserControl.css';

function UserControl() {
    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(''); // State to handle error messages

    useEffect(() => {
        // Fetch user data excluding admins
        const token = Cookies.get('token');
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

        if (!token) {
            // If no token, set access denied message
            setErrorMessage('Access denied. Please log in.');
            return;
        }

        if (!user || user.role !== 'admin') {
            // If no user or the role is not admin, set access denied message
            setErrorMessage('Access denied. Only admins can view this resource.');
            return;
        }
        
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/all-users');
                setData(response.data);
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    // If the response status is 403, set an access denied message
                    setErrorMessage('Access denied. Only admins can view this resource.');
                } else {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchData();
    }, []);

    // Toggle user status (active/deactive)
    const toggleUserStatus = async (userId, status) => {
        try {
            const response = await axios.put(`http://localhost:5000/all-users/${userId}/toggle-status`);
            alert(response.data.message);
            // Update the data after toggling
            setData((prevData) =>
                prevData.map((user) =>
                    user._id === userId ? { ...user, status: user.status === 'active' ? 'deactive' : 'active' } : user
                )
            );
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const columns = [
        { accessorKey: '_id', header: 'ID' },
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'role', header: 'Role' },
        { accessorKey: 'status', header: 'Status' },
        {
            id: 'action',
            header: 'Action',
            Cell: ({ row }) => (
                <Button
                    variant="contained"
                    color={row.original.status === 'active' ? 'warning' : 'primary'}
                    onClick={() => toggleUserStatus(row.original._id, row.original.status)}
                >
                    {row.original.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
            ),
        },
    ];

    return (
        <div className="UserControl-div">
            {errorMessage ? (
                // Display error message if access is denied
                <Typography variant="h6" color="error">
                    {errorMessage}
                </Typography>
            ) : (
                <>
                    <Typography variant="h5">User Control</Typography>
                    <MaterialReactTable columns={columns} data={data} />
                </>
            )}
        </div>
    );
}

export default UserControl;
