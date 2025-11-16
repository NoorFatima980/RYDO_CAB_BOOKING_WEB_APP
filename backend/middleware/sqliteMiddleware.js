const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class SQLiteMiddleware {
  constructor() {
    this.dbPath = path.join(__dirname, '../rydo.sqlite');
    this.sqliteDb = null;
    this.sqliteEnabled = false;
    this.init();
  }

  init() {
    try {
      // Check if database file exists or can be created
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      this.sqliteDb = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ SQLite database error:', err.message);
          this.sqliteEnabled = false;
          return;
        }
        
        console.log('✅ Connected to SQLite database');
        this.sqliteEnabled = true;
        this.createTables();
      });

    } catch (error) {
      console.error('❌ SQLite initialization failed:', error.message);
      this.sqliteEnabled = false;
    }
  }

  createTables() {
    const tables = [
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
      
      `CREATE TABLE IF NOT EXISTS ride_analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id TEXT,
        user_id TEXT,
        distance_km REAL,
        duration_min INTEGER,
        fare_amount REAL,
        vehicle_type TEXT,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];
    
    let tablesCreated = 0;
    tables.forEach((sql, index) => {
      this.sqliteDb.run(sql, (err) => {
        if (err) {
          console.error(`❌ Error creating table ${index + 1}:`, err.message);
        } else {
          tablesCreated++;
          console.log(`✅ Table ${index + 1} ready`);
        }
      });
    });
  }

  getMiddleware() {
    return (req, res, next) => {
      req.sqliteDb = this.sqliteDb;
      req.sqliteEnabled = this.sqliteEnabled;
      next();
    };
  }

  // Method to manually sync a user
  async syncUser(user) {
    if (!this.sqliteEnabled || !this.sqliteDb) {
      console.log('⚠️ SQLite not available for user sync');
      return;
    }

    return new Promise((resolve) => {
      const sql = `INSERT OR REPLACE INTO users (mongo_id, name, email, phone, role) VALUES (?, ?, ?, ?, ?)`;
      
      this.sqliteDb.run(sql, [
        user._id.toString(),
        user.name,
        user.email,
        user.phone,
        user.role || 'user'
      ], function(err) {
        if (err) {
          console.error('❌ Failed to sync user to SQLite:', err.message);
        } else {
          console.log('✅ User synced to SQLite:', user.email);
        }
        resolve();
      });
    });
  }

  // Method to manually sync a booking
  async syncBooking(booking) {
    if (!this.sqliteEnabled || !this.sqliteDb) {
      console.log('⚠️ SQLite not available for booking sync');
      return;
    }

    return new Promise((resolve) => {
      const sql = `
        INSERT OR REPLACE INTO bookings (
          mongo_id, user_id, user_mongo_id, pickup_address, 
          destination_address, distance_km, duration_min, 
          fare_amount, vehicle_type, status, payment_method, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.sqliteDb.run(sql, [
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
          console.error('❌ Failed to sync booking to SQLite:', err.message);
        } else {
          console.log('✅ Booking synced to SQLite:', booking.pickup?.address, '→', booking.destination?.address);
        }
        resolve();
      });
    });
  }
}

module.exports = new SQLiteMiddleware();