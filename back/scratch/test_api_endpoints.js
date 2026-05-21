import axios from 'axios';
import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';

async function testApi() {
  const PORT = process.env.PORT || 4004;
  const BASE_URL = `http://localhost:${PORT}/api/v1`;
  
  // 1. Manually generate a valid ADMIN token for testing
  // (This proves the middleware will accept a real token)
  const adminToken = jwt.sign(
    { id: '79050daa-2c53-4d40-a892-93ff2d5dd353', role: 'admin' },
    process.env.JWT_SECRET || 'newkey100'
  );

  const testVendorId = '34385da7-4c31-49e5-b869-f3f93bd1ee7b'; // hotel@discoverkarabakh.com

  console.log('--- TESTING REAL API ENDPOINT ---');
  
  try {
    const response = await axios.patch(
      `${BASE_URL}/admins/users/${testVendorId}/approve`,
      {},
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    console.log('API Status:', response.status);
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✅ BACKEND API IS WORKING PERFECTLY!');
    }
  } catch (err) {
    console.error('❌ API FAILED:', err.response?.data || err.message);
  }
}

testApi();
