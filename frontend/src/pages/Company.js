import React from 'react';
import { Link } from 'react-router-dom';

const Company = () => {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h1>About RYDO</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Revolutionizing urban mobility with safe, reliable, and affordable transportation solutions.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="hero-content" style={{ marginBottom: '4rem' }}>
          <div>
            <h2>Our Mission</h2>
            <p>
              To transform urban transportation by providing seamless, affordable, and reliable 
              ride-sharing services that connect people with their destinations while reducing 
              traffic congestion and environmental impact.
            </p>
          </div>
          <div>
            <h2>Our Vision</h2>
            <p>
              To become the leading mobility platform that empowers communities through 
              innovative transportation solutions, creating opportunities for drivers and 
              convenience for riders across the globe.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="section section-light">
          <h2 className="text-center">Our Values</h2>
          <div className="features-grid">
            <div className="feature-card card text-center">
              <i className="fas fa-safety" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Safety First</h4>
              <p>Your safety is our top priority with verified drivers and secure rides</p>
            </div>
            
            <div className="feature-card card text-center">
              <i className="fas fa-handshake" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Reliability</h4>
              <p>Consistent service you can depend on every time</p>
            </div>
            
            <div className="feature-card card text-center">
              <i className="fas fa-bolt" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Innovation</h4>
              <p>Constantly improving our technology and services</p>
            </div>
            
            <div className="feature-card card text-center">
              <i className="fas fa-users" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Community</h4>
              <p>Building connections between drivers and riders</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="section">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <h2 style={{ color: 'var(--primary-purple)', marginBottom: '0.5rem' }}>10,000+</h2>
              <p>Happy Riders</p>
            </div>
            <div>
              <h2 style={{ color: 'var(--primary-purple)', marginBottom: '0.5rem' }}>2,500+</h2>
              <p>Verified Drivers</p>
            </div>
            <div>
              <h2 style={{ color: 'var(--primary-purple)', marginBottom: '0.5rem' }}>50+</h2>
              <p>Cities Served</p>
            </div>
            <div>
              <h2 style={{ color: 'var(--primary-purple)', marginBottom: '0.5rem' }}>99%</h2>
              <p>Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;