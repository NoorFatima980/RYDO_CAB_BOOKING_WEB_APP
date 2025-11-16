const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'rydo.sqlite');

console.log('🔍 Checking Actual Database Content');
console.log('='.repeat(50));

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Cannot open database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database\n');
});

// List ALL tables including any that might have different names
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Error:', err.message);
    db.close();
    return;
  }
  
  console.log('📋 ALL TABLES IN DATABASE:');
  tables.forEach(table => {
    console.log(`   - ${table.name}`);
  });
  console.log('');
  
  // Check each table
  tables.forEach(table => {
    console.log(`📊 Table: ${table.name}`);
    console.log('-'.repeat(30));
    
    // Show structure
    db.all(`PRAGMA table_info(${table.name})`, (err, columns) => {
      if (err) {
        console.log('   Error reading structure');
        return;
      }
      
      console.log('   Columns:');
      columns.forEach(col => {
        console.log(`     ${col.name} (${col.type})`);
      });
      
      // Show data
      db.all(`SELECT * FROM ${table.name} LIMIT 5`, (err, rows) => {
        if (err) {
          console.log('   Error reading data:', err.message);
          return;
        }
        
        console.log(`   Data (${rows.length} rows):`);
        if (rows.length > 0) {
          console.table(rows);
        } else {
          console.log('   No data');
        }
        console.log('');
      });
    });
  });
  
  setTimeout(() => db.close(), 1000);
});