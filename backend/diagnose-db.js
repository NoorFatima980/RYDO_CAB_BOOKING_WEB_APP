const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'rydo.sqlite');

console.log('🔍 SQLite Database Diagnostic Tool');
console.log('='.repeat(60));

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Cannot open database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database:', dbPath);
});

// Check if tables exist and their structure
function diagnoseTables() {
  console.log('\n📋 STEP 1: Checking Tables');
  console.log('-'.repeat(40));
  
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error fetching tables:', err.message);
      return;
    }
    
    if (tables.length === 0) {
      console.log('❌ No tables found in database!');
      console.log('💡 The application might not have created tables yet.');
      checkIfDataExists();
      return;
    }
    
    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });
    
    // Check each table's structure and data
    tables.forEach(table => {
      diagnoseTable(table.name);
    });
  });
}

function diagnoseTable(tableName) {
  console.log(`\n📊 Diagnosing table: ${tableName}`);
  console.log('-'.repeat(30));
  
  // Check table structure
  db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
    if (err) {
      console.log(`   ❌ Cannot read table structure: ${err.message}`);
      return;
    }
    
    console.log(`   Columns (${columns.length}):`);
    columns.forEach(col => {
      console.log(`     - ${col.name} (${col.type})${col.pk ? ' [PRIMARY KEY]' : ''}`);
    });
    
    // Check row count
    db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
      if (err) {
        console.log(`   ❌ Cannot count rows: ${err.message}`);
        return;
      }
      
      console.log(`   Total rows: ${row.count}`);
      
      // Show sample data if table has rows
      if (row.count > 0) {
        db.all(`SELECT * FROM ${tableName} LIMIT 3`, (err, rows) => {
          if (err) {
            console.log(`   ❌ Cannot read data: ${err.message}`);
            return;
          }
          
          console.log(`   Sample data (first 3 rows):`);
          rows.forEach((rowData, index) => {
            console.log(`     Row ${index + 1}:`, JSON.stringify(rowData, null, 2));
          });
        });
      } else {
        console.log(`   ℹ️ No data in ${tableName} table`);
      }
    });
  });
}

function checkIfDataExists() {
  console.log('\n🔎 STEP 2: Checking for any data');
  console.log('-'.repeat(40));
  
  // Try to find any data using a different approach
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (tables && tables.length > 0) {
      tables.forEach(table => {
        db.get(`SELECT COUNT(*) as count FROM ${table.name}`, (err, row) => {
          if (!err) {
            console.log(`   ${table.name}: ${row.count} rows`);
          }
        });
      });
    }
  });
}

// Run diagnosis
diagnoseTables();

// Close after a delay to allow async operations
setTimeout(() => {
  db.close();
  console.log('\n✅ Diagnosis complete. Check the output above.');
  console.log('💡 If tables are missing, the application might not be writing to SQLite properly.');
}, 2000);