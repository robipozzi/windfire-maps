// test.js - Test script for app.js HTTPS endpoints
const https = require('https');
const http = require('http');

// Skip SSL verification for self-signed certs (development only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const ENDPOINTS = [
  {
    name: 'Autocomplete',
    path: '/api/places/autocomplete',
    params: { input: 'Roma, Italy' }
  },
  {
    name: 'Place Details', 
    path: '/api/places/details',
    params: { placeid: 'ChIJkTTTGXoOxkcRwcY9NMF6Akc' } // Example Rome place ID
  }
];

console.log('🧪 Testing app.js endpoints...\n');

ENDPOINTS.forEach((endpoint, index) => {
  testEndpoint(endpoint, index);
});

function testEndpoint(endpoint, index) {
  const options = {
    hostname: 'localhost',
    port: 3443,
    path: `${endpoint.path}?${new URLSearchParams(endpoint.params)}`,
    method: 'GET',
    rejectUnauthorized: false // Skip self-signed cert verification
  };

  const protocol = https;
  
  const req = protocol.request(options, (res) => {
    let data = '';
    
    console.log(`\n${index + 1}. ${endpoint.name} [${res.statusCode}]`);
    console.log(`   ${options.path}`);
    
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('   ✅ Success');
        console.log('   Response preview:', JSON.stringify(json, null, 2).slice(0, 300) + '...');
      } catch (e) {
        console.log('   ❌ JSON Parse Error:', data.slice(0, 200));
      }
    });
  });

  req.on('error', (err) => {
    console.log(`   ❌ Error: ${err.message}`);
  });

  req.setTimeout(10000, () => {
    req.destroy();
    console.log('   ❌ Timeout');
  });

  req.end();
}