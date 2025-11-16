import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { showPopup } from '../redux/slices/popupSlice';

const contactSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  subject: Yup.string().required('Subject is required'),
  message: Yup.string().min(10, 'Message must be at least 10 characters').required('Message is required')
});

const Contact = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      dispatch(showPopup({
        message: 'Thank you for your message! We will get back to you soon.',
        type: 'success'
      }));
      resetForm();
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h1>Contact Us</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Get in touch with our team. We're here to help you with any questions or concerns.
          </p>
        </div>

        <div className="hero-content">
          {/* Contact Form */}
          <div className="card" style={{ flex: 1 }}>
            <h2>Send us a Message</h2>
            <Formik
              initialValues={{ name: '', email: '', subject: '', message: '' }}
              validationSchema={contactSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
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
                    <label className="form-label">Email Address</label>
                    <Field 
                      name="email" 
                      type="email" 
                      placeholder="Enter your email"
                      className={`form-control ${errors.email && touched.email ? 'error' : ''}`}
                    />
                    <ErrorMessage name="email" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <Field 
                      name="subject" 
                      type="text" 
                      placeholder="What is this regarding?"
                      className={`form-control ${errors.subject && touched.subject ? 'error' : ''}`}
                    />
                    <ErrorMessage name="subject" component="div" className="error-message" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <Field 
                      as="textarea" 
                      name="message" 
                      rows="5"
                      placeholder="Tell us how we can help you..."
                      className={`form-control ${errors.message && touched.message ? 'error' : ''}`}
                    />
                    <ErrorMessage name="message" component="div" className="error-message" />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner"></div>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Contact Information */}
          <div style={{ flex: 1 }}>
            <div className="card">
              <h2>Get in Touch</h2>
              <p>We'd love to hear from you. Here's how you can reach us.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    background: 'var(--primary-gradient)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h4>Visit Our Office</h4>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}>
                      RYDO Headquarters<br />
                      123 Tech Park Road<br />
                      Mangalore, Karnataka 575001<br />
                      India
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    background: 'var(--primary-gradient)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <h4>Call Us</h4>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}>
                      Customer Support: +91 98765 43210<br />
                      Driver Support: +91 98765 43211<br />
                      Business Inquiries: +91 98765 43212
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    background: 'var(--primary-gradient)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h4>Email Us</h4>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}>
                      Support: support@rydo.com<br />
                      Drivers: drivers@rydo.com<br />
                      Careers: careers@rydo.com
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    background: 'var(--primary-gradient)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h4>Business Hours</h4>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}>
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="card" style={{ marginTop: '2rem' }}>
              <h3>Frequently Asked Questions</h3>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>How do I book a ride?</h4>
                  <p style={{ color: 'var(--text-light)', margin: 0 }}>
                    Simply go to our booking page, enter your pickup and destination locations, choose your vehicle type, and confirm your ride.
                  </p>
                </div>
                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>What payment methods do you accept?</h4>
                  <p style={{ color: 'var(--text-light)', margin: 0 }}>
                    We accept cash, credit/debit cards, and popular UPI payment methods.
                  </p>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>How can I become a RYDO driver?</h4>
                  <p style={{ color: 'var(--text-light)', margin: 0 }}>
                    Visit our Drivers page to learn about requirements and start the registration process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="section">
          <div className="card">
            <h2 className="text-center">Find Us</h2>
            <div style={{
              height: '300px',
              background: 'var(--bg-light)',
              borderRadius: 'var(--border-radius)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-light)',
              marginTop: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <i className="fas fa-map" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                <p>Interactive Map Coming Soon</p>
                <p>Mangalore, Karnataka 575001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;