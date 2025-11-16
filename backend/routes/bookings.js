const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Create booking - Store in both MongoDB and SQLite
router.post('/', auth, [
  body('pickup.address').notEmpty().withMessage('Pickup address is required'),
  body('destination.address').notEmpty().withMessage('Destination address is required'),
  body('distance').isNumeric().withMessage('Distance must be a number'),
  body('estimatedDuration').isNumeric().withMessage('Estimated duration must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      pickup,
      destination,
      stops = [],
      distance,
      estimatedDuration,
      vehicleType = 'sedan',
      scheduledAt
    } = req.body;

    // Calculate fare
    const baseFare = 40;
    const perKmRate = 12;
    const perMinuteRate = 2;
    const fare = Math.round(baseFare + (distance * perKmRate) + (estimatedDuration * perMinuteRate));

    // Create booking in MongoDB
    const booking = new Booking({
      user: req.user._id,
      pickup,
      destination,
      stops,
      distance,
      estimatedDuration,
      fare,
      vehicleType,
      scheduledAt
    });

    await booking.save();
    await booking.populate('user', 'name email phone');

    // Store in SQLite - FIXED VERSION
    if (req.sqliteEnabled && req.sqliteDb) {
      console.log('📝 Attempting to store booking in SQLite...');
      
      const sql = `
        INSERT INTO bookings (
          mongo_id, user_id, user_mongo_id, pickup_address, 
          destination_address, distance_km, duration_min, 
          fare_amount, vehicle_type, status, payment_method, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      req.sqliteDb.run(sql, [
        booking._id.toString(),
        req.user._id.toString(),
        req.user._id.toString(),
        pickup.address,
        destination.address,
        distance,
        estimatedDuration,
        fare,
        vehicleType,
        'pending',
        'cash',
        'pending'
      ], function(err) {
        if (err) {
          console.error('❌ Failed to store booking in SQLite:', err.message);
          console.error('SQL Error details:', err);
        } else {
          console.log('✅ Booking stored in SQLite with ID:', this.lastID);
        }
      });
    } else {
      console.log('⚠️ SQLite disabled or not available - skipping SQLite storage');
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find({ user: req.user._id })
      .populate('driver', 'user vehicle')
      .populate('user', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('driver', 'user vehicle currentLocation rating');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin/driver
    if (booking.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
});

// Update booking status - Sync both databases
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    
    // Update timestamps based on status
    if (status === 'in_progress' && !booking.startedAt) {
      booking.startedAt = new Date();
    } else if (status === 'completed' && !booking.completedAt) {
      booking.completedAt = new Date();
    }

    await booking.save();
    await booking.populate('user', 'name email phone');
    await booking.populate('driver', 'user vehicle');

    // Update SQLite with error handling
    if (req.sqliteEnabled && req.sqliteDb) {
      console.log('📝 Attempting to update booking status in SQLite...');
      
      const sql = `UPDATE bookings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE mongo_id = ?`;
      req.sqliteDb.run(sql, [status, req.params.id], function(err) {
        if (err) {
          console.error('❌ Failed to update booking in SQLite:', err.message);
        } else {
          console.log('✅ Booking updated in SQLite. Changes:', this.changes);
          
          // Store in analytics if completed
          if (status === 'completed') {
            console.log('📊 Storing completed ride in analytics...');
            
            const analyticsSql = `
              INSERT INTO ride_analytics 
              (booking_id, user_id, distance_km, duration_min, fare_amount, vehicle_type)
              VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            req.sqliteDb.run(analyticsSql, [
              booking._id.toString(),
              booking.user._id.toString(),
              booking.distance,
              booking.estimatedDuration,
              booking.fare,
              booking.vehicleType
            ], (analyticsErr) => {
              if (analyticsErr) {
                console.error('❌ Failed to store analytics in SQLite:', analyticsErr.message);
              } else {
                console.log('✅ Completed ride analytics stored in SQLite');
              }
            });
          }
        }
      });
    } else {
      console.log('⚠️ SQLite disabled - skipping SQLite update');
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking status'
    });
  }
});

// Cancel booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status} booking`
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Update SQLite with error handling
    if (req.sqliteEnabled && req.sqliteDb) {
      console.log('📝 Attempting to cancel booking in SQLite...');
      
      const sql = `UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE mongo_id = ?`;
      req.sqliteDb.run(sql, [req.params.id], function(err) {
        if (err) {
          console.error('❌ Failed to cancel booking in SQLite:', err.message);
        } else {
          console.log('✅ Booking cancelled in SQLite. Changes:', this.changes);
        }
      });
    } else {
      console.log('⚠️ SQLite disabled - skipping SQLite cancellation');
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
});

// Get booking analytics (for completed rides)
router.get('/analytics/summary', auth, async (req, res) => {
  try {
    // Get from MongoDB
    const mongoStats = await Booking.aggregate([
      { $match: { user: req.user._id, status: 'completed' } },
      {
        $group: {
          _id: null,
          totalRides: { $sum: 1 },
          totalDistance: { $sum: '$distance' },
          totalSpent: { $sum: '$fare' },
          avgFare: { $avg: '$fare' }
        }
      }
    ]);

    let sqliteStats = null;
    
    // Try to get from SQLite if available
    if (req.sqliteEnabled && req.sqliteDb) {
      sqliteStats = await new Promise((resolve) => {
        const sql = `
          SELECT 
            COUNT(*) as totalRides,
            SUM(distance_km) as totalDistance,
            SUM(fare_amount) as totalSpent,
            AVG(fare_amount) as avgFare
          FROM ride_analytics 
          WHERE user_id = ?
        `;
        
        req.sqliteDb.get(sql, [req.user._id.toString()], (err, row) => {
          if (err) {
            console.error('Error getting SQLite analytics:', err.message);
            resolve(null);
          } else {
            resolve(row);
          }
        });
      });
    }

    res.json({
      success: true,
      data: {
        mongodb: mongoStats[0] || { totalRides: 0, totalDistance: 0, totalSpent: 0, avgFare: 0 },
        sqlite: sqliteStats,
        source: sqliteStats ? 'Both databases' : 'MongoDB only'
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

module.exports = router;