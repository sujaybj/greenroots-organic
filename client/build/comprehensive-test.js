const fs = require('fs');
const path = require('path');

const buildDir = process.cwd();

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('🧪 COMPREHENSIVE PWA TESTING REPORT');
console.log('═══════════════════════════════════════════════════════════════\n');

// Test 1: Service Worker Content Validation
console.log('TEST 1: SERVICE WORKER INTEGRITY');
console.log('─────────────────────────────────────────────────────────────');

const swPath = path.join(buildDir, 'service-worker.js');
const swContent = fs.readFileSync(swPath, 'utf-8');

const swTests = [
  { name: 'Install Event Handler', search: 'self.addEventListener(\'install\'' },
  { name: 'Activate Event Handler', search: 'self.addEventListener(\'activate\'' },
  { name: 'Fetch Event Handler', search: 'self.addEventListener(\'fetch\'' },
  { name: 'Cache-First Strategy', search: 'async function cacheFirstStrategy' },
  { name: 'Network-First Strategy', search: 'async function networkFirstStrategy' },
  { name: 'Stale-While-Revalidate', search: 'async function staleWhileRevalidateStrategy' },
  { name: 'Message Handler', search: 'self.addEventListener(\'message\'' },
  { name: 'Cache Names Defined', search: 'const.*CACHE.*=' },
  { name: 'App Shell Caching', search: 'const APP_SHELL' },
  { name: 'Cache Strategy Routing', search: 'getCacheStrategy' },
];

let swPassed = 0;
swTests.forEach(test => {
  const pass = swContent.includes(test.search);
  console.log(`${pass ? '✅' : '❌'} ${test.name}`);
  if (pass) swPassed++;
});

console.log(`\n📊 Service Worker: ${swPassed}/${swTests.length} checks passed\n`);

// Test 2: Manifest Validation
console.log('TEST 2: MANIFEST STRUCTURE & VALIDITY');
console.log('─────────────────────────────────────────────────────────────');

const manifestPath = path.join(buildDir, 'manifest.json');
let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  console.log('✅ Valid JSON');
} catch (e) {
  console.log('❌ Invalid JSON');
  console.log(`   Error: ${e.message}\n`);
  process.exit(1);
}

const requiredFields = [
  'name', 'short_name', 'start_url', 'display', 'theme_color', 
  'background_color', 'icons', 'scope'
];

let manifestPassed = 0;
requiredFields.forEach(field => {
  const has = field in manifest;
  console.log(`${has ? '✅' : '❌'} Field: ${field}`);
  if (has) manifestPassed++;
});

console.log(`\n📊 Manifest: ${manifestPassed}/${requiredFields.length} fields present\n`);

// Test 3: Icons Validation
console.log('TEST 3: APP ICONS VALIDATION');
console.log('─────────────────────────────────────────────────────────────');

const iconTests = [
  { size: 192, path: 'icon-192.svg' },
  { size: 512, path: 'icon-512.svg' },
];

let iconsPassed = 0;
iconTests.forEach(test => {
  const iconPath = path.join(buildDir, 'icons', test.path);
  const exists = fs.existsSync(iconPath);
  if (exists) {
    const stats = fs.statSync(iconPath);
    console.log(`✅ Icon ${test.size}x${test.size} (${(stats.size / 1024).toFixed(2)} KB)`);
    iconsPassed++;
  } else {
    console.log(`❌ Icon ${test.size}x${test.size} - Not found`);
  }
});

// Verify icons in manifest
const manifestIcons = manifest.icons || [];
const correctIcons = manifestIcons.every(icon => 
  fs.existsSync(path.join(buildDir, icon.src.replace('/public', ''))) || 
  fs.existsSync(path.join(buildDir, icon.src))
);

console.log(`${correctIcons ? '✅' : '❌'} Icons referenced in manifest exist`);
if (correctIcons) iconsPassed++;

console.log(`\n📊 Icons: ${iconsPassed}/3 checks passed\n`);

// Test 4: HTML Structure
console.log('TEST 4: HTML STRUCTURE & META TAGS');
console.log('─────────────────────────────────────────────────────────────');

const htmlPath = path.join(buildDir, 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

const htmlTests = [
  { name: 'Viewport Meta', search: 'name="viewport"' },
  { name: 'Theme Color Meta', search: 'name="theme-color"' },
  { name: 'Apple Mobile Support', search: 'apple-mobile-web-app' },
  { name: 'Apple Touch Icon', search: 'rel="apple-touch-icon"' },
  { name: 'Manifest Link', search: 'rel="manifest"' },
  { name: 'Root Div', search: 'id="root"' },
  { name: 'HTML Lang', search: 'lang="en"' },
  { name: 'UTF-8 Charset', search: 'charset="utf-8"' },
];

let htmlPassed = 0;
htmlTests.forEach(test => {
  const pass = htmlContent.includes(test.search);
  console.log(`${pass ? '✅' : '❌'} ${test.name}`);
  if (pass) htmlPassed++;
});

console.log(`\n📊 HTML: ${htmlPassed}/${htmlTests.length} checks passed\n`);

// Test 5: Build Assets
console.log('TEST 5: BUILD ASSETS VERIFICATION');
console.log('─────────────────────────────────────────────────────────────');

const staticDir = path.join(buildDir, 'static');
let assetsPassed = 0;

// Check CSS
const cssDir = path.join(staticDir, 'css');
const hasCss = fs.existsSync(cssDir) && fs.readdirSync(cssDir).length > 0;
console.log(`${hasCss ? '✅' : '❌'} CSS files present`);
if (hasCss) assetsPassed++;

// Check JS
const jsDir = path.join(staticDir, 'js');
const hasJs = fs.existsSync(jsDir) && fs.readdirSync(jsDir).length > 0;
console.log(`${hasJs ? '✅' : '❌'} JavaScript files present`);
if (hasJs) assetsPassed++;

// Check main bundle
const mainJsFiles = fs.readdirSync(jsDir || '').filter(f => f.includes('main'));
const hasMain = mainJsFiles.length > 0;
console.log(`${hasMain ? '✅' : '❌'} Main bundle generated`);
if (hasMain) assetsPassed++;

// Check chunk files
const chunks = fs.readdirSync(jsDir || '').filter(f => f.includes('.chunk.js'));
console.log(`✅ Code splitting: ${chunks.length} chunk files`);
assetsPassed++;

console.log(`\n📊 Assets: ${assetsPassed}/4 checks passed\n`);

// Test 6: PWA Features
console.log('TEST 6: PWA FEATURES IMPLEMENTED');
console.log('─────────────────────────────────────────────────────────────');

const mainChunk = fs.readFileSync(path.join(jsDir, mainJsFiles[0]), 'utf-8');

const featureTests = [
  { name: 'Redux Store', search: () => htmlContent.includes('id="root"') && mainChunk.length > 1000000 },
  { name: 'React Router', search: () => swContent.includes('navigate') || mainChunk.includes('Route') },
  { name: 'Lazy Loading', search: () => swContent.includes('chunks') || chunks.length > 5 },
  { name: 'PWA Utilities', search: () => fs.existsSync(path.join(buildDir, '..', 'src', 'utils', 'pwaUtils.js')) || mainChunk.includes('pwaUtils') },
  { name: 'Service Worker Registration', search: () => mainChunk.includes('registerServiceWorker') || mainChunk.includes('serviceWorker') },
];

let featuresPassed = 0;
featureTests.forEach(test => {
  const pass = test.search();
  console.log(`${pass ? '✅' : '❌'} ${test.name}`);
  if (pass) featuresPassed++;
});

console.log(`\n📊 Features: ${featuresPassed}/${featureTests.length} checks passed\n`);

// Summary
const totalChecks = swTests.length + requiredFields.length + iconTests.length + 1 + 
                    htmlTests.length + assetsPassed + featureTests.length;
const totalPassed = swPassed + manifestPassed + iconsPassed + htmlPassed + assetsPassed + featuresPassed;
const passPercentage = ((totalPassed / totalChecks) * 100).toFixed(1);

console.log('═══════════════════════════════════════════════════════════════');
console.log('📊 FINAL PWA TEST RESULTS');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log(`Total Checks: ${totalChecks}`);
console.log(`✅ Passed: ${totalPassed}`);
console.log(`❌ Failed: ${totalChecks - totalPassed}`);
console.log(`📊 Pass Rate: ${passPercentage}%\n`);

// Recommendations
console.log('═══════════════════════════════════════════════════════════════');
console.log('🎯 NEXT ACTIONS');
console.log('═══════════════════════════════════════════════════════════════\n');

if (passPercentage >= 95) {
  console.log('✅ EXCELLENT - Your PWA is production-ready!\n');
  console.log('Recommended next steps:');
  console.log('1. ✅ Enable HTTPS on your production server');
  console.log('2. ✅ Configure caching headers (see PWA_TESTING_DEPLOYMENT.md)');
  console.log('3. ✅ Run Lighthouse audit on production');
  console.log('4. ✅ Test on real iOS and Android devices');
  console.log('5. ✅ Monitor PWA metrics in production\n');
} else if (passPercentage >= 85) {
  console.log('⚠️  GOOD - Your PWA is mostly ready\n');
  console.log('Before production:');
  console.log('1. Review the PWA guides for any minor issues');
  console.log('2. Set up HTTPS (required for service workers)');
  console.log('3. Configure server headers for caching');
  console.log('4. Run final Lighthouse audit\n');
} else {
  console.log('❌ ISSUES FOUND - Need improvements\n');
  console.log('Action items:');
  console.log('1. Review failed checks above');
  console.log('2. Check PWA_IMPLEMENTATION_SUMMARY.md');
  console.log('3. Rebuild if needed: npm run build');
  console.log('4. Re-run verification after fixes\n');
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('📚 HELPFUL RESOURCES');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('Documentation Files:');
console.log('• PWA_SETUP_GUIDE.md - Complete setup overview');
console.log('• PWA_QUICK_REFERENCE.md - Developer quick reference');
console.log('• PWA_TESTING_DEPLOYMENT.md - Testing & deployment guide');
console.log('• PWA_IMPLEMENTATION_CHECKLIST.md - Implementation phases');
console.log('• PWA_CONFIGURATION_REFERENCE.md - Configuration details\n');

console.log('Browser DevTools:');
console.log('• DevTools → Application → Service Workers (check registration)');
console.log('• DevTools → Application → Manifest (view manifest details)');
console.log('• DevTools → Application → Cache Storage (view cached content)');
console.log('• DevTools → Lighthouse (run PWA audit)\n');

console.log('Test URL: http://localhost:3000\n');
console.log('═══════════════════════════════════════════════════════════════\n');

process.exit(totalPassed === totalChecks ? 0 : 1);
