const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQLite Middleware - FIXED
const sqliteMiddleware = require('./middleware/sqliteMiddleware');
app.use(sqliteMiddleware.getMiddleware());

// Database connections
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// SQLite setup with enhanced tables
const sqlite3 = require('sqlite3').verbose();
const sqliteDb = new sqlite3.Database(process.env.SQLITE_DB_PATH, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    
    // Enable foreign keys
    sqliteDb.run('PRAGMA foreign_keys = ON');
    
    // Create tables for all major entities with better error handling
    const createTable = (sql, tableName) => {
      sqliteDb.run(sql, (err) => {
        if (err) {
          console.error(`Error creating ${tableName} table:`, err.message);
        } else {
          console.log(`${tableName} table ready`);
        }
      });
    };

    // Users table
    createTable(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mongo_id TEXT UNIQUE,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      'users'
    );
    
    // Bookings table
    createTable(
      `CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mongo_id TEXT UNIQUE,
        user_id TEXT NOT NULL,
        user_mongo_id TEXT NOT NULL,
        pickup_address TEXT NOT NULL,
        destination_address TEXT NOT NULL,
        distance_km REAL NOT NULL,
        duration_min INTEGER NOT NULL,
        fare_amount REAL NOT NULL,
        vehicle_type TEXT DEFAULT 'sedan',
        status TEXT DEFAULT 'pending',
        payment_method TEXT DEFAULT 'cash',
        payment_status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      'bookings'
    );
    
    // Ride analytics table
    createTable(
      `CREATE TABLE IF NOT EXISTS ride_analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id TEXT,
        user_id TEXT,
        distance_km REAL,
        duration_min INTEGER,
        fare_amount REAL,
        vehicle_type TEXT,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      'ride_analytics'
    );
    
    // Drivers table
    createTable(
      `CREATE TABLE IF NOT EXISTS drivers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mongo_id TEXT UNIQUE,
        user_id TEXT NOT NULL,
        user_mongo_id TEXT NOT NULL,
        license_number TEXT UNIQUE,
        vehicle_make TEXT,
        vehicle_model TEXT,
        vehicle_year INTEGER,
        vehicle_color TEXT,
        license_plate TEXT UNIQUE,
        is_available BOOLEAN DEFAULT 0,
        rating REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      'drivers'
    );
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/test', require('./routes/test'));
app.use('/api/health', require('./routes/health'));

// Health check endpoint
app.get('/api/health/databases', (req, res) => {
  res.json({
    success: true,
    databases: {
      mongodb: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        database: 'rydo'
      },
      sqlite: {
        status: req.sqliteEnabled ? 'connected' : 'disconnected',
        database: 'rydo.sqlite',
        enabled: req.sqliteEnabled
      }
    }
  });
});

// Start Background Sync Service
const backgroundSync = require('./background-sync');
backgroundSync.start();

// Global error handler

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, sqliteDb };