import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUserBookings, cancelBooking } from '../redux/slices/bookingSlice';
import { showPopup } from '../redux/slices/popupSlice';

const BookingHistory = () => {
  const { bookings, isLoading } = useSelector(state => state.booking);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserBookings(1));
  }, [dispatch]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(cancelBooking(bookingId)).unwrap();
        dispatch(showPopup({
          message: 'Booking cancelled successfully!',
          type: 'success'
        }));
      } catch (error) {
        dispatch(showPopup({
          message: error || 'Failed to cancel booking',
          type: 'error'
        }));
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: { bg: '#DCFCE7', color: '#166534' },
      cancelled: { bg: '#FEE2E2', color: '#991B1B' },
      pending: { bg: '#FEF3C7', color: '#92400E' },
      accepted: { bg: '#DBEAFE', color: '#1E40AF' },
      in_progress: { bg: '#FEF3C7', color: '#92400E' }
    };
    return colors[status] || { bg: '#F3F4F6', color: '#6B7280' };
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </Link>
        </div>

        <div className="card">
          <h1>Booking History</h1>
          <p>View and manage your past and upcoming rides</p>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
              <p>Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
              <i className="fas fa-history" style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <h3>No bookings yet</h3>
              <p>Your booking history will appear here</p>
              <Link to="/booking" className="btn btn-primary">
                Book Your First Ride
              </Link>
            </div>
          ) : (
            <div>
              {bookings.map(booking => {
                const statusStyle = getStatusColor(booking.status);
                return (
                  <div key={booking._id} style={{
                    padding: '1.5rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--border-radius)',
                    marginBottom: '1rem',
                    background: 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>
                          {booking.pickup.address} → {booking.destination.address}
                        </h3>
                        <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-light)' }}>
                          <i className="fas fa-calendar"></i> {new Date(booking.createdAt).toLocaleString()}
                        </p>
                        <p style={{ margin: '0', color: 'var(--text-light)' }}>
                          <i className="fas fa-car"></i> {booking.vehicleType} • 
                          <i className="fas fa-rupee-sign"></i> {booking.fare} • 
                          <i className="fas fa-road"></i> {booking.distance} km
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          padding: '0.375rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.875rem',
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      {!['completed', 'cancelled'].includes(booking.status) && (
                        <button 
                          onClick={() => handleCancelBooking(booking._id)}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      )}
                      <Link 
                        to={`/booking`} 
                        className="btn btn-primary btn-sm"
                        state={{ rebook: booking }}
                      >
                        Rebook
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;