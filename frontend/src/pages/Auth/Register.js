import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/slices/authSlice';
import { showPopup } from '../../redux/slices/popupSlice';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.auth);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { confirmPassword, ...userData } = values;
      await dispatch(register(userData)).unwrap();
      dispatch(showPopup({
        message: 'Registration successful!',
        type: 'success'
      }));
      navigate('/dashboard');
    } catch (error) {
      dispatch(showPopup({
        message: error || 'Registration failed!',
        type: 'error'
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--primary-gradient)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 0'
    }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>Create Account</h2>
          <p>Join RYDO today</p>
        </div>

        <Formik
          initialValues={{ name: '', email: '', phone: '', password: '', confirmPassword: '' }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <Field 
                  name="name" 
                  type="text" 
                  placeholder="Enter your full name"
                  className={`form-control ${errors.name && touched.name ? 'error' : ''}`}
                />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <Field 
                  name="email" 
                  type="email" 
                  placeholder="Enter your email"
                  className={`form-control ${errors.email && touched.email ? 'error' : ''}`}
                />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <Field 
                  name="phone" 
                  type="tel" 
                  placeholder="Enter your phone number"
                  className={`form-control ${errors.phone && touched.phone ? 'error' : ''}`}
                />
                <ErrorMessage name="phone" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <Field 
                  name="password" 
                  type="password" 
                  placeholder="Create a password"
                  className={`form-control ${errors.password && touched.password ? 'error' : ''}`}
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <Field 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="Confirm your password"
                  className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''}`}
                />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting || isLoading}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-purple)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;