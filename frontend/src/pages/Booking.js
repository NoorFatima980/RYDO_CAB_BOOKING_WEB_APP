import React from 'react';
import { Link } from 'react-router-dom';
import BookingForm from '../components/Booking/BookingForm';

const Booking = () => {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1>Book Your Ride</h1>
            <p>Get where you need to go with RYDO's reliable and affordable ride services.</p>
          </div>
          
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <BookingForm />
          </div>
        </div>

        {/* Additional Booking Options */}
        <div className="section">
          <h2 className="text-center">Choose Your Ride</h2>
          <div className="features-grid">
            <div className="feature-card card text-center">
              <div className="feature-icon">
                <i className="fas fa-taxi"></i>
              </div>
              <h4>Standard Taxi</h4>
              <p>Comfortable rides for everyday travel</p>
              <p><strong>₹12/km</strong></p>
            </div>
            
            <div className="feature-card card text-center">
              <div className="feature-icon">
                <i className="fas fa-car"></i>
              </div>
              <h4>Premium Sedan</h4>
              <p>Extra comfort for special occasions</p>
              <p><strong>₹15/km</strong></p>
            </div>
            
            <div className="feature-card card text-center">
              <div className="feature-icon">
                <i className="fas fa-shuttle-van"></i>
              </div>
              <h4>SUV</h4>
              <p>Spacious rides for groups</p>
              <p><strong>₹18/km</strong></p>
            </div>
            
            <div className="feature-card card text-center">
              <div className="feature-icon">
                <i className="fas fa-crown"></i>
              </div>
              <h4>Luxury</h4>
              <p>Premium experience</p>
              <p><strong>₹25/km</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;