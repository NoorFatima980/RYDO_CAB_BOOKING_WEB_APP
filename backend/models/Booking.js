const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  pickup: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  destination: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  stops: [{
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],
  distance: {
    type: Number, // in kilometers
    required: true
  },
  estimatedDuration: {
    type: Number, // in minutes
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['hatchback', 'sedan', 'suv', 'luxury'],
    default: 'sedan'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'driver_assigned', 'arrived', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'upi'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    transactionId: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);