const fs = require('fs');
const path = require('path');

const buildDir = process.cwd();

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('🚀 PWA VERIFICATION REPORT - GreenRoots Organics');
console.log('═══════════════════════════════════════════════════════════════\n');

let passed = 0;
let failed = 0;
let warnings = 0;

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    console.log(`✅ ${description}`);
    console.log(`   Location: ${path.relative(buildDir, filePath)}`);
    const stats = fs.statSync(filePath);
    console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB\n`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    console.log(`   Location: ${path.relative(buildDir, filePath)}`);
    console.log(`   Status: NOT FOUND\n`);
    failed++;
  }
}

function checkContent(filePath, searchString, description) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${description}`);
    console.log(`   Could not verify - file not found\n`);
    warnings++;
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  if (content.includes(searchString)) {
    console.log(`✅ ${description}`);
    console.log(`   Found: ${searchString.substring(0, 50)}...\n`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    console.log(`   Expected: ${searchString.substring(0, 50)}...\n`);
    failed++;
  }
}

// 1. Service Worker
console.log('📦 SERVICE WORKER VERIFICATION');
console.log('─────────────────────────────────────────────────────────────');
checkFile(path.join(buildDir, 'service-worker.js'), 'Service Worker File');
checkContent(path.join(buildDir, 'service-worker.js'), 'STATIC_CACHE', 'Cache Strategy Implementation');
checkContent(path.join(buildDir, 'service-worker.js'), 'self.addEventListener', 'Event Listeners Setup');

// 2. Web App Manifest
console.log('📋 WEB APP MANIFEST VERIFICATION');
console.log('─────────────────────────────────────────────────────────────');
checkFile(path.join(buildDir, 'manifest.json'), 'Manifest File');

if (fs.existsSync(path.join(buildDir, 'manifest.json'))) {
  const manifest = JSON.parse(fs.readFileSync(path.join(buildDir, 'manifest.json'), 'utf-8'));
  
  checkContent(path.join(buildDir, 'manifest.json'), '"short_name"', 'Short App Name');
  checkContent(path.join(buildDir, 'manifest.json'), '"name"', 'Full App Name');
  checkContent(path.join(buildDir, 'manifest.json'), '"start_url"', 'Start URL');
  checkContent(path.join(buildDir, 'manifest.json'), '"display"', 'Display Mode');
  checkContent(path.join(buildDir, 'manifest.json'), '"theme_color"', 'Theme Color');
  checkContent(path.join(buildDir, 'manifest.json'), '"background_color"', 'Background Color');
  checkContent(path.join(buildDir, 'manifest.json'), '"icons"', 'Icons Configuration');
  checkContent(path.join(buildDir, 'manifest.json'), '"shortcuts"', 'App Shortcuts');
  
  console.log('📊 Manifest Content Summary:');
  console.log(`   • App Name: ${manifest.name}`);
  console.log(`   • Short Name: ${manifest.short_name}`);
  console.log(`   • Display: ${manifest.display}`);
  console.log(`   • Icons: ${manifest.icons?.length || 0}`);
  console.log(`   • Shortcuts: ${manifest.shortcuts?.length || 0}\n`);
}

// 3. HTML Meta Tags
console.log('🏷️  HTML META TAGS VERIFICATION');
console.log('─────────────────────────────────────────────────────────────');
checkFile(path.join(buildDir, 'index.html'), 'HTML File');
checkContent(path.join(buildDir, 'index.html'), 'manifest.json', 'Manifest Link');
checkContent(path.join(buildDir, 'index.html'), 'viewport', 'Viewport Meta Tag');
checkContent(path.join(buildDir, 'index.html'), 'theme-color', 'Theme Color Meta Tag');
checkContent(path.join(buildDir, 'index.html'), 'apple-mobile-web-app', 'Apple Mobile Web App Support');
checkContent(path.join(buildDir, 'index.html'), 'service-worker', 'Service Worker Script');

// 4. Icons
console.log('🖼️  ICONS VERIFICATION');
console.log('─────────────────────────────────────────────────────────────');
checkFile(path.join(buildDir, 'icons', 'icon-192.svg'), 'Icon 192x192 (SVG)');
checkFile(path.join(buildDir, 'icons', 'icon-512.svg'), 'Icon 512x512 (SVG)');

// 5. Static Assets
console.log('📁 STATIC ASSETS VERIFICATION');
console.log('─────────────────────────────────────────────────────────────');
const hasCSS = fs.existsSync(path.join(buildDir, 'static/css'));
const hasJS = fs.existsSync(path.join(buildDir, 'static/js'));
const hasImages = fs.existsSync(path.join(buildDir, 'images'));

console.log(`${hasCSS ? '✅' : '❌'} CSS Files: ${hasCSS ? 'Found' : 'Not found'}`);
hasCSS && passed++;
!hasCSS && failed++;

console.log(`${hasJS ? '✅' : '❌'} JavaScript Files: ${hasJS ? 'Found' : 'Not found'}`);
hasJS && passed++;
!hasJS && failed++;

console.log(`${hasImages ? '✅' : '❌'} Images Directory: ${hasImages ? 'Found' : 'Not found'}\n`);
hasImages && passed++;
!hasImages && failed++;

// 6. Key PWA Features
console.log('🎯 KEY PWA FEATURES');
console.log('─────────────────────────────────────────────────────────────');
checkContent(path.join(buildDir, 'service-worker.js'), 'NetworkFirstStrategy', 'Network-First Caching Strategy');
checkContent(path.join(buildDir, 'service-worker.js'), 'cacheFirstStrategy', 'Cache-First Caching Strategy');
checkContent(path.join(buildDir, 'service-worker.js'), 'staleWhileRevalidateStrategy', 'Stale-While-Revalidate Strategy');
checkContent(path.join(buildDir, 'service-worker.js'), 'self.addEventListener(\'fetch\'', 'Fetch Event Handler');
checkContent(path.join(buildDir, 'index.html'), 'NetworkStatus', 'Network Status Component');
checkContent(path.join(buildDir, 'index.html'), 'InstallAppPrompt', 'Install Prompt Component');

// Summary
console.log('═══════════════════════════════════════════════════════════════');
console.log('📊 VERIFICATION SUMMARY');
console.log('═══════════════════════════════════════════════════════════════\n');

const total = passed + failed + warnings;
const passRate = ((passed / (passed + failed)) * 100).toFixed(1);

console.log(`✅ PASSED:   ${passed} checks`);
console.log(`❌ FAILED:   ${failed} checks`);
console.log(`⚠️  WARNINGS: ${warnings} checks`);
console.log(`📊 PASS RATE: ${passRate}%\n`);

// PWA Readiness
console.log('🚀 PWA READINESS STATUS');
console.log('─────────────────────────────────────────────────────────────');

if (passRate >= 90) {
  console.log('✅ PRODUCTION READY - Your PWA passes all critical checks!');
  console.log('\nNext Steps:');
  console.log('1. Enable HTTPS on your server');
  console.log('2. Configure server caching headers');
  console.log('3. Run Lighthouse audit (DevTools → Lighthouse)');
  console.log('4. Test on multiple devices (iOS, Android, Windows)');
  console.log('5. Deploy to production\n');
} else if (passRate >= 70) {
  console.log('⚠️  MOSTLY READY - Resolve failed checks before production');
  console.log('\nFailed Checks:');
  console.log('• Review the ❌ items above');
  console.log('• Ensure all files are in build/ directory');
  console.log('• Check service-worker.js is properly configured\n');
} else {
  console.log('❌ NOT READY - Multiple issues need to be resolved');
  console.log('\nAction Items:');
  console.log('• Check build directory exists and has all files');
  console.log('• Verify service-worker.js was created');
  console.log('• Ensure manifest.json is properly configured');
  console.log('• Review HTML meta tags in index.html\n');
}

// Build Directory Structure
console.log('📂 BUILD DIRECTORY STRUCTURE');
console.log('─────────────────────────────────────────────────────────────');
const dirs = [];
const files = [];

function listDir(dir, prefix = '') {
  try {
    const items = fs.readdirSync(dir);
    items.slice(0, 20).forEach(item => {
      if (item === 'node_modules' || item === '.') return;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        dirs.push(`${prefix}📁 ${item}/`);
      } else {
        files.push(`${prefix}📄 ${item}`);
      }
    });
  } catch (e) {
    console.error(`Error reading directory: ${e.message}`);
  }
}

listDir(buildDir);
console.log([...files.slice(0, 10), ...dirs.slice(0, 5)].join('\n'));
console.log(`\n... and more files\n`);

console.log('═══════════════════════════════════════════════════════════════');
console.log('📚 For more information, check PWA documentation:');
console.log('   • PWA_QUICK_REFERENCE.md');
console.log('   • PWA_TESTING_DEPLOYMENT.md');
console.log('   • PWA_CONFIGURATION_REFERENCE.md');
console.log('═══════════════════════════════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
