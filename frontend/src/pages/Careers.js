import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { showPopup } from '../redux/slices/popupSlice';

const applicationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  position: Yup.string().required('Please select a position'),
  experience: Yup.string().required('Please select experience level'),
  resume: Yup.mixed().required('Resume is required'),
  coverLetter: Yup.string().min(10, 'Cover letter must be at least 10 characters')
});

const Careers = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobOpenings = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Mangalore, India",
      type: "Full-time",
      experience: "2-4 years",
      description: "We're looking for a skilled Frontend Developer to join our team and help build amazing user experiences for our ride-sharing platform.",
      requirements: [
        "Strong proficiency in React.js and modern JavaScript",
        "Experience with state management (Redux)",
        "Knowledge of responsive web design",
        "Familiarity with RESTful APIs"
      ]
    },
    {
      id: 2,
      title: "Backend Developer",
      department: "Engineering",
      location: "Mangalore, India",
      type: "Full-time",
      experience: "3-5 years",
      description: "Join our backend team to build scalable and reliable services that power millions of rides.",
      requirements: [
        "Experience with Node.js and Express.js",
        "Knowledge of MongoDB and SQL databases",
        "Understanding of microservices architecture",
        "Familiarity with cloud platforms (AWS/GCP)"
      ]
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "Mangalore, India",
      type: "Full-time",
      experience: "4-6 years",
      description: "Drive product strategy and execution for our ride-sharing platform, working closely with engineering and design teams.",
      requirements: [
        "Proven experience as a Product Manager",
        "Strong analytical and problem-solving skills",
        "Excellent communication and leadership abilities",
        "Experience in mobility or transportation industry preferred"
      ]
    },
    {
      id: 4,
      title: "Customer Support Specialist",
      department: "Operations",
      location: "Mangalore, India",
      type: "Full-time",
      experience: "1-2 years",
      description: "Provide exceptional support to our riders and drivers, helping them resolve issues and have great experiences.",
      requirements: [
        "Excellent communication skills",
        "Customer service experience",
        "Problem-solving mindset",
        "Ability to work in shifts"
      ]
    }
  ];

  const handleApplication = async (values, { resetForm }) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      dispatch(showPopup({
        message: 'Application submitted successfully! We will review your application and get back to you soon.',
        type: 'success'
      }));
      resetForm();
      setIsSubmitting(false);
    }, 2000);
  };

  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <h1>Join Our Team</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Help us revolutionize urban mobility. Build your career with RYDO and make a difference in millions of lives.
          </p>
        </div>

        {/* Why Work With Us */}
        <div className="section section-light">
          <h2 className="text-center">Why Work at RYDO?</h2>
          <div className="features-grid">
            <div className="feature-card card text-center">
              <i className="fas fa-rocket" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Impactful Work</h4>
              <p>Solve real problems and transform urban transportation for millions of users</p>
            </div>
            
            <div className="feature-card card text-center">
              <i className="fas fa-users" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Great Culture</h4>
              <p>Collaborative environment with passionate professionals</p>
            </div>
            
            <div className="feature-card card text-center">
              <i className="fas fa-chart-line" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Growth Opportunities</h4>
              <p>Continuous learning and career advancement</p>
            </div>
            
            <div className="feature-card card text-center">
              <i className="fas fa-heart" style={{ fontSize: '3rem', color: 'var(--primary-purple)', marginBottom: '1rem' }}></i>
              <h4>Benefits & Perks</h4>
              <p>Competitive salary, health insurance, and flexible work arrangements</p>
            </div>
          </div>
        </div>

        {/* Current Openings */}
        <div className="section">
          <h2 className="text-center">Current Openings</h2>
          <p className="text-center" style={{ color: 'var(--text-light)', marginBottom: '3rem' }}>
            Explore our available positions and find the perfect fit for your skills
          </p>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {jobOpenings.map(job => (
              <div key={job.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{job.title}</h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <span style={{
                        background: 'var(--bg-light)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        color: 'var(--text-light)'
                      }}>
                        <i className="fas fa-building"></i> {job.department}
                      </span>
                      <span style={{
                        background: 'var(--bg-light)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        color: 'var(--text-light)'
                      }}>
                        <i className="fas fa-map-marker-alt"></i> {job.location}
                      </span>
                      <span style={{
                        background: 'var(--bg-light)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        color: 'var(--text-light)'
                      }}>
                        <i className="fas fa-briefcase"></i> {job.type}
                      </span>
                      <span style={{
                        background: 'var(--bg-light)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        color: 'var(--text-light)'
                      }}>
                        <i className="fas fa-chart-line"></i> {job.experience}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>{job.description}</p>
                    
                    <div>
                      <h4 style={{ marginBottom: '0.5rem' }}>Requirements:</h4>
                      <ul style={{ color: 'var(--text-light)', paddingLeft: '1.5rem' }}>
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setSelectedJob(job)}
                  className="btn btn-primary"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Modal */}
        {selectedJob && (
          <div className="popup-overlay">
            <div className="popup-content" style={{ maxWidth: '600px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Apply for {selectedJob.title}</h2>
                <button 
                  onClick={() => setSelectedJob(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <Formik
                initialValues={{ 
                  name: '', 
                  email: '', 
                  phone: '', 
                  position: selectedJob.title,
                  experience: '',
                  resume: null,
                  coverLetter: ''
                }}
                validationSchema={applicationSchema}
                onSubmit={handleApplication}
              >
                {({ errors, touched, setFieldValue }) => (
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                        <label className="form-label">Phone Number</label>
                        <Field 
                          name="phone" 
                          type="tel" 
                          placeholder="Enter your phone number"
                          className={`form-control ${errors.phone && touched.phone ? 'error' : ''}`}
                        />
                        <ErrorMessage name="phone" component="div" className="error-message" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Position</label>
                        <Field as="select" name="position" className="form-control">
                          <option value={selectedJob.title}>{selectedJob.title}</option>
                          {jobOpenings.filter(job => job.id !== selectedJob.id).map(job => (
                            <option key={job.id} value={job.title}>{job.title}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="position" component="div" className="error-message" />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Experience Level</label>
                        <Field as="select" name="experience" className="form-control">
                          <option value="">Select experience</option>
                          <option value="0-1 years">0-1 years</option>
                          <option value="1-3 years">1-3 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="5+ years">5+ years</option>
                        </Field>
                        <ErrorMessage name="experience" component="div" className="error-message" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Resume (PDF, DOC, DOCX)</label>
                      <input 
                        name="resume" 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={(event) => setFieldValue("resume", event.currentTarget.files[0])}
                        className={`form-control ${errors.resume && touched.resume ? 'error' : ''}`}
                      />
                      <ErrorMessage name="resume" component="div" className="error-message" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Cover Letter</label>
                      <Field 
                        as="textarea" 
                        name="coverLetter" 
                        rows="4"
                        placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                        className={`form-control ${errors.coverLetter && touched.coverLetter ? 'error' : ''}`}
                      />
                      <ErrorMessage name="coverLetter" component="div" className="error-message" />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                      <button 
                        type="button" 
                        onClick={() => setSelectedJob(null)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="loading-spinner"></div>
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* General Application */}
        <div className="section section-light">
          <div className="card text-center">
            <h2>Don't See the Perfect Role?</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
              We're always looking for talented people. Send us your resume and we'll contact you when a matching position opens up.
            </p>
            <button 
              onClick={() => setSelectedJob({ title: 'General Application' })}
              className="btn btn-primary btn-lg"
            >
              Submit General Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;