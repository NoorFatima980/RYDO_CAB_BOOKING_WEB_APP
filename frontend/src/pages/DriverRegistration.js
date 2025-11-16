import React from 'react';
import { Link } from 'react-router-dom';

const DriverRegistration = () => {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/drivers" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Drivers
          </Link>
        </div>

        <div className="card">
          <h1>Become a RYDO Driver</h1>
          <p>Join our platform and start earning today</p>

          <div style={{ 
            background: 'var(--bg-light)', 
            padding: '2rem', 
            borderRadius: 'var(--border-radius)',
            textAlign: 'center',
            margin: '2rem 0'
          }}>
            <i className="fas fa-tools" style={{ fontSize: '3rem', color: 'var(--text-light)', marginBottom: '1rem' }}></i>
            <h3>Driver Registration Coming Soon</h3>
            <p>We're building the driver registration system. Check back soon!</p>
            <p>In the meantime, you can:</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
              <Link to="/drivers" className="btn btn-primary">
                Learn More
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Contact Support
              </Link>
            </div>
          </div>

          {/* Registration Form Placeholder */}
          <div style={{ opacity: 0.5 }}>
            <h3>Registration Form</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Driver's License Number</label>
                <input type="text" className="form-control" disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Make</label>
                <input type="text" className="form-control" disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Model</label>
                <input type="text" className="form-control" disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Year</label>
                <input type="number" className="form-control" disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Color</label>
                <input type="text" className="form-control" disabled />
              </div>
              <div className="form-group">
                <label className="form-label">License Plate</label>
                <input type="text" className="form-control" disabled />
              </div>
            </div>
            
            <button className="btn btn-primary" disabled style={{ marginTop: '1rem' }}>
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegistration;