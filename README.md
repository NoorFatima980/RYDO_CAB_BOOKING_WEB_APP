# RYDO - Modern Cab Booking Platform

A full-stack MERN web application for modern cab booking with real-time features, dual database support, and responsive design.

## Features

- User Authentication - Secure JWT-based login/register system
- Ride Booking - Real-time cab booking with fare calculation
- Dual Database - Simultaneous MongoDB & SQLite data storage
- Role-Based Access - Separate dashboards for Users, Drivers, and Admins
- Booking History - Track past rides and rebooking options
- Responsive Design - Mobile-first approach with modern UI
- Location Detection - Automatic GPS and IP-based location services
- Auto Data Sync - Real-time synchronization between databases

## Tech Stack

Frontend:
- React.js with Create React App
- Redux Toolkit for state management
- Formik & Yup for form validation
- Custom CSS with CSS Variables
- React Router for navigation

Backend:
- Node.js & Express.js
- MongoDB with Mongoose ODM
- SQLite for relational data
- JWT Authentication
- Bcrypt for password hashing

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- SQLite3

### Installation

1. Clone the repository
bash
git clone https://github.com/your-username/rydo-app.git
cd rydo-app


2. Install dependencies
bash
npm run install-deps


3. Environment Setup
bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env with your configurations


4. Start development servers
bash
npm run dev


The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure


rydo-app/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & utilities
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── redux/       # State management
│   │   └── styles/      # CSS files
│   └── public/          # Static files
└── package.json         # Root package file


## Database Architecture

MongoDB Collections:
- users - User accounts and profiles
- bookings - Ride booking records
- drivers - Driver information and availability

SQLite Tables:
- users - User data mirror
- bookings - Booking records mirror  
- ride_analytics - Ride performance metrics
- drivers - Driver data mirror

## Usage

1. Registration & Login
   - Create a new account or login with existing credentials
   - JWT tokens are automatically managed

2. Book a Ride
   - Enter pickup and destination locations
   - Choose vehicle type
   - Confirm booking with fare estimate

3. Manage Bookings
   - View booking history
   - Cancel pending rides
   - Rebook previous rides

4. Driver Features 
   - Driver registration
   - Availability management
   - Ride acceptance

5. Database Features
   - Real-time data sync between MongoDB and SQLite
   - Automatic backup and analytics
   - Dual database verification

## Key Features in Action

- Auto Location Detection: Uses browser GPS and IP-based fallback
- Real-time Fare Calculation: Dynamic pricing based on distance and time
- Dual Database Storage: Every operation saves to both MongoDB and SQLite
- Role-based Dashboards: Custom interfaces for users, drivers, and admins
- Responsive Design: Works seamlessly on desktop, tablet, and mobile

## UI/UX Features

- Modern purple-themed design
- Smooth animations and transitions
- Intuitive navigation
- Loading states and error handling
- Success/error popup notifications
- Mobile-friendly interface


Built with ❤️ using the MERN stack