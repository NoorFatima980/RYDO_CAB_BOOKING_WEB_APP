import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--primary-dark)',
      color: 'var(--text-white)',
      padding: '3rem 0 1rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Brand Section */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>RYDO</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
              Experience the future of urban mobility with safe, reliable, and affordable rides.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'white', fontSize: '1.2rem' }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" style={{ color: 'white', fontSize: '1.2rem' }}>
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" style={{ color: 'white', fontSize: '1.2rem' }}>
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                Home
              </Link>
              <Link to="/drivers" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                Features
              </Link>
              <Link to="/booking" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                Services
              </Link>
              <Link to="/company" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
                About Us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
              <p><i className="fas fa-phone"></i> +1 234 567 8900</p>
              <p><i className="fas fa-envelope"></i> support@rydo.com</p>
              <p><i className="fas fa-globe"></i> www.rydo.com</p>
              <p><i className="fas fa-map-marker-alt"></i> Mangalore, India</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Get the latest information</h4>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--border-radius)' }}>
              <input 
                type="email" 
                placeholder="Enter your email"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  padding: '12px',
                  color: 'white',
                  outline: 'none'
                }}
              />
              <button style={{
                background: 'var(--primary-purple)',
                border: 'none',
                padding: '12px 16px',
                color: 'white',
                borderRadius: '0 var(--border-radius) var(--border-radius) 0',
                cursor: 'pointer'
              }}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1rem',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)'
        }}>
          <p>&copy; 2024 RYDO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;