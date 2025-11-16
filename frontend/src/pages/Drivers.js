import React from 'react';
import { Link } from 'react-router-dom';

const Drivers = () => {
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
            <h1>Become a RYDO Driver</h1>
            <p>Join thousands of drivers earning on their own schedule. Flexible hours, great earnings, and full support.</p>
            <div className="hero-actions">
              <Link to="/become-driver" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/driver-dashboard" className="btn btn-secondary btn-lg">
                Driver Login
              </Link>
            </div>
          </div>
          
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

        {/* Benefits Section */}
        <div className="section">
          <h2 className="text-center">Why Drive With RYDO?</h2>
          <div className="features-grid">
            <div className="feature-card card text-center">
              <i className="fas fa-money-bill-wave" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Great Earnings</h4>
              <p>Competitive rates and bonuses</p>
            </div>
            
            <div className="feature-card card text-center">
              <i className="fas fa-clock" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Flexible Hours</h4>
              <p>Drive when you want</p>
            </div>
            
            <div className="feature-card card text-center">
              <i className="fas fa-shield-alt" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Safe & Secure</h4>
              <p>24/7 support and insurance</p>
            </div>
            
            <div className="feature-card card text-center">
              <i className="fas fa-chart-line" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Growth Opportunities</h4>
              <p>Advance your driving career</p>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="section section-light">
          <div className="container">
            <h2 className="text-center">Driver Requirements</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
              <div>
                <h4><i className="fas fa-id-card"></i> Valid Documents</h4>
                <ul style={{ color: 'var(--text-light)' }}>
                  <li>Driver's License</li>
                  <li>Vehicle Registration</li>
                  <li>Insurance Certificate</li>
                  <li>Pollution Certificate</li>
                </ul>
              </div>
              
              <div>
                <h4><i className="fas fa-car"></i> Vehicle Requirements</h4>
                <ul style={{ color: 'var(--text-light)' }}>
                  <li>4-door vehicle</li>
                  <li>Good condition</li>
                  <li>Valid insurance</li>
                  <li>Less than 10 years old</li>
                </ul>
              </div>
              
              <div>
                <h4><i className="fas fa-user-check"></i> Personal Requirements</h4>
                <ul style={{ color: 'var(--text-light)' }}>
                  <li>21+ years old</li>
                  <li>Clean driving record</li>
                  <li>Smartphone</li>
                  <li>Good communication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;