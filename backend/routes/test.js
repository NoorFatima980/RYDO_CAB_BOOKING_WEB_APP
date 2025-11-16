const express = require('express');
const { sqliteDb } = require('../server');
const User = require('../models/User');
const Booking = require('../models/Booking');
const router = express.Router();

// Test data synchronization between MongoDB and SQLite
router.get('/sync-test', async (req, res) => {
  try {
    // Get counts from both databases
    const mongoUsers = await User.countDocuments();
    const mongoBookings = await Booking.countDocuments();

    // Get counts from SQLite
    const sqliteCounts = await new Promise((resolve, reject) => {
      const counts = {};
      
      sqliteDb.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
        if (err) return reject(err);
        counts.users = row.count;
        
        sqliteDb.get('SELECT COUNT(*) as count FROM bookings', [], (err, row) => {
          if (err) return reject(err);
          counts.bookings = row.count;
          
          sqliteDb.get('SELECT COUNT(*) as count FROM ride_analytics', [], (err, row) => {
            if (err) return reject(err);
            counts.analytics = row.count;
            resolve(counts);
          });
        });
      });
    });

    // Get sample data from both databases
    const mongoSampleUser = await User.findOne().select('name email phone role');
    const mongoSampleBooking = await Booking.findOne().populate('user', 'name email');

    const sqliteSampleUser = await new Promise((resolve) => {
      sqliteDb.get('SELECT * FROM users ORDER BY id DESC LIMIT 1', [], (err, row) => {
        resolve(row);
      });
    });

    const sqliteSampleBooking = await new Promise((resolve) => {
      sqliteDb.get('SELECT * FROM bookings ORDER BY id DESC LIMIT 1', [], (err, row) => {
        resolve(row);
      });
    });

    res.json({
      success: true,
      message: 'Dual database synchronization test',
      database_counts: {
        mongodb: {
          users: mongoUsers,
          bookings: mongoBookings
        },
        sqlite: sqliteCounts
      },
      sample_data: {
        mongodb: {
          user: mongoSampleUser,
          booking: mongoSampleBooking
        },
        sqlite: {
          user: sqliteSampleUser,
          booking: sqliteSampleBooking
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sync test failed',
      error: error.message
    });
  }
});

// View all data from SQLite
router.get('/sqlite-data', (req, res) => {
  const { table } = req.query;
  const validTables = ['users', 'bookings', 'ride_analytics', 'drivers'];
  
  if (!table || !validTables.includes(table)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid table name: users, bookings, ride_analytics, drivers'
    });
  }

  const sql = `SELECT * FROM ${table} ORDER BY id DESC LIMIT 50`;
  
  sqliteDb.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: `Failed to fetch data from ${table}`,
        error: err.message
      });
    }

    res.json({
      success: true,
      table,
      count: rows.length,
      data: rows
    });
  });
});

// View all data from MongoDB
router.get('/mongodb-data', async (req, res) => {
  const { collection } = req.query;
  const validCollections = ['users', 'bookings'];
  
  if (!collection || !validCollections.includes(collection)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid collection name: users, bookings'
    });
  }

  try {
    let data;
    if (collection === 'users') {
      data = await User.find().select('-password').sort({ createdAt: -1 }).limit(50);
    } else if (collection === 'bookings') {
      data = await Booking.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(50);
    }

    res.json({
      success: true,
      collection,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch data from ${collection}`,
      error: error.message
    });
  }
});

// Create test data in both databases
router.post('/test-data', async (req, res) => {
  try {
    // Create test user in MongoDB
    const testUser = new User({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      phone: '9876543210',
      password: 'password123',
      role: 'user'
    });
    await testUser.save();

    // Create test user in SQLite
    const userSql = `INSERT INTO users (mongo_id, name, email, phone, role) VALUES (?, ?, ?, ?, ?)`;
    sqliteDb.run(userSql, [testUser._id.toString(), testUser.name, testUser.email, testUser.phone, testUser.role]);

    // Create test booking in MongoDB
    const testBooking = new Booking({
      user: testUser._id,
      pickup: { address: 'Test Pickup Location' },
      destination: { address: 'Test Destination' },
      distance: 5.5,
      estimatedDuration: 15,
      fare: 120,
      vehicleType: 'sedan',
      status: 'completed'
    });
    await testBooking.save();

    // Create test booking in SQLite
    const bookingSql = `
      INSERT INTO bookings (
        mongo_id, user_id, user_mongo_id, pickup_address, destination_address,
        distance_km, duration_min, fare_amount, vehicle_type, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    sqliteDb.run(bookingSql, [
      testBooking._id.toString(),
      testUser._id.toString(),
      testUser._id.toString(),
      'Test Pickup Location',
      'Test Destination',
      5.5,
      15,
      120,
      'sedan',
      'completed'
    ]);

    // Create analytics entry
    const analyticsSql = `
      INSERT INTO ride_analytics 
      (booking_id, user_id, distance_km, duration_min, fare_amount, vehicle_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    sqliteDb.run(analyticsSql, [
      testBooking._id.toString(),
      testUser._id.toString(),
      5.5,
      15,
      120,
      'sedan'
    ]);

    res.json({
      success: true,
      message: 'Test data created successfully in both databases',
      data: {
        user: testUser,
        booking: testBooking
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create test data',
      error: error.message
    });
  }
});

module.exports = router;