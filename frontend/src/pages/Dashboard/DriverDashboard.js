import React from 'react';
import { Link } from 'react-router-dom';

const DriverDashboard = () => {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <div className="card">
          <h1>Driver Dashboard</h1>
          <p>Manage your driving activities and earnings</p>
          
          <div style={{ 
            background: 'var(--bg-light)', 
            padding: '2rem', 
            borderRadius: 'var(--border-radius)',
            textAlign: 'center',
            margin: '2rem 0'
          }}>
            <i className="fas fa-tools" style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }}></i>
            <h3>Driver Features Coming Soon</h3>
            <p>We're working on bringing you the best driver experience.</p>
            <Link to="/become-driver" className="btn btn-primary">
              Complete Registration
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="card text-center">
              <i className="fas fa-car" style={{ fontSize: '2rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h3>0</h3>
              <p>Today's Rides</p>
            </div>
            
            <div className="card text-center">
              <i className="fas fa-money-bill" style={{ fontSize: '2rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h3>₹0</h3>
              <p>Today's Earnings</p>
            </div>
            
            <div className="card text-center">
              <i className="fas fa-star" style={{ fontSize: '2rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h3>4.8</h3>
              <p>Your Rating</p>
            </div>
            
            <div className="card text-center">
              <i className="fas fa-clock" style={{ fontSize: '2rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h3>0h</h3>
              <p>Online Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;