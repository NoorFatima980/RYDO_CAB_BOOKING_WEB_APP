const express = require('express');
const { body, validationResult } = require('express-validator');
const Driver = require('../models/Driver');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Register as driver
router.post('/register', auth, [
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('vehicle.make').notEmpty().withMessage('Vehicle make is required'),
  body('vehicle.model').notEmpty().withMessage('Vehicle model is required'),
  body('vehicle.year').isNumeric().withMessage('Vehicle year must be a number'),
  body('vehicle.color').notEmpty().withMessage('Vehicle color is required'),
  body('vehicle.licensePlate').notEmpty().withMessage('License plate is required')
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

    // Check if user is already a driver
    const existingDriver = await Driver.findOne({ user: req.user._id });
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a driver'
      });
    }

    const driverData = {
      user: req.user._id,
      ...req.body
    };

    const driver = new Driver(driverData);
    await driver.save();

    // Update user role to driver
    await User.findByIdAndUpdate(req.user._id, { role: 'driver' });

    res.status(201).json({
      success: true,
      message: 'Driver registration submitted successfully',
      data: { driver }
    });
  } catch (error) {
    console.error('Driver registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during driver registration'
    });
  }
});

// Get driver profile
router.get('/profile', auth, authorize('driver'), async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user._id })
      .populate('user', 'name email phone');

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver profile not found'
      });
    }

    res.json({
      success: true,
      data: { driver }
    });
  } catch (error) {
    console.error('Get driver profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching driver profile'
    });
  }
});

// Update driver availability
router.patch('/availability', auth, authorize('driver'), async (req, res) => {
  try {
    const { isAvailable } = req.body;

    const driver = await Driver.findOneAndUpdate(
      { user: req.user._id },
      { isAvailable },
      { new: true }
    ).populate('user', 'name email phone');

    res.json({
      success: true,
      message: `Driver ${isAvailable ? 'available' : 'unavailable'}`,
      data: { driver }
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating availability'
    });
  }
});

// Get all drivers (admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const drivers = await Driver.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Driver.countDocuments();

    res.json({
      success: true,
      data: {
        drivers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching drivers'
    });
  }
});

// Get available drivers
router.get('/available', auth, async (req, res) => {
  try {
    const drivers = await Driver.find({ isAvailable: true })
      .populate('user', 'name phone')
      .select('vehicle currentLocation rating');

    res.json({
      success: true,
      data: { drivers }
    });
  } catch (error) {
    console.error('Get available drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available drivers'
    });
  }
});

module.exports = router;