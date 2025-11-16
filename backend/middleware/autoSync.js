const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../rydo.sqlite');

// Simple sync function for individual records
class AutoSync {
  constructor() {
    this.db = new sqlite3.Database(dbPath);
    console.log('🔄 AutoSync middleware initialized');
  }

  // Sync user to SQLite
  async syncUser(user) {
    return new Promise((resolve) => {
      const sql = `INSERT OR REPLACE INTO users (mongo_id, name, email, phone, role) VALUES (?, ?, ?, ?, ?)`;
      
      this.db.run(sql, [
        user._id.toString(),
        user.name,
        user.email,
        user.phone,
        user.role || 'user'
      ], function(err) {
        if (err) {
          console.error('❌ AutoSync: Failed to sync user:', err.message);
        } else {
          console.log('✅ AutoSync: User synced to SQLite -', user.email);
        }
        resolve();
      });
    });
  }

  // Sync booking to SQLite
  async syncBooking(booking) {
    return new Promise((resolve) => {
      const sql = `
        INSERT OR REPLACE INTO bookings (
          mongo_id, user_id, user_mongo_id, pickup_address, 
          destination_address, distance_km, duration_min, 
          fare_amount, vehicle_type, status, payment_method, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(sql, [
        booking._id.toString(),
        booking.user._id.toString(),
        booking.user._id.toString(),
        booking.pickup?.address || 'Unknown Location',
        booking.destination?.address || 'Unknown Destination',
        booking.distance || 0,
        booking.estimatedDuration || 0,
        booking.fare || 0,
        booking.vehicleType || 'sedan',
        booking.status || 'pending',
        booking.payment?.method || 'cash',
        booking.payment?.status || 'pending'
      ], function(err) {
        if (err) {
          console.error('❌ AutoSync: Failed to sync booking:', err.message);
        } else {
          console.log('✅ AutoSync: Booking synced to SQLite -', booking.pickup?.address, '→', booking.destination?.address);
        }
        resolve();
      });
    });
  }

  // Sync completed ride to analytics
  async syncAnalytics(booking) {
    if (booking.status !== 'completed') return;
    
    return new Promise((resolve) => {
      const sql = `
        INSERT OR REPLACE INTO ride_analytics 
        (booking_id, user_id, distance_km, duration_min, fare_amount, vehicle_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      this.db.run(sql, [
        booking._id.toString(),
        booking.user._id.toString(),
        booking.distance || 0,
        booking.estimatedDuration || 0,
        booking.fare || 0,
        booking.vehicleType || 'sedan'
      ], function(err) {
        if (err) {
          console.error('❌ AutoSync: Failed to sync analytics:', err.message);
        } else {
          console.log('✅ AutoSync: Analytics synced for completed ride');
        }
        resolve();
      });
    });
  }
}

const autoSync = new AutoSync();
module.exports = autoSync;