const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';

async function validateBackend() {
  console.log('🔍 Validating backend server...\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const response = await fetch(`${BASE_URL}/weather/London`);
    
    if (response.status === 200) {
      console.log('   ✅ Server is running and responding');
    } else {
      console.log(`   ❌ Server responded with status: ${response.status}`);
      return false;
    }
    
    // Test 2: Check weather endpoint
    console.log('2. Testing weather endpoint...');
    const weatherData = await response.json();
    
    if (weatherData.location && weatherData.weather) {
      console.log('   ✅ Weather endpoint working correctly');
    } else {
      console.log('   ❌ Weather endpoint returned invalid data structure');
      return false;
    }
    
    // Test 3: Check basic API endpoint
    console.log('3. Testing basic API endpoint...');
    const basicResponse = await fetch('http://localhost:5000/');
    const basicData = await basicResponse.json();
    
    if (basicData.message && basicData.message.includes('Weather App API')) {
      console.log('   ✅ Basic API endpoint working');
    } else {
      console.log('   ❌ Basic API endpoint not working correctly');
      return false;
    }
    
    console.log('\n🎉 Backend validation completed successfully!');
    console.log('   Server is running on http://localhost:5000');
    console.log('   All endpoints are functional');
    return true;
    
  } catch (error) {
    console.log('❌ Backend validation failed:');
    console.log(`   Error: ${error.message}`);
    console.log('\n💡 To start the backend:');
    console.log('   1. cd backend');
    console.log('   2. npm install (if not done)');
    console.log('   3. npm run build');
    console.log('   4. npm start (or npm run dev for development)');
    return false;
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  validateBackend();
}

module.exports = validateBackend;
