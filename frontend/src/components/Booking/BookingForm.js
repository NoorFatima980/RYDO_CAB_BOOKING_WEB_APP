import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../redux/slices/bookingSlice';
import { showPopup } from '../../redux/slices/popupSlice';

const bookingSchema = Yup.object().shape({
  pickup: Yup.string().required('Pickup location is required'),
  destination: Yup.string().required('Destination is required'),
  stopAt: Yup.string(),
  vehicleType: Yup.string().required('Vehicle type is required')
});

const BookingForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const detectLocation = async (setFieldValue, fieldName) => {
    setIsDetectingLocation(true);
    
    try {
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            maximumAge: 600000,
            enableHighAccuracy: true
          });
        });

        const { latitude, longitude } = position.coords;
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        
        const data = await response.json();
        
        if (data && data.display_name) {
          setFieldValue(fieldName, data.display_name);
          dispatch(showPopup({
            message: `Location detected for ${fieldName === 'pickup' ? 'pickup' : 'destination'}!`,
            type: 'success'
          }));
        }
      }
    } catch (error) {
      dispatch(showPopup({
        message: 'Could not detect location. Please enter manually.',
        type: 'warning'
      }));
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!isAuthenticated) {
      dispatch(showPopup({
        message: 'Please login to book a ride',
        type: 'warning'
      }));
      navigate('/login');
      return;
    }

    try {
      // Mock distance and duration calculation
      const distance = Math.random() * 20 + 2; // 2-22 km
      const estimatedDuration = Math.random() * 30 + 15; // 15-45 min

      const bookingData = {
        pickup: {
          address: values.pickup,
          coordinates: { lat: 0, lng: 0 } // Mock coordinates
        },
        destination: {
          address: values.destination,
          coordinates: { lat: 0, lng: 0 } // Mock coordinates
        },
        stops: values.stopAt ? [{ address: values.stopAt }] : [],
        distance,
        estimatedDuration,
        vehicleType: values.vehicleType
      };

      await dispatch(createBooking(bookingData)).unwrap();
      
      dispatch(showPopup({
        message: 'Ride booked successfully!',
        type: 'success'
      }));
      
      resetForm();
      navigate('/dashboard');
    } catch (error) {
      dispatch(showPopup({
        message: 'Failed to book ride. Please try again.',
        type: 'error'
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-form">
      <h3>Book Your Ride</h3>
      <Formik
        initialValues={{
          pickup: '',
          destination: '',
          stopAt: '',
          vehicleType: 'sedan'
        }}
        validationSchema={bookingSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, setFieldValue }) => (
          <Form>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label">
                  <i className="fas fa-map-marker-alt"></i> Pick-Up
                </label>
                <button 
                  type="button"
                  onClick={() => detectLocation(setFieldValue, 'pickup')}
                  disabled={isDetectingLocation}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                >
                  {isDetectingLocation ? (
                    <>
                      <div className="loading-spinner" style={{ width: '12px', height: '12px' }}></div>
                      Detecting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-location-arrow"></i>
                      Use My Location
                    </>
                  )}
                </button>
              </div>
              <Field 
                name="pickup" 
                type="text" 
                placeholder="Enter pickup location"
                className={`form-control ${errors.pickup && touched.pickup ? 'error' : ''}`}
              />
              <ErrorMessage name="pickup" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label">
                  <i className="fas fa-flag"></i> Drop-Off
                </label>
                <button 
                  type="button"
                  onClick={() => detectLocation(setFieldValue, 'destination')}
                  disabled={isDetectingLocation}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                >
                  {isDetectingLocation ? (
                    <>
                      <div className="loading-spinner" style={{ width: '12px', height: '12px' }}></div>
                      Detecting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-location-arrow"></i>
                      Use My Location
                    </>
                  )}
                </button>
              </div>
              <Field 
                name="destination" 
                type="text" 
                placeholder="Enter destination"
                className={`form-control ${errors.destination && touched.destination ? 'error' : ''}`}
              />
              <ErrorMessage name="destination" component="div" className="error-message" />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-stop-circle"></i> Stop At (Optional)
              </label>
              <Field 
                name="stopAt" 
                type="text" 
                placeholder="Add a stop"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-car"></i> Vehicle Type
              </label>
              <Field as="select" name="vehicleType" className="form-control">
                <option value="hatchback">Hatchback - ₹12/km</option>
                <option value="sedan">Sedan - ₹15/km</option>
                <option value="suv">SUV - ₹18/km</option>
                <option value="luxury">Luxury - ₹25/km</option>
              </Field>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
              style={{ width: '100%' }}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Booking...
                </>
              ) : (
                'Confirm Ride'
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookingForm;