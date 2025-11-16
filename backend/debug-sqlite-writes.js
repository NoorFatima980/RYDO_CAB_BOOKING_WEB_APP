const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'rydo.sqlite');

console.log('🔍 Debugging SQLite Write Operations');
console.log('='.repeat(60));

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Cannot open database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database\n');
});

// Check if we can write to SQLite
console.log('🧪 Testing SQLite Write Operations');
console.log('-'.repeat(40));

// Test 1: Insert a test user
const testUserSQL = `
  INSERT INTO users (mongo_id, name, email, phone, role) 
  VALUES (?, ?, ?, ?, ?)
`;

const testUserData = [
  'test_mongo_id_123',
  'Test User',
  'test@example.com', 
  '1234567890',
  'user'
];

db.run(testUserSQL, testUserData, function(err) {
  if (err) {
    console.error('❌ Failed to insert test user:', err.message);
  } else {
    console.log('✅ Test user inserted with ID:', this.lastID);
    
    // Test 2: Insert a test booking
    const testBookingSQL = `
      INSERT INTO bookings (
        mongo_id, user_id, user_mongo_id, pickup_address, 
        destination_address, distance_km, duration_min, 
        fare_amount, vehicle_type, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const testBookingData = [
      'test_booking_id_123',
      'test_mongo_id_123',
      'test_mongo_id_123',
      'Test Pickup Location',
      'Test Destination', 
      5.5,
      15,
      120,
      'sedan',
      'completed'
    ];
    
    db.run(testBookingSQL, testBookingData, function(err) {
      if (err) {
        console.error('❌ Failed to insert test booking:', err.message);
      } else {
        console.log('✅ Test booking inserted with ID:', this.lastID);
      }
      
      // Verify the data was written
      console.log('\n📊 Verifying written data:');
      console.log('-'.repeat(30));
      
      db.all('SELECT * FROM users', (err, users) => {
        if (err) {
          console.error('Error reading users:', err.message);
        } else {
          console.log('Users table:', users.length, 'rows');
          console.table(users);
        }
        
        db.all('SELECT * FROM bookings', (err, bookings) => {
          if (err) {
            console.error('Error reading bookings:', err.message);
          } else {
            console.log('Bookings table:', bookings.length, 'rows');
            console.table(bookings);
          }
          
          db.close();
          console.log('\n✅ Debug completed');
        });
      });
    });
  }
});