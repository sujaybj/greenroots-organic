const https = require('https');

console.log('\n🧪 Verifying HTTPS Server...\n');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/',
  method: 'HEAD',
  rejectUnauthorized: false
};

const req = https.request(options, (res) => {
  console.log('✅ Server responding');
  console.log(`   Status: ${res.statusCode}`);
  console.log(`   Cache-Control: ${res.headers['cache-control']}`);
  
  // Check service worker
  const swOptions = { ...options, path: '/service-worker.js' };
  const swReq = https.request(swOptions, (swRes) => {
    const cacheControl = swRes.headers['cache-control'];
    if (cacheControl && cacheControl.includes('no-cache')) {
      console.log('\n✅ Service Worker headers: CORRECT');
      console.log(`   Cache-Control: ${cacheControl}`);
    } else {
      console.log('\n⚠️  Service Worker cache headers: ' + cacheControl);
    }
    process.exit(0);
  });

  swReq.on('error', (e) => {
    console.error('Error checking SW:', e.message);
    process.exit(1);
  });
  swReq.end();
});

req.on('error', (e) => {
  console.error('❌ Connection failed:', e.message);
  console.log('\nMake sure server is running: npm run https-test');
  process.exit(1);
});

req.setTimeout(3000, () => {
  console.error('❌ Request timeout');
  process.exit(1);
});

req.end();
