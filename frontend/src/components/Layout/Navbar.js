import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, clearCredentials } from '../../redux/slices/authSlice';
import { showPopup } from '../../redux/slices/popupSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Detect Location');
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get location on component mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setIsLocationLoading(true);
    
    try {
      // Try HTML5 Geolocation API first (most accurate)
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            maximumAge: 600000, // 10 minutes cache
            enableHighAccuracy: true
          });
        });

        const { latitude, longitude } = position.coords;
        
        // Reverse geocoding using free OpenStreetMap Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        
        const data = await response.json();
        
        if (data && data.address) {
          const address = data.address;
          let locationName = '';
          
          // Build location name from available address components
          if (address.city || address.town || address.village) {
            locationName = address.city || address.town || address.village;
          } else if (address.county) {
            locationName = address.county;
          } else if (address.state) {
            locationName = address.state;
          } else {
            locationName = 'Current Location';
          }
          
          setCurrentLocation(locationName);
          setIsLocationLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('GPS location failed, trying IP-based location:', error);
    }

    // Fallback to IP-based location
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data && data.city) {
        setCurrentLocation(`${data.city}, ${data.region || data.country_name}`);
      } else {
        setCurrentLocation('Location Unknown');
      }
    } catch (error) {
      console.log('IP-based location failed:', error);
      setCurrentLocation('Location Unknown');
    } finally {
      setIsLocationLoading(false);
    }
  };

  const handleLocationClick = () => {
    detectLocation();
    dispatch(showPopup({
      message: 'Detecting your location...',
      type: 'info'
    }));
  };

  const handleLogout = async () => {
    try {
      // First try to call the logout API
      await dispatch(logout()).unwrap();
    } catch (error) {
      // Ignore API errors for logout
      console.log('Logout API call failed, but proceeding with local logout');
    } finally {
      // Always clear local credentials
      dispatch(clearCredentials());
      
      dispatch(showPopup({
        message: 'Logged out successfully!',
        type: 'success'
      }));
      
      navigate('/');
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="nav-brand">
            RYDO
          </Link>

          <ul className="nav-links">
            <li><Link to="/booking" className="nav-link">Booking</Link></li>
            <li><Link to="/drivers" className="nav-link">Drivers</Link></li>
            <li className="dropdown">
              <span className="nav-link">Company</span>
              <div className="dropdown-menu">
                <Link to="/company" className="dropdown-item">About Us</Link>
                <Link to="/contact" className="dropdown-item">Contact</Link>
                <Link to="/careers" className="dropdown-item">Careers</Link>
              </div>
            </li>
          </ul>

          <div className="nav-actions">
            {/* Location Button */}
            <button 
              className="location-btn"
              onClick={handleLocationClick}
              disabled={isLocationLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--border-radius)',
                padding: '0.5rem 1rem',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                transition: 'var(--transition)'
              }}
            >
              {isLocationLoading ? (
                <>
                  <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                  Detecting...
                </>
              ) : (
                <>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{currentLocation}</span>
                </>
              )}
            </button>

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="user-menu" ref={userMenuRef}>
                <button 
                  className="nav-link user-menu-btn"
                  onClick={toggleUserMenu}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <i className="fas fa-user"></i> 
                  {user?.name}
                  <i className={`fas fa-chevron-${isUserMenuOpen ? 'up' : 'down'}`} style={{ fontSize: '0.8rem' }}></i>
                </button>
                
                {isUserMenuOpen && (
                  <div className="dropdown-menu show">
                    <div className="user-info" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-light)' }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{user?.email}</div>
                    </div>
                    
                    <Link 
                      to="/dashboard" 
                      className="dropdown-item" 
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <i className="fas fa-tachometer-alt"></i>
                      Dashboard
                    </Link>
                    
                    <Link 
                      to="/booking-history" 
                      className="dropdown-item" 
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <i className="fas fa-history"></i>
                      My Rides
                    </Link>
                    
                    {user?.role === 'driver' && (
                      <Link 
                        to="/driver-dashboard" 
                        className="dropdown-item" 
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="fas fa-car"></i>
                        Driver Dashboard
                      </Link>
                    )}
                    
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin-dashboard" 
                        className="dropdown-item" 
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <i className="fas fa-cog"></i>
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <div style={{ borderTop: '1px solid var(--border-light)', margin: '0.5rem 0' }}></div>
                    
                    <button 
                      onClick={handleLogout} 
                      className="dropdown-item logout-btn"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            {/* Location in Mobile Menu */}
            <button 
              className="mobile-nav-link"
              onClick={handleLocationClick}
              disabled={isLocationLoading}
              style={{ 
                textAlign: 'left',
                background: 'none',
                border: 'none',
                color: 'white'
              }}
            >
              <i className="fas fa-map-marker-alt"></i>
              {isLocationLoading ? 'Detecting Location...' : currentLocation}
            </button>

            <Link to="/booking" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-car"></i>
              Booking
            </Link>
            <Link to="/drivers" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-users"></i>
              Drivers
            </Link>
            <Link to="/company" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-building"></i>
              Company
            </Link>
            
            {isAuthenticated ? (
              <>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', margin: '0.5rem 0', paddingTop: '0.5rem' }}></div>
                <div style={{ padding: '0.5rem 0', color: 'rgba(255,255,255,0.8)' }}>
                  <div style={{ fontWeight: '600' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.875rem' }}>{user?.email}</div>
                </div>
                <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-tachometer-alt"></i>
                  Dashboard
                </Link>
                <Link to="/booking-history" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-history"></i>
                  My Rides
                </Link>
                {user?.role === 'driver' && (
                  <Link to="/driver-dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-car"></i>
                    Driver Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin-dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-cog"></i>
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="mobile-nav-link" 
                  style={{ color: '#FCA5A5', textAlign: 'left' }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', margin: '0.5rem 0', paddingTop: '0.5rem' }}></div>
                <Link to="/login" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </Link>
                <Link to="/register" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  <i className="fas fa-user-plus"></i>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .navbar {
          background: var(--primary-gradient);
          padding: 1rem 0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }
        
        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .nav-brand {
          font-family: 'Poppins', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-white);
          text-decoration: none;
        }
        
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
        }
        
        .nav-link {
          color: var(--text-white);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
          position: relative;
          cursor: pointer;
        }
        
        .nav-link:hover {
          color: rgba(255, 255, 255, 0.8);
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--text-white);
          transition: var(--transition);
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .location-btn {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: var(--border-radius) !important;
          padding: 0.5rem 1rem !important;
          color: white !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
          font-size: 0.9rem !important;
          transition: var(--transition) !important;
          font-family: inherit !important;
        }
        
        .location-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: translateY(-1px) !important;
        }
        
        .location-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .dropdown {
          position: relative;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-lg);
          padding: 0.5rem 0;
          min-width: 220px;
          display: none;
          z-index: 1001;
        }
        
        .dropdown-menu.show {
          display: block;
        }
        
        .dropdown:hover .dropdown-menu {
          display: block;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: var(--text-dark);
          text-decoration: none;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
          transition: var(--transition);
        }
        
        .dropdown-item:hover {
          background: var(--bg-light);
        }
        
        .logout-btn {
          color: #EF4444 !important;
        }
        
        .logout-btn:hover {
          background: #FEF2F2 !important;
        }
        
        .user-menu {
          position: relative;
        }
        
        .user-menu .dropdown-menu {
          right: 0;
          left: auto;
        }
        
        .user-menu-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
          text-decoration: none;
          padding: 0.75rem 0;
          background: none;
          border: none;
          text-align: left;
          font-family: inherit;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .mobile-nav-link:hover {
          color: rgba(255, 255, 255, 0.8);
        }
        
        @media (max-width: 768px) {
          .nav-links, .nav-actions .btn, .location-btn {
            display: none;
          }
          
          .mobile-menu-btn {
            display: block;
          }
          
          .mobile-menu {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;