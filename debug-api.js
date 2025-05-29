// debug-api.js - Test your API endpoints locally
// Run with: node debug-api.js

const https = require('https');
const http = require('http');

// Test configuration
const TEST_CASES = [
  {
    name: 'Google Homepage',
    url: 'https://google.com',
    expectScore: true
  },
  {
    name: 'Example Site',
    url: 'https://example.com',
    expectScore: true
  },
  {
    name: 'Invalid URL',
    url: 'not-a-valid-url',
    expectError: true
  }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test environment variables
function checkEnvironment() {
  log('\n🔍 Checking Environment Variables...', 'blue');
  
  const requiredVars = [
    'OPENAI_API_KEY',
    'GOOGLE_PAGESPEED_API_KEY'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      log(`❌ ${varName}: Missing`, 'red');
      allPresent = false;
    } else if (value.includes('your-') || value.length < 10) {
      log(`⚠️  ${varName}: Looks like a placeholder`, 'yellow');
    } else {
      log(`✅ ${varName}: Present (${value.substring(0, 10)}...)`, 'green');
    }
  });
  
  return allPresent;
}

// Test API endpoint
async function testAPI(testCase) {
  return new Promise((resolve) => {
    log(`\n🧪 Testing: ${testCase.name}`, 'cyan');
    log(`   URL: ${testCase.url}`, 'bright');
    
    const postData = JSON.stringify({ url: testCase.url });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const startTime = Date.now();
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        try {
          const result = JSON.parse(data);
          
          if (res.statusCode === 200) {
            if (testCase.expectError) {
              log(`❌ Expected error but got success`, 'red');
            } else {
              log(`✅ Success (${duration}ms)`, 'green');
              if (result.score) {
                log(`   Score: ${result.score}`, 'bright');
                log(`   Grade: ${result.grade?.grade || 'N/A'}`, 'bright');
                log(`   Recommendations: ${result.recommendations?.length || 0}`, 'bright');
              }
            }
          } else {
            if (testCase.expectError) {
              log(`✅ Expected error received (${res.statusCode})`, 'green');
            } else {
              log(`❌ Error ${res.statusCode}: ${result.error}`, 'red');
            }
          }
          
          resolve({
            success: res.statusCode === 200,
            duration,
            result
          });
          
        } catch (parseError) {
          log(`❌ Invalid JSON response: ${parseError.message}`, 'red');
          log(`   Raw response: ${data.substring(0, 200)}...`, 'yellow');
          resolve({
            success: false,
            duration,
            error: 'Invalid JSON'
          });
        }
      });
    });
    
    req.on('error', (error) => {
      log(`❌ Network error: ${error.message}`, 'red');
      log(`   Is your development server running on port 3000?`, 'yellow');
      resolve({
        success: false,
        error: error.message
      });
    });
    
    req.write(postData);
    req.end();
  });
}

// Test individual functions
function testUtilityFunctions() {
  log('\n🔧 Testing Utility Functions...', 'blue');
  
  // Test URL validation
  try {
    new URL('https://google.com');
    log('✅ URL validation working', 'green');
  } catch (e) {
    log('❌ URL validation failed', 'red');
  }
  
  // Test JSON parsing
  try {
    JSON.parse('{"test": true}');
    log('✅ JSON parsing working', 'green');
  } catch (e) {
    log('❌ JSON parsing failed', 'red');
  }
}

// Performance test
async function performanceTest() {
  log('\n⚡ Performance Test...', 'blue');
  
  const testUrl = 'https://example.com';
  const iterations = 3;
  const durations = [];
  
  for (let i = 0; i < iterations; i++) {
    log(`   Run ${i + 1}/${iterations}...`, 'bright');
    const result = await testAPI({
      name: `Performance Test ${i + 1}`,
      url: testUrl,
      expectScore: true
    });
    
    if (result.duration) {
      durations.push(result.duration);
    }
  }
  
  if (durations.length > 0) {
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);
    
    log(`📊 Performance Summary:`, 'cyan');
    log(`   Average: ${avgDuration.toFixed(0)}ms`, 'bright');
    log(`   Min: ${minDuration}ms`, 'bright');
    log(`   Max: ${maxDuration}ms`, 'bright');
    
    if (avgDuration > 15000) {
      log(`⚠️  Average response time is slow (>15s)`, 'yellow');
    } else if (avgDuration > 10000) {
      log(`🟡 Average response time is acceptable (10-15s)`, 'yellow');
    } else {
      log(`✅ Average response time is good (<10s)`, 'green');
    }
  }
}

// Main test runner
async function runTests() {
  log('🦦 SEOtter API Debug Tool', 'magenta');
  log('================================', 'magenta');
  
  // Check environment
  const envOk = checkEnvironment();
  if (!envOk) {
    log('\n❌ Environment check failed. Please set up your .env file.', 'red');
    log('   Copy .env.example to .env and add your API keys.', 'yellow');
    return;
  }
  
  // Test utility functions
  testUtilityFunctions();
  
  // Test API endpoints
  log('\n🚀 Testing API Endpoints...', 'blue');
  const results = [];
  
  for (const testCase of TEST_CASES) {
    const result = await testAPI(testCase);
    results.push(result);
    
    // Wait between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Performance test
  await performanceTest();
  
  // Summary
  log('\n📋 Test Summary', 'magenta');
  log('================', 'magenta');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  log(`✅ Successful: ${successful}/${total}`, successful === total ? 'green' : 'yellow');
  
  if (successful === total) {
    log('\n🎉 All tests passed! Your API is working correctly.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the output above for details.', 'yellow');
  }
  
  log('\n💡 Tips:', 'cyan');
  log('   - Make sure your development server is running: vercel dev', 'bright');
  log('   - Check your .env file has valid API keys', 'bright');
  log('   - Test in a browser: http://localhost:3000', 'bright');
}

// Run the tests
if (require.main === module) {
  runTests().catch(error => {
    log(`\n💥 Test runner crashed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

module.exports = { runTests, testAPI, checkEnvironment };
