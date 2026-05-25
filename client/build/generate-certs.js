const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certsDir = path.join(__dirname, 'certs');

// Create certs directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
  console.log('✅ Created certs directory');
}

const keyPath = path.join(certsDir, 'key.pem');
const certPath = path.join(certsDir, 'cert.pem');

// Check if certificates already exist
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('✅ Certificates already exist:');
  console.log(`   Key: ${keyPath}`);
  console.log(`   Cert: ${certPath}`);
  process.exit(0);
}

console.log('🔒 Generating self-signed SSL certificate...\n');

try {
  // Try using OpenSSL first (Linux/macOS/Git Bash)
  const cmd = `openssl req -x509 -newkey rsa:4096 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/CN=localhost/O=GreenRoots/C=IN"`;
  
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('\n✅ SSL certificate created with OpenSSL');
    console.log(`   Key: ${keyPath}`);
    console.log(`   Cert: ${certPath}`);
    process.exit(0);
  } catch (e) {
    // OpenSSL not available, use Node.js approach
    console.log('OpenSSL not found, using Node.js certificate generator...\n');
    
    // Use Node.js crypto module to generate self-signed certificate
    const { generateKeyPairSync, createCipheriv, randomBytes } = require('crypto');
    const { promisify } = require('util');
    
    // For simplicity, we'll create a basic self-signed cert using Node.js
    // This is a simplified approach - for production, use proper certificate library
    
    // Generate RSA key pair
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    // For a real self-signed cert, we'd need to use a library like 'selfsigned'
    // For now, we'll provide a fallback message
    console.log('Note: Node.js certificate generation requires additional setup.');
    console.log('\nAlternative options:');
    console.log('1. Install OpenSSL via Git Bash (https://gitforwindows.org/)');
    console.log('2. Install OpenSSL from: https://slproweb.com/products/Win32OpenSSL.html');
    console.log('3. Use WSL (Windows Subsystem for Linux)');
    console.log('\nAfter installing, run this script again.');
    process.exit(1);
  }
} catch (error) {
  console.error('Error generating certificate:', error.message);
  process.exit(1);
}
