const express = require('express');
const { sqliteDb } = require('../server');
const mongoose = require('mongoose');
const router = express.Router();

// Database health check
router.get('/databases', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check SQLite connection
    let sqliteStatus = 'disconnected';
    try {
      await new Promise((resolve, reject) => {
        sqliteDb.get('SELECT 1 as test', [], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      sqliteStatus = 'connected';
    } catch (error) {
      sqliteStatus = 'error: ' + error.message;
    }

    res.json({
      success: true,
      databases: {
        mongodb: {
          status: mongoStatus,
          database: 'rydo',
          collections: ['users', 'bookings', 'drivers']
        },
        sqlite: {
          status: sqliteStatus,
          database: 'rydo.sqlite',
          tables: ['users', 'bookings', 'ride_analytics', 'drivers']
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message
    });
  }
});

module.exports = router;