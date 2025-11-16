const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'rydo.sqlite');

console.log('🧪 Testing SQL Queries');
console.log('='.repeat(50));

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Cannot open database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database\n');
});

const testQueries = [
  {
    name: 'Test 1: List all tables',
    sql: "SELECT name FROM sqlite_master WHERE type='table'"
  },
  {
    name: 'Test 2: Check users table structure',
    sql: "PRAGMA table_info(users)"
  },
  {
    name: 'Test 3: Simple users query',
    sql: "SELECT * FROM users LIMIT 5"
  },
  {
    name: 'Test 4: Count users',
    sql: "SELECT COUNT(*) as user_count FROM users"
  },
  {
    name: 'Test 5: Check bookings table structure',
    sql: "PRAGMA table_info(bookings)"
  },
  {
    name: 'Test 6: Simple bookings query',
    sql: "SELECT * FROM bookings LIMIT 5"
  },
  {
    name: 'Test 7: Join users and bookings',
    sql: `SELECT 
            u.name as user_name,
            b.pickup_address,
            b.destination_address,
            b.fare_amount,
            b.status
          FROM bookings b
          LEFT JOIN users u ON b.user_mongo_id = u.mongo_id
          LIMIT 5`
  }
];

let completed = 0;

testQueries.forEach((test, index) => {
  console.log(`\n${test.name}`);
  console.log('-'.repeat(40));
  console.log(`SQL: ${test.sql}`);
  
  db.all(test.sql, [], (err, rows) => {
    if (err) {
      console.log(`❌ ERROR: ${err.message}`);
    } else {
      console.log(`✅ SUCCESS: ${rows.length} rows returned`);
      if (rows.length > 0) {
        console.table(rows);
      }
    }
    
    completed++;
    if (completed === testQueries.length) {
      db.close();
      console.log('\n✅ All tests completed');
    }
  });
});