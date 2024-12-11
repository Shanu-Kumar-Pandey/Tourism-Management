import React from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login/Login';
import Registration from './pages/Registration/Registration';
import Home from './pages/Home/Home';
import Account from './pages/Account/Account';
import Tour from './pages/Tour/Tour';
import Places from './pages/Places/Tours';
import About from './pages/About/About';
import ChangePassword from './components/account/ChangePassword';
import ForgotPassword from './components/account/ForgotPassword'
import ResetPassword from './components/account/ResetPassword';
import Booking from './components/booking/Booking';
import EditTour from './components/tour_edit/EditTour';
import Payment from './components/booking/Payment';
import AddTour from './components/tour/AddTour';
import UserControl from './pages/UserControl/UserControl';
import BlockedAccount from './pages/Errorpages/BlockedAccount';
import ViewToursDetails from './components/places/ViewTourDetails';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';



function App() {
  return (
    <div className="App">
      <Router>
        <Main />
      </Router>
    </div>
  );
}

function Main() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register', '/forgot-password', '/reset-password','/Example','/blocked-account'];

  const shouldHideNavbar = hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/places" element={<Places />} />
        <Route path="/viewToursDetails" element={<ViewToursDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/user-control" element={<UserControl />} />
        <Route path="/blocked-account" element={<BlockedAccount />} />
        



        <Route path="/Add-Tour" element={<AddTour />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/edit-tour/:tourId" element={<EditTour />} />


        <Route
          path="/account/*"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;









