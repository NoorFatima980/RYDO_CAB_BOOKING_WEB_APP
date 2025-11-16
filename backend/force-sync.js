const mongoose = require('mongoose');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, 'rydo.sqlite');

console.log('🔄 Force Syncing MongoDB to SQLite');
console.log('='.repeat(50));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  syncData();
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

async function syncData() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ SQLite connection error:', err.message);
      return;
    }
    console.log('✅ Connected to SQLite');
  });

  try {
    // Sync Users
    const User = require('./models/User');
    const users = await User.find().select('-password');
    
    console.log(`\n👥 Syncing ${users.length} users to SQLite...`);
    
    let usersSynced = 0;
    for (const user of users) {
      const sql = `INSERT OR REPLACE INTO users (mongo_id, name, email, phone, role) VALUES (?, ?, ?, ?, ?)`;
      
      await new Promise((resolve) => {
        db.run(sql, [user._id.toString(), user.name, user.email, user.phone, user.role], function(err) {
          if (err) {
            console.error(`❌ Failed to sync user ${user.email}:`, err.message);
          } else {
            usersSynced++;
            console.log(`✅ Synced user: ${user.name} (${user.email})`);
          }
          resolve();
        });
      });
    }
    
    console.log(`✅ ${usersSynced}/${users.length} users synced`);
    
    // Sync Bookings - FIXED: Handle missing user data
    const Booking = require('./models/Booking');
    
    // Get bookings with proper population and handle missing users
    const bookings = await Booking.find()
      .populate('user', 'name email _id')
      .lean(); // Use lean() for better performance
    
    console.log(`\n🚗 Syncing ${bookings.length} bookings to SQLite...`);
    
    let bookingsSynced = 0;
    let bookingsSkipped = 0;
    
    for (const booking of bookings) {
      // Check if booking has a valid user
      if (!booking.user || !booking.user._id) {
        console.log(`⚠️ Skipping booking ${booking._id}: No user associated`);
        bookingsSkipped++;
        continue;
      }
      
      const sql = `
        INSERT OR REPLACE INTO bookings (
          mongo_id, user_id, user_mongo_id, pickup_address, 
          destination_address, distance_km, duration_min, 
          fare_amount, vehicle_type, status, payment_method, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      await new Promise((resolve) => {
        db.run(sql, [
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
            console.error(`❌ Failed to sync booking ${booking._id}:`, err.message);
            bookingsSkipped++;
          } else {
            bookingsSynced++;
            console.log(`✅ Synced booking: ${booking.pickup?.address || 'Unknown'} → ${booking.destination?.address || 'Unknown'}`);
          }
          resolve();
        });
      });
    }
    
    console.log(`✅ ${bookingsSynced}/${bookings.length} bookings synced, ${bookingsSkipped} skipped`);
    
    // Sync completed rides to analytics
    console.log(`\n📊 Syncing completed rides to analytics...`);
    
    const completedBookings = bookings.filter(b => b.status === 'completed');
    let analyticsSynced = 0;
    
    for (const booking of completedBookings) {
      if (!booking.user || !booking.user._id) continue;
      
      const analyticsSql = `
        INSERT OR REPLACE INTO ride_analytics 
        (booking_id, user_id, distance_km, duration_min, fare_amount, vehicle_type)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      await new Promise((resolve) => {
        db.run(analyticsSql, [
          booking._id.toString(),
          booking.user._id.toString(),
          booking.distance || 0,
          booking.estimatedDuration || 0,
          booking.fare || 0,
          booking.vehicleType || 'sedan'
        ], function(err) {
          if (err) {
            console.error(`❌ Failed to sync analytics for booking ${booking._id}:`, err.message);
          } else {
            analyticsSynced++;
          }
          resolve();
        });
      });
    }
    
    console.log(`✅ ${analyticsSynced}/${completedBookings.length} analytics records synced`);
    
    // Final verification
    console.log('\n📊 Final SQLite Database Status:');
    
    const tables = ['users', 'bookings', 'ride_analytics'];
    let tablesChecked = 0;
    
    tables.forEach(table => {
      db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
        if (err) {
          console.log(`   ${table}: Error - ${err.message}`);
        } else {
          console.log(`   ${table}: ${row.count} rows`);
        }
        
        tablesChecked++;
        if (tablesChecked === tables.length) {
          setTimeout(() => {
            db.close();
            mongoose.connection.close();
            console.log('\n🎉 Force sync completed successfully!');
            console.log('💡 Now test with new registrations and bookings in the frontend');
          }, 1000);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Sync error:', error);
    console.error('Error stack:', error.stack);
    db.close();
    mongoose.connection.close();
  }
}