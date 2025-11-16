const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'rydo.sqlite');

console.log('👀 Live SQLite Monitor - Watching for new data');
console.log('='.repeat(50));
console.log('💡 Keep this running and perform actions in the frontend');
console.log('📱 The monitor will show new data as it appears in SQLite');
console.log('='.repeat(50));

let previousUsers = 0;
let previousBookings = 0;

function checkData() {
  const db = new sqlite3.Database(dbPath);
  
  // Check users count
  db.get('SELECT COUNT(*) as count FROM users', (err, userRow) => {
    if (err) {
      console.log('❌ Error checking users:', err.message);
      return;
    }
    
    // Check bookings count  
    db.get('SELECT COUNT(*) as count FROM bookings', (err, bookingRow) => {
      if (err) {
        console.log('❌ Error checking bookings:', err.message);
        return;
      }
      
      const now = new Date().toLocaleTimeString();
      const userCount = userRow.count;
      const bookingCount = bookingRow.count;
      
      // Show changes
      if (userCount > previousUsers || bookingCount > previousBookings) {
        console.log(`\n🆕 NEW DATA DETECTED at ${now}`);
        console.log(`   Users: ${previousUsers} → ${userCount} (+${userCount - previousUsers})`);
        console.log(`   Bookings: ${previousBookings} → ${bookingCount} (+${bookingCount - previousBookings})`);
        
        // Show latest data
        if (userCount > previousUsers) {
          db.all('SELECT * FROM users ORDER BY id DESC LIMIT 3', (err, newUsers) => {
            if (!err && newUsers.length > 0) {
              console.log('   Latest users:');
              newUsers.forEach(user => {
                console.log(`     - ${user.name} (${user.email})`);
              });
            }
          });
        }
        
        if (bookingCount > previousBookings) {
          db.all('SELECT * FROM bookings ORDER BY id DESC LIMIT 3', (err, newBookings) => {
            if (!err && newBookings.length > 0) {
              console.log('   Latest bookings:');
              newBookings.forEach(booking => {
                console.log(`     - ${booking.pickup_address} → ${booking.destination_address} (₹${booking.fare_amount})`);
              });
            }
          });
        }
      } else {
        console.log(`[${now}] Monitoring... Users: ${userCount}, Bookings: ${bookingCount}`);
      }
      
      previousUsers = userCount;
      previousBookings = bookingCount;
      db.close();
    });
  });
}

// Check every 2 seconds
setInterval(checkData, 2000);

// Initial check
checkData();

console.log('\n🎯 Ready! Now perform these actions in your frontend:');
console.log('   1. Register a new user');
console.log('   2. Login with that user');
console.log('   3. Book a ride');
console.log('   4. Complete/cancel a ride');
console.log('\n⏹️  Press Ctrl+C to stop monitoring');