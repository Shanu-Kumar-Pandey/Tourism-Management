
import React, { useEffect, useState } from 'react';
import './Favorites.css';
import {
    MaterialReactTable,
    useMaterialReactTable,
    createMRTColumnHelper,
} from 'material-react-table';
import {
    Email as EmailIcon,
} from '@mui/icons-material';
import { Box, Button, Typography, IconButton } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const columnHelper = createMRTColumnHelper();

const Favorites = () => {
    const [data, setData] = useState([]);
    const [role, setRole] = useState('');

    useEffect(() => {
        // Retrieve user role from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const userRole = user?.role || '';
        setRole(userRole);

        const fetchData = async () => {
            try {
                const token = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('token='))
                    ?.split('=')[1];

                if (!token) {
                    console.error("Token not found in cookies.");
                    return;
                }

                const apiUrl =
                    userRole === 'tourist'
                        ? "http://localhost:5000/bookingdata"
                        : userRole === 'agent'
                            ? "http://localhost:5000/agent-bookings"
                            : "http://localhost:5000/admin-bookings"; // Use admin-bookings for admin role

                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setData(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchData();
    }, []);

    const columns = [
        columnHelper.accessor('bookingDate', {
            header: 'Date (Time)',
            size: 40,
        }),
        ...(role === 'agent' || role === 'admin'
            ? [
                columnHelper.accessor('_id', {
                    header: 'Booking Id',
                    size: 50,
                }),
            ]
            : []),
        columnHelper.accessor('tour_id.packageName', {
            header: 'Package Name',
            size: 170,
        }),
        columnHelper.accessor('numberOfPeople', {
            header: 'Total Person',
            size: 60,
        }),
        columnHelper.accessor('status', {
            header: 'Booking Status',
            size: 60,
        }),
        columnHelper.accessor('paymentStatus', {
            header: 'Payment Status',
        }),
        role === 'agent' || role === 'admin'
            ? columnHelper.accessor('paymentMethod', {
                header: 'Payment Method',
                size: 100,
            })
            : columnHelper.accessor('notes', {
                header: 'Notes',
                size: 220,
            }),
    ];

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    const handleExportCsvRows = (rows) => {
        const rowData = rows.map((row) => ({
            ...(role === 'agent' || role === 'admin' && { 'Booking Id': row.original._id }), // Include Booking Id for agents
            'Date (Time)': row.original.bookingDate,
            'Package Name': row.original.tour_id?.packageName || '',
            'Total Person': row.original.numberOfPeople,
            'Booking Status': row.original.status,
            'Payment Status': row.original.paymentStatus,
            [role === 'agent' || role === 'admin' ? 'Payment Method' : 'Notes']:
                row.original[role === 'agent' || role === 'admin' ? 'paymentMethod' : 'notes'],
        }));

        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportPdfRows = (rows) => {
        const doc = new jsPDF();

        const tableHeaders = columns.map((c) => c.header);

        const tableData = rows.map((row) => [
            row.original.bookingDate,
            ...(role === 'agent' || role === 'admin' ? [row.original._id] : []), // Include Booking Id for agents
            row.original.tour_id?.packageName || '',
            row.original.numberOfPeople,
            row.original.status,
            row.original.paymentStatus,
            role === 'agent' || role === 'admin' ? row.original.paymentMethod : row.original.notes,
        ]);

        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
        });

        doc.save('bookings.pdf');
    };


        const handleExportDetailedPdfRows = (rows) => {
        const doc = new jsPDF();
    
        rows.forEach((row) => {
            const { 
                bookingDate, 
                numberOfPeople, 
                totalAmount, 
                passengerDetails, 
                status, 
                paymentStatus, 
                tour_id, 
                email, 
                phone 
            } = row.original;
    
            // Add basic booking details in a table format
            doc.autoTable({
                head: [['Detail', 'Information']], // Table header
                body: [
                    ['Package Name', tour_id?.packageName || ''],
                    ['Booking Date', bookingDate],
                    ['Number of People', numberOfPeople],
                    ['Total Amount', totalAmount],
                    ['Status', status],
                    ['Payment Status', paymentStatus],
                    ['Email', email],
                    ['Phone', phone],
                ],
                startY: 10, // Starting position for the table
            });
    
            // Add space before the passenger details table
            const pageHeight = doc.internal.pageSize.height;
            const currentY = doc.autoTable.previous.finalY; // Get the Y position after the first table
    
            if (currentY + 20 > pageHeight) {
                doc.addPage(); // Add a new page if necessary
            }
    
            // Add passenger details in a table
            doc.autoTable({
                head: [['Passenger', 'Name', 'Age', 'Gender']], // Table header
                body: passengerDetails.map((passenger, index) => [
                    `Passenger ${index + 1}`,
                    passenger.name,
                    passenger.age,
                    passenger.gender,
                ]),
                startY: currentY + 20, // Starting position for the passenger details table
            });
    
            doc.addPage(); // Add new page for each booking's detailed data
        });
    
        doc.save('detailed-booking-data.pdf');
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    disabled={table.getRowModel().rows.length === 0}
                    onClick={() => handleExportCsvRows(table.getRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                >
                    Export Page Rows (CSV)
                </Button>
                <Button
                    disabled={
                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                    }
                    onClick={() => handleExportCsvRows(table.getSelectedRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                >
                    Export Selected (CSV)
                </Button>
                <Button
                    disabled={table.getRowModel().rows.length === 0}
                    onClick={() => handleExportPdfRows(table.getRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                >
                    Export Page Rows (PDF)
                </Button>

               


                <Button
                    disabled={
                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                    }
                    onClick={() => handleExportPdfRows(table.getSelectedRowModel().rows)}
                    startIcon={<FileDownloadIcon />}
                >
                    Export Selected (PDF)
                </Button>

                {(role === 'agent' || role === 'admin') && (
                <Button
                    disabled={
                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                    }
                    onClick={() => handleExportDetailedPdfRows(table.getSelectedRowModel().rows)} // Functionality to be added later
                    startIcon={<FileDownloadIcon />}
                >
                    Detailed Data (PDF)
                </Button>
                )}


                
              



            </Box>
        ),
 

            ...(role === 'agent' && {
            enableRowActions: true,
            positionActionsColumn: 'last',
            displayColumnDefOptions: {
                'mrt-row-actions': {
                    header: 'Action', // Change header text
                    size: 150, // Make actions column wider
                },
            },
            renderRowActions: ({ row, table }) => (
                <Box>
                    <Button
                        onClick={() =>
                            window.open(
                                `https://mail.google.com/mail/?view=cm&fs=1&to=${row.original.email}&su=Tour Details ${row.original.tour_id?.packageName}&body=Here are your tour details!`
                            )
                        }
                        startIcon={<EmailIcon />}
                    >
                        Send Ticket
                    </Button>
                </Box>
            ),
        }),
    });


    return (
        <div>
            {role === 'tourist' ? (
                <MaterialReactTable table={table} />
            ) : role === 'agent' || role === 'admin' ? (
                <MaterialReactTable table={table} />
            ) : (
                <Typography variant="h6">Loading...</Typography>
            )}
        </div>
    );
};

export default Favorites;

// import React, { useEffect, useState } from 'react';
// import './Favorites.css';
// import {

//     Email as EmailIcon,
// } from '@mui/icons-material';
// import {
//     MaterialReactTable,
//     useMaterialReactTable,
//     createMRTColumnHelper,
// } from 'material-react-table';
// import { Box, Button, Typography, IconButton } from '@mui/material';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import { mkConfig, generateCsv, download } from 'export-to-csv';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import axios from 'axios';

// const columnHelper = createMRTColumnHelper();

// const Favorites = () => {
//     const [data, setData] = useState([]);
//     const [role, setRole] = useState('');

//     useEffect(() => {
//         // Retrieve user role from localStorage
//         const user = JSON.parse(localStorage.getItem('user')); // Assuming 'user' contains the role
//         const userRole = user?.role || ''; // Get role from the user object
//         setRole(userRole);

//         const fetchData = async () => {
//             try {
//                 const token = document.cookie
//                     .split('; ')
//                     .find((row) => row.startsWith('token='))
//                     ?.split('=')[1];

//                 if (!token) {
//                     console.error("Token not found in cookies.");
//                     return;
//                 }

//                 console.log("Token fetched from cookies:", token);

//                 const apiUrl =
//                     userRole === 'tourist'
//                         ? "http://localhost:5000/bookingdata"
//                         : "http://localhost:5000/agent-bookings";

//                 const response = await axios.get(apiUrl, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 console.log("API response data:", response.data);
//                 setData(response.data);
//             } catch (error) {
//                 console.error('Error fetching bookings:', error);
//             }
//         };

//         fetchData();
//     }, []);


//     const columns = [

//         columnHelper.accessor('bookingDate', {
//             header: 'Date (Time)',
//             size: 40,
//         }),

//         ...(role === 'agent'
//             ? [
//                 columnHelper.accessor('_id', {
//                     header: 'Booking Id',
//                     size: 50,
//                 }),
//             ]
//             : []),

//         columnHelper.accessor('tour_id.packageName', {
//             header: 'Package Name',
//             size: 170,
//         }),


//         columnHelper.accessor('numberOfPeople', {
//             header: 'Total Person',
//             size: 60,
//         }),
//         columnHelper.accessor('status', {
//             header: 'Booking Status',
//             size: 60,
//         }),
//         columnHelper.accessor('paymentStatus', {
//             header: 'Payment Status',
//         }),
//         role === 'agent'
//             ? columnHelper.accessor('paymentMethod', {
//                 header: 'Payment Method',
//                 size: 100,
//             })
//             : columnHelper.accessor('notes', {
//                 header: 'Notes',
//                 size: 220,
//             }),




//     ]



//     const csvConfig = mkConfig({
//         fieldSeparator: ',',
//         decimalSeparator: '.',
//         useKeysAsHeaders: true,
//     });

//     const handleExportCsvRows = (rows) => {
//         const rowData = rows.map((row) => ({
//             ...(role === 'agent' && { 'Booking Id': row.original._id }), // Include Booking Id for agents
//             'Date (Time)': row.original.bookingDate,
//             'Package Name': row.original.tour_id?.packageName || '',
//             'Total Person': row.original.numberOfPeople,
//             'Booking Status': row.original.status,
//             'Payment Status': row.original.paymentStatus,
//             [role === 'agent' ? 'Payment Method' : 'Notes']:
//                 row.original[role === 'agent' ? 'paymentMethod' : 'notes'],
//         }));

//         const csv = generateCsv(csvConfig)(rowData);
//         download(csvConfig)(csv);
//     };

//     const handleExportPdfRows = (rows) => {
//         const doc = new jsPDF();

//         const tableHeaders = columns.map((c) => c.header);

//         const tableData = rows.map((row) => [
//             row.original.bookingDate,
//             ...(role === 'agent' ? [row.original._id] : []), // Include Booking Id for agents

//             row.original.tour_id?.packageName || '',
//             row.original.numberOfPeople,
//             row.original.status,
//             row.original.paymentStatus,
//             role === 'agent' ? row.original.paymentMethod : row.original.notes, // Conditional for Payment Method or Notes
//         ]);

//         autoTable(doc, {
//             head: [tableHeaders],
//             body: tableData,
//         });

//         doc.save('mrt-pdf-example.pdf');
//     };

//     const handleExportDetailedPdfRows = (rows) => {
//         const doc = new jsPDF();
    
//         rows.forEach((row) => {
//             const { 
//                 bookingDate, 
//                 numberOfPeople, 
//                 totalAmount, 
//                 passengerDetails, 
//                 status, 
//                 paymentStatus, 
//                 tour_id, 
//                 email, 
//                 phone 
//             } = row.original;
    
//             // Add basic booking details in a table format
//             doc.autoTable({
//                 head: [['Detail', 'Information']], // Table header
//                 body: [
//                     ['Package Name', tour_id?.packageName || ''],
//                     ['Booking Date', bookingDate],
//                     ['Number of People', numberOfPeople],
//                     ['Total Amount', totalAmount],
//                     ['Status', status],
//                     ['Payment Status', paymentStatus],
//                     ['Email', email],
//                     ['Phone', phone],
//                 ],
//                 startY: 10, // Starting position for the table
//             });
    
//             // Add space before the passenger details table
//             const pageHeight = doc.internal.pageSize.height;
//             const currentY = doc.autoTable.previous.finalY; // Get the Y position after the first table
    
//             if (currentY + 20 > pageHeight) {
//                 doc.addPage(); // Add a new page if necessary
//             }
    
//             // Add passenger details in a table
//             doc.autoTable({
//                 head: [['Passenger', 'Name', 'Age', 'Gender']], // Table header
//                 body: passengerDetails.map((passenger, index) => [
//                     `Passenger ${index + 1}`,
//                     passenger.name,
//                     passenger.age,
//                     passenger.gender,
//                 ]),
//                 startY: currentY + 20, // Starting position for the passenger details table
//             });
    
//             doc.addPage(); // Add new page for each booking's detailed data
//         });
    
//         doc.save('detailed-booking-data.pdf');
//     };

    
//     const table = useMaterialReactTable({
//         columns,
//         data,
//         enableRowSelection: true,
//         columnFilterDisplayMode: 'popover',
//         paginationDisplayMode: 'pages',
//         positionToolbarAlertBanner: 'bottom',
//         renderTopToolbarCustomActions: ({ table }) => (
//             <Box
//                 sx={{
//                     display: 'flex',
//                     gap: '16px',
//                     padding: '8px',
//                     flexWrap: 'wrap',
//                 }}
//             >
//                 <Button
//                     disabled={table.getRowModel().rows.length === 0}
//                     onClick={() => handleExportCsvRows(table.getRowModel().rows)}
//                     startIcon={<FileDownloadIcon />}
//                 >
//                     Export Page Rows (CSV)
//                 </Button>
//                 <Button
//                     disabled={
//                         !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
//                     }
//                     onClick={() => handleExportCsvRows(table.getSelectedRowModel().rows)}
//                     startIcon={<FileDownloadIcon />}
//                 >
//                     Export Selected (CSV)
//                 </Button>
//                 <Button
//                     disabled={table.getRowModel().rows.length === 0}
//                     onClick={() => handleExportPdfRows(table.getRowModel().rows)}
//                     startIcon={<FileDownloadIcon />}
//                 >
//                     Export Page Rows (PDF)
//                 </Button>
//                 <Button
//                     disabled={
//                         !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
//                     }
//                     onClick={() => handleExportPdfRows(table.getSelectedRowModel().rows)}
//                     startIcon={<FileDownloadIcon />}
//                 >
//                     Export Selected (PDF)
//                 </Button>

                // {role === 'agent' && (
                //     <Button
                //         disabled={
                //             !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                //         }
                //         onClick={() => handleExportDetailedPdfRows(table.getSelectedRowModel().rows)} // Functionality to be added later
                //         startIcon={<FileDownloadIcon />}
                //     >
                //         Detailed Data (PDF)
                //     </Button>
                // )}








//             </Box>

//         ),
//         ...(role === 'agent' && {
//             enableRowActions: true,
//             positionActionsColumn: 'last',
//             displayColumnDefOptions: {
//                 'mrt-row-actions': {
//                     header: 'Action', // Change header text
//                     size: 150, // Make actions column wider
//                 },
//             },
//             renderRowActions: ({ row, table }) => (
//                 <Box>
//                     <Button
//                         onClick={() =>
//                             window.open(
//                                 `https://mail.google.com/mail/?view=cm&fs=1&to=${row.original.email}&su=Tour Details ${row.original.tour_id?.packageName}&body=Here are your tour details!`
//                             )
//                         }
//                         startIcon={<EmailIcon />}
//                     >
//                         Send Ticket
//                     </Button>
//                 </Box>
//             ),
//         }),
//     });

//     return (
//         <div>
//             {role === 'tourist' ? (
//                 <MaterialReactTable table={table} />
//             ) : role === 'agent' ? (
//                 <MaterialReactTable table={table} />
//             ) : (
//                 <Typography variant="h6">Loading...</Typography>
//             )}
//         </div>
//     );
// };

// export default Favorites;
