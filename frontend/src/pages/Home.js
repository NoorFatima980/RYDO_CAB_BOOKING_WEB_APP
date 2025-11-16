import React from 'react';
import { Link } from 'react-router-dom';
import BookingForm from '../components/Booking/BookingForm';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Book your ride now.</h1>
              <p>Experience the future of urban mobility with RYDO. Safe, reliable, and affordable rides around the city.</p>
              <div className="hero-actions">
                <Link to="/booking" className="btn btn-primary btn-lg">
                  Book Now
                </Link>
                <Link to="/drivers" className="btn btn-secondary btn-lg">
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="hero-form">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Advance Booking Section */}
      <section className="section section-light">
        <div className="container text-center">
          <h2>Reserve your rides</h2>
          <p className="mb-3">Book your cabs way ahead of time on your busiest days.</p>
          <Link to="/booking" className="btn btn-primary btn-lg">
            Book Now
          </Link>
        </div>
      </section>

      {/* Plan Your RYDO Section */}
      <section className="section">
        <div className="container">
          <h2 className="text-center mb-3">Plan your rydo.</h2>
          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon">
                <i className="fas fa-taxi"></i>
              </div>
              <h4>Taxi</h4>
              <p>Comfortable rides with professional drivers</p>
              <i className="fas fa-arrow-right"></i>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <i className="fas fa-car"></i>
              </div>
              <h4>Self Drive</h4>
              <p>Drive yourself with our rental cars</p>
              <i className="fas fa-arrow-right"></i>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h4>Car-Pool</h4>
              <p>Share rides and save money</p>
              <i className="fas fa-arrow-right"></i>
            </div>
            
            <div className="feature-card card">
              <div className="feature-icon">
                <i className="fas fa-calendar"></i>
              </div>
              <h4>Reserve</h4>
              <p>Schedule rides in advance</p>
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Recruitment Section */}
      <section className="section section-light">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h2>Earn by driving.</h2>
              <p>Join thousands of drivers earning on their own schedule. Flexible hours, great earnings, and full support.</p>
              <Link to="/become-driver" className="btn btn-primary btn-lg">
                Get Started
              </Link>
            </div>
            <div className="hero-image">
              {/* Illustration placeholder */}
              <div style={{
                background: 'var(--primary-gradient)',
                borderRadius: 'var(--border-radius-lg)',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem'
              }}>
                Driver Illustration
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Car Pool Section */}
      <section className="section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-image">
              {/* Illustration placeholder */}
              <div style={{
                background: 'var(--primary-gradient)',
                borderRadius: 'var(--border-radius-lg)',
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.2rem'
              }}>
                Car Pool Illustration
              </div>
            </div>
            <div className="hero-text">
              <h2>Introducing Car-pool.</h2>
              <p>Share your ride with others going the same way and save up to 60% on your travel costs.</p>
              <Link to="/booking" className="btn btn-primary btn-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Download Apps Section */}
      <section className="section section-dark">
        <div className="container text-center">
          <h2>Download our apps.</h2>
          <p className="mb-3">Get the best experience on your mobile device</p>
          <div className="d-flex justify-center gap-2">
            <button className="btn btn-primary btn-lg">
              RYDO App
            </button>
            <button className="btn btn-secondary btn-lg">
              Driver App
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;