const { sqliteDb, sqliteEnabled } = require('./server');

console.log('🔧 Checking Application SQLite Configuration');
console.log('='.repeat(50));

console.log('SQLite Enabled:', sqliteEnabled);
console.log('SQLite Database:', sqliteDb ? 'Connected' : 'Not connected');

// Check if the SQLite DB is properly exported
if (sqliteDb) {
  console.log('\n✅ SQLite is properly configured in the application');
  
  // Test a simple query
  sqliteDb.get('SELECT 1 as test', [], (err, row) => {
    if (err) {
      console.error('❌ SQLite query test failed:', err.message);
    } else {
      console.log('✅ SQLite query test passed:', row);
    }
  });
} else {
  console.log('\n❌ SQLite is NOT properly configured in the application');
  console.log('💡 Check your server.js export and .env configuration');
}