const express = require('express');
const { sqliteDb } = require('../server');
const { auth, authorize } = require('../middleware/auth');
const Booking = require('../models/Booking');
const router = express.Router();

// Store ride analytics in SQLite
router.post('/ride', auth, async (req, res) => {
  try {
    const { ride_id, user_id, driver_id, distance_km, duration_min, fare_amount, payment_status } = req.body;

    const sql = `INSERT INTO ride_analytics 
                 (user_id, driver_id, ride_id, distance_km, duration_min, fare_amount, payment_status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    sqliteDb.run(sql, [user_id, driver_id, ride_id, distance_km, duration_min, fare_amount, payment_status], function(err) {
      if (err) {
        console.error('SQLite insert error:', err);
        return res.status(500).json({
          success: false,
          message: 'Error storing analytics data'
        });
      }

      res.json({
        success: true,
        message: 'Ride analytics stored successfully',
        data: { id: this.lastID }
      });
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while storing analytics'
    });
  }
});

// Get ride analytics
router.get('/rides', auth, authorize('admin'), async (req, res) => {
  try {
    const sql = `SELECT * FROM ride_analytics ORDER BY ride_date DESC LIMIT 100`;
    
    sqliteDb.all(sql, [], (err, rows) => {
      if (err) {
        console.error('SQLite query error:', err);
        return res.status(500).json({
          success: false,
          message: 'Error fetching analytics data'
        });
      }

      res.json({
        success: true,
        data: { analytics: rows }
      });
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// Get dashboard stats (admin only)
router.get('/dashboard', auth, authorize('admin'), async (req, res) => {
  try {
    // Get stats from MongoDB
    const totalUsers = await require('../models/User').countDocuments();
    const totalDrivers = await require('../models/Driver').countDocuments();
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$fare' } } }
    ]);

    // Get stats from SQLite
    const sql = `SELECT 
                  COUNT(*) as total_rides,
                  SUM(distance_km) as total_distance,
                  AVG(fare_amount) as avg_fare
                 FROM ride_analytics`;
    
    sqliteDb.get(sql, [], (err, row) => {
      if (err) {
        console.error('SQLite dashboard query error:', err);
        return res.status(500).json({
          success: false,
          message: 'Error fetching dashboard data'
        });
      }

      res.json({
        success: true,
        data: {
          users: totalUsers,
          drivers: totalDrivers,
          bookings: totalBookings,
          completedRides: completedBookings,
          revenue: totalRevenue[0]?.total || 0,
          analytics: row
        }
      });
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
});

module.exports = router;