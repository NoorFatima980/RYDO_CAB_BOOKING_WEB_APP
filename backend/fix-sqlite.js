const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'rydo.sqlite');

console.log('🔧 SQLite Database Fix Tool');
console.log('='.repeat(50));

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Cannot open database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database\n');
});

// Create tables if they don't exist
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
  db.run(sql, (err) => {
    if (err) {
      console.error(`❌ Error creating table ${index + 1}:`, err.message);
    } else {
      console.log(`✅ Table ${index + 1} created/verified`);
      tablesCreated++;
    }
    
    // Check if all tables are done
    if (index === tables.length - 1) {
      console.log(`\n📊 Created/verified ${tablesCreated} out of ${tables.length} tables`);
      
      // Verify tables exist
      db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, existingTables) => {
        if (err) {
          console.error('Error verifying tables:', err.message);
        } else {
          console.log('\n📋 Current tables in database:');
          existingTables.forEach(table => {
            console.log(`   - ${table.name}`);
          });
        }
        
        db.close();
        console.log('\n✅ Fix tool completed');
      });
    }
  });
});