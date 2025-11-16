import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <div className="card">
          <h1>Admin Dashboard</h1>
          <p>Manage platform operations and analytics</p>
          
          <div style={{ 
            background: 'var(--bg-light)', 
            padding: '2rem', 
            borderRadius: 'var(--border-radius)',
            textAlign: 'center',
            margin: '2rem 0'
          }}>
            <i className="fas fa-tools" style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }}></i>
            <h3>Admin Features Coming Soon</h3>
            <p>Advanced admin features are under development.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="card text-center">
              <i className="fas fa-users" style={{ fontSize: '2rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h3>0</h3>
              <p>Total Users</p>
            </div>
            
            <div className="card text-center">
              <i className="fas fa-car" style={{ fontSize: '2rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h3>0</h3>
              <p>Total Drivers</p>
            </div>
            
            <div className="card text-center">
              <i className="fas fa-route" style={{ fontSize: '2rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h3>0</h3>
              <p>Total Rides</p>
            </div>
            
            <div className="card text-center">
              <i className="fas fa-money-bill" style={{ fontSize: '2rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h3>₹0</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;