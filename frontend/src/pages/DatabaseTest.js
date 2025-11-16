import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const DatabaseTest = () => {
  const [syncResults, setSyncResults] = useState(null);
  const [sqliteData, setSqliteData] = useState(null);
  const [mongoData, setMongoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState('users');
  const [selectedCollection, setSelectedCollection] = useState('users');

  const runSyncTest = async () => {
    setLoading(true);
    try {
      const response = await api.get('/test/sync-test');
      setSyncResults(response.data);
    } catch (error) {
      setSyncResults({
        success: false,
        message: 'Sync test failed',
        error: error.response?.data?.message || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSqliteData = async () => {
    try {
      const response = await api.get(`/test/sqlite-data?table=${selectedTable}`);
      setSqliteData(response.data);
    } catch (error) {
      console.error('Failed to fetch SQLite data:', error);
    }
  };

  const fetchMongoData = async () => {
    try {
      const response = await api.get(`/test/mongodb-data?collection=${selectedCollection}`);
      setMongoData(response.data);
    } catch (error) {
      console.error('Failed to fetch MongoDB data:', error);
    }
  };

  const createTestData = async () => {
    try {
      const response = await api.post('/test/test-data');
      alert('Test data created successfully!');
      console.log('Test data:', response.data);
    } catch (error) {
      alert('Failed to create test data: ' + error.message);
    }
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <h1>Dual Database Test</h1>
        <p>Verify that data is stored in both MongoDB and SQLite simultaneously</p>

        {/* Sync Test */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>Database Synchronization Test</h2>
          <p>Check if data is properly synchronized between MongoDB and SQLite</p>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button onClick={runSyncTest} className="btn btn-primary" disabled={loading}>
              {loading ? 'Testing...' : 'Run Sync Test'}
            </button>
            <button onClick={createTestData} className="btn btn-secondary">
              Create Test Data
            </button>
          </div>

          {syncResults && (
            <div>
              <h3>Results</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h4>MongoDB</h4>
                  <pre style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '4px' }}>
                    {JSON.stringify(syncResults.database_counts?.mongodb, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4>SQLite</h4>
                  <pre style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '4px' }}>
                    {JSON.stringify(syncResults.database_counts?.sqlite, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SQLite Data Viewer */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>SQLite Data</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <select 
              value={selectedTable} 
              onChange={(e) => setSelectedTable(e.target.value)}
              className="form-control"
              style={{ width: 'auto' }}
            >
              <option value="users">Users</option>
              <option value="bookings">Bookings</option>
              <option value="ride_analytics">Ride Analytics</option>
              <option value="drivers">Drivers</option>
            </select>
            <button onClick={fetchSqliteData} className="btn btn-secondary">
              Fetch SQLite Data
            </button>
          </div>

          {sqliteData && (
            <div>
              <h4>{sqliteData.table} Table ({sqliteData.count} records)</h4>
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                <pre style={{ background: '#1F2937', color: 'white', padding: '1rem', borderRadius: '4px' }}>
                  {JSON.stringify(sqliteData.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* MongoDB Data Viewer */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2>MongoDB Data</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <select 
              value={selectedCollection} 
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="form-control"
              style={{ width: 'auto' }}
            >
              <option value="users">Users</option>
              <option value="bookings">Bookings</option>
            </select>
            <button onClick={fetchMongoData} className="btn btn-secondary">
              Fetch MongoDB Data
            </button>
          </div>

          {mongoData && (
            <div>
              <h4>{mongoData.collection} Collection ({mongoData.count} records)</h4>
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                <pre style={{ background: '#1F2937', color: 'white', padding: '1rem', borderRadius: '4px' }}>
                  {JSON.stringify(mongoData.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Manual Verification Instructions */}
        <div className="card">
          <h2>Manual Database Verification</h2>
          
          <h3>SQLite Verification</h3>
          <div style={{ background: '#1F2937', color: 'white', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace', marginBottom: '1rem' }}>
            <div># Navigate to backend directory</div>
            <div>cd backend</div>
            <br />
            <div># Open SQLite database</div>
            <div>sqlite3 rydo.sqlite</div>
            <br />
            <div># Run SELECT queries:</div>
            <div>SELECT * FROM users;</div>
            <div>SELECT * FROM bookings;</div>
            <div>SELECT * FROM ride_analytics;</div>
            <div>.tables</div>
            <div>.schema users</div>
            <div>.quit</div>
          </div>

          <h3>MongoDB Verification</h3>
          <div style={{ background: '#1F2937', color: 'white', padding: '1rem', borderRadius: '4px', fontFamily: 'monospace' }}>
            <div># Connect to MongoDB</div>
            <div>mongosh</div>
            <br />
            <div># Switch to RYDO database</div>
            <div>use rydo</div>
            <br />
            <div># Run find queries:</div>
            <div>db.users.find()</div>
            <div>db.bookings.find()</div>
            <div>show collections</div>
            <div>db.users.find().count()</div>
            <div>exit</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTest;