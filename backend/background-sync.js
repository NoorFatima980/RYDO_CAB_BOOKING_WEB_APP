const mongoose = require('mongoose');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, 'rydo.sqlite');

class BackgroundSync {
  constructor() {
    this.isRunning = false;
    this.syncInterval = 5000; // Sync every 5 seconds
    this.lastUserCount = 0;
    this.lastBookingCount = 0;
  }

  start() {
    if (this.isRunning) {
      console.log('🔄 Background sync already running');
      return;
    }

    console.log('🚀 Starting Background Auto-Sync Service...');
    this.isRunning = true;
    this.syncLoop();
  }

  stop() {
    this.isRunning = false;
    console.log('🛑 Background sync stopped');
  }

  async syncLoop() {
    while (this.isRunning) {
      try {
        await this.checkAndSync();
        await this.delay(this.syncInterval);
      } catch (error) {
        console.error('Background sync error:', error.message);
        await this.delay(this.syncInterval);
      }
    }
  }

  async checkAndSync() {
    if (!mongoose.connection.readyState) {
      console.log('⏳ Waiting for MongoDB connection...');
      return;
    }

    const User = require('./models/User');
    const Booking = require('./models/Booking');

    // Check for new users
    const currentUserCount = await User.countDocuments();
    if (currentUserCount > this.lastUserCount) {
      console.log(`🆕 Found ${currentUserCount - this.lastUserCount} new user(s), syncing...`);
      await this.syncNewUsers();
      this.lastUserCount = currentUserCount;
    }

    // Check for new bookings
    const currentBookingCount = await Booking.countDocuments();
    if (currentBookingCount > this.lastBookingCount) {
      console.log(`🆕 Found ${currentBookingCount - this.lastBookingCount} new booking(s), syncing...`);
      await this.syncNewBookings();
      this.lastBookingCount = currentBookingCount;
    }
  }

  async syncNewUsers() {
    const User = require('./models/User');
    const db = new sqlite3.Database(dbPath);

    try {
      const users = await User.find().select('-password').sort({ _id: -1 }).limit(10);
      
      for (const user of users) {
        await new Promise((resolve) => {
          const sql = `INSERT OR IGNORE INTO users (mongo_id, name, email, phone, role) VALUES (?, ?, ?, ?, ?)`;
          db.run(sql, [user._id.toString(), user.name, user.email, user.phone, user.role], (err) => {
            if (!err) {
              console.log('✅ Background Sync: User', user.email);
            }
            resolve();
          });
        });
      }
    } catch (error) {
      console.error('Background user sync error:', error.message);
    } finally {
      db.close();
    }
  }

  async syncNewBookings() {
    const Booking = require('./models/Booking');
    const db = new sqlite3.Database(dbPath);

    try {
      const bookings = await Booking.find()
        .populate('user')
        .sort({ _id: -1 })
        .limit(10);

      for (const booking of bookings) {
        if (!booking.user) continue;

        await new Promise((resolve) => {
          const sql = `
            INSERT OR IGNORE INTO bookings (
              mongo_id, user_id, user_mongo_id, pickup_address, 
              destination_address, distance_km, duration_min, 
              fare_amount, vehicle_type, status, payment_method, payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          
          db.run(sql, [
            booking._id.toString(),
            booking.user._id.toString(),
            booking.user._id.toString(),
            booking.pickup?.address || 'Unknown',
            booking.destination?.address || 'Unknown',
            booking.distance || 0,
            booking.estimatedDuration || 0,
            booking.fare || 0,
            booking.vehicleType || 'sedan',
            booking.status || 'pending',
            booking.payment?.method || 'cash',
            booking.payment?.status || 'pending'
          ], (err) => {
            if (!err) {
              console.log('✅ Background Sync: Booking', booking.pickup?.address, '→', booking.destination?.address);
              
              // Sync analytics for completed rides
              if (booking.status === 'completed') {
                const analyticsSql = `INSERT OR IGNORE INTO ride_analytics (booking_id, user_id, distance_km, duration_min, fare_amount, vehicle_type) VALUES (?, ?, ?, ?, ?, ?)`;
                db.run(analyticsSql, [
                  booking._id.toString(),
                  booking.user._id.toString(),
                  booking.distance || 0,
                  booking.estimatedDuration || 0,
                  booking.fare || 0,
                  booking.vehicleType || 'sedan'
                ]);
              }
            }
            resolve();
          });
        });
      }
    } catch (error) {
      console.error('Background booking sync error:', error.message);
    } finally {
      db.close();
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new BackgroundSync();