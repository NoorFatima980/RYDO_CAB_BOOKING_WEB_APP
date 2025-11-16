import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { showPopup } from '../../redux/slices/popupSlice';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required')
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector(state => state.auth);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(login(values)).unwrap();
      dispatch(showPopup({
        message: 'Login successful!',
        type: 'success'
      }));
      navigate('/dashboard');
    } catch (error) {
      dispatch(showPopup({
        message: error || 'Login failed!',
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
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>Welcome Back</h2>
          <p>Sign in to your RYDO account</p>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
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
                <label className="form-label">Password</label>
                <Field 
                  name="password" 
                  type="password" 
                  placeholder="Enter your password"
                  className={`form-control ${errors.password && touched.password ? 'error' : ''}`}
                />
                <ErrorMessage name="password" component="div" className="error-message" />
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
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary-purple)', textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;