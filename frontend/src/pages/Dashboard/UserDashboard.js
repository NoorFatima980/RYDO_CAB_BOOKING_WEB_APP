import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserBookings } from '../../redux/slices/bookingSlice';
import { logout, clearCredentials } from '../../redux/slices/authSlice';
import { showPopup } from '../../redux/slices/popupSlice';

const UserDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { bookings, isLoading } = useSelector(state => state.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserBookings(1));
  }, [dispatch]);

  const handleSignOut = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(clearCredentials());
      dispatch(showPopup({
        message: 'Signed out successfully!',
        type: 'success'
      }));
      navigate('/');
    } catch (error) {
      dispatch(clearCredentials());
      dispatch(showPopup({
        message: 'Signed out successfully!',
        type: 'success'
      }));
      navigate('/');
    }
  };

  const recentBookings = bookings.slice(0, 5);

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        {/* Welcome Section */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1>Welcome back, {user?.name}!</h1>
              <p>Ready for your next ride?</p>
            </div>
            <button 
              onClick={handleSignOut}
              className="btn btn-secondary"
              style={{ color: '#EF4444', borderColor: '#EF4444' }}
            >
              <i className="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </div>
          <Link to="/booking" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Book a Ride
          </Link>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card text-center">
            <h3>{bookings.length}</h3>
            <p>Total Rides</p>
          </div>
          <div className="card text-center">
            <h3>{bookings.filter(b => b.status === 'completed').length}</h3>
            <p>Completed</p>
          </div>
          <div className="card text-center">
            <h3>{bookings.filter(b => b.status === 'upcoming').length}</h3>
            <p>Upcoming</p>
          </div>
          <div className="card text-center">
            <h3>4.8</h3>
            <p>Your Rating</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>Recent Rides</h2>
            <Link to="/booking-history" className="btn btn-secondary">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
              <p>Loading your rides...</p>
            </div>
          ) : recentBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
              <i className="fas fa-car" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <p>No rides yet. Book your first ride!</p>
              <Link to="/booking" className="btn btn-primary">
                Book Now
              </Link>
            </div>
          ) : (
            <div>
              {recentBookings.map(booking => (
                <div key={booking._id} style={{
                  padding: '1rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--border-radius)',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>
                      {booking.pickup.address} → {booking.destination.address}
                    </h4>
                    <p style={{ margin: '0', color: 'var(--text-light)' }}>
                      {new Date(booking.createdAt).toLocaleDateString()} • ₹{booking.fare} • {booking.status}
                    </p>
                  </div>
                  <div>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      background: booking.status === 'completed' ? '#DCFCE7' : 
                                 booking.status === 'cancelled' ? '#FEE2E2' : '#FEF3C7',
                      color: booking.status === 'completed' ? '#166534' :
                            booking.status === 'cancelled' ? '#991B1B' : '#92400E'
                    }}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <Link to="/booking" className="btn btn-primary" style={{ textAlign: 'center' }}>
              <i className="fas fa-plus"></i>
              <div>Book Ride</div>
            </Link>
            <Link to="/booking-history" className="btn btn-secondary" style={{ textAlign: 'center' }}>
              <i className="fas fa-history"></i>
              <div>Ride History</div>
            </Link>
            <button className="btn btn-secondary" style={{ textAlign: 'center' }}>
              <i className="fas fa-cog"></i>
              <div>Settings</div>
            </button>
            <button className="btn btn-secondary" style={{ textAlign: 'center' }}>
              <i className="fas fa-question-circle"></i>
              <div>Help</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;