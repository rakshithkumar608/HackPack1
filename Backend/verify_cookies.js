const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/users';

const runTest = async () => {
  try {
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    // 1. Sign Up
    console.log('1. Signing up...');
    await axios.post(`${BASE_URL}/SignUp`, {
      name,
      email,
      password
    });
    console.log('✅ Signup successful');

    // 2. Login
    console.log('2. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/Login`, {
      email,
      password
    });

    // 3. Check for Set-Cookie header
    const cookies = loginResponse.headers['set-cookie'];
    if (cookies && cookies.length > 0) {
      console.log('✅ Cookie received:', cookies[0]);
      if (cookies[0].includes('token=')) {
         console.log('✅ Token cookie found');
      } else {
         console.log('❌ Token cookie NOT found in Set-Cookie header');
      }
    } else {
      console.log('❌ No cookies received in response');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
  }
};

runTest();
