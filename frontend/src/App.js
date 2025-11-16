import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, clearCredentials } from './redux/slices/authSlice';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Popup from './components/Common/Popup';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Booking from './pages/Booking';
import Drivers from './pages/Drivers';
import Company from './pages/Company';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserDashboard from './pages/Dashboard/UserDashboard';
import DriverDashboard from './pages/Dashboard/DriverDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import BookingHistory from './pages/BookingHistory';
import DriverRegistration from './pages/DriverRegistration';
import DatabaseTest from './pages/DatabaseTest'; // Add this import

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.loading);
  const popup = useSelector(state => state.popup);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      dispatch(setCredentials({
        user: JSON.parse(user),
        accessToken: token
      }));
    }
  }, [dispatch]);

  return (
    <div className="App">
      {isLoading && <LoadingSpinner />}
      {popup.show && <Popup />}
      
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/company" element={<Company />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/become-driver" element={<DriverRegistration />} />
          <Route path="/database-test" element={<DatabaseTest />} /> {/* Add this route */}
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;