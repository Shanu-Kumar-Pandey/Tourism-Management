// import React from 'react';
// import { Navigate } from 'react-router-dom';

// function ProtectedRoute({ children }) {
//     const isAuthenticated = !!localStorage.getItem('token'); // Check if the user is logged in

//     if (!isAuthenticated) {
//         alert('The account section is only visible after login.');
//         return <Navigate to="/login" />;
//     }

//     return children;
// }

// export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('user'); // Check if user is authenticated

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
