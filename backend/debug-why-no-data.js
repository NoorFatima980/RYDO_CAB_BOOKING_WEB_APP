const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('🔍 Debugging: Why data is not appearing in SQLite');
console.log('='.repeat(60));

const dbPath = path.join(__dirname, 'rydo.sqlite');

// Check 1: Database file exists and is accessible
console.log('\n1. Checking database file...');
if (!fs.existsSync(dbPath)) {
  console.log('❌ Database file does not exist!');
  console.log('💡 The application might not be creating the database');
  process.exit(1);
}
console.log('✅ Database file exists');

// Check 2: Can we write to the database?
console.log('\n2. Testing write permissions...');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.log('❌ Cannot open database:', err.message);
    process.exit(1);
  }
  console.log('✅ Can open database');
});

// Test write operation
const testData = {
  name: 'Debug Test User',
  email: `debug-${Date.now()}@test.com`,
  phone: '0000000000',
  role: 'user'
};

db.run(
  'INSERT INTO users (mongo_id, name, email, phone, role) VALUES (?, ?, ?, ?, ?)',
  ['debug-mongo-id', testData.name, testData.email, testData.phone, testData.role],
  function(err) {
    if (err) {
      console.log('❌ Cannot write to database:', err.message);
    } else {
      console.log('✅ Can write to database (test record inserted)');
      
      // Verify we can read it back
      db.get('SELECT * FROM users WHERE email = ?', [testData.email], (err, row) => {
        if (err) {
          console.log('❌ Cannot read from database:', err.message);
        } else if (row) {
          console.log('✅ Can read from database (test record verified)');
          console.log('   Test record:', row);
        }
        
        // Clean up test record
        db.run('DELETE FROM users WHERE email = ?', [testData.email], (err) => {
          if (err) {
            console.log('⚠️ Could not clean up test record:', err.message);
          } else {
            console.log('✅ Cleaned up test record');
          }
          
          checkApplicationLogs();
        });
      });
    }
  }
);

function checkApplicationLogs() {
  console.log('\n3. Checking application configuration...');
  console.log('💡 Look at your server console when you:');
  console.log('   - Register a user');
  console.log('   - Create a booking');
  console.log('');
  console.log('📝 You should see messages like:');
  console.log('   "📝 Attempting to store user in SQLite..."');
  console.log('   "✅ User stored in SQLite with ID: ..."');
  console.log('   OR');
  console.log('   "⚠️ SQLite disabled or not available - skipping SQLite storage"');
  console.log('');
  console.log('🔧 If you see "SQLite disabled", check:');
  console.log('   - Your server.js SQLite configuration');
  console.log('   - The req.sqliteEnabled middleware');
  
  db.close();
  console.log('\n✅ Debug completed');
}