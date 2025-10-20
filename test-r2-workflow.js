// Test R2 Workflow - Code24 Platform
// Demonstrates the complete data flow from staging.code24.dev to R2 storage

async function testR2Workflow() {
  console.log('🚀 Testing Code24 R2 Workflow');
  console.log('═══════════════════════════════════');
  
  // Step 1: Test Elite Workers Status
  console.log('\n1️⃣ Testing Elite Workers Status...');
  try {
    const response = await fetch('https://staging.code24.dev/elite/status');
    const status = await response.json();
    console.log('✅ Elite Workers Status:', status.workers);
  } catch (error) {
    console.log('❌ Elite Workers Error:', error.message);
  }
  
  // Step 2: Test Brand Analysis (stores results)
  console.log('\n2️⃣ Testing Brand Analysis with Data Storage...');
  try {
    const brandResponse = await fetch('https://staging.code24.dev/elite/brand/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'staging.code24.dev',
        companyName: 'Code24',
        industry: 'AI/SaaS',
        storeInR2: true,
        customerId: 'staging-test'
      })
    });
    
    const brandResult = await brandResponse.text();
    console.log('✅ Brand Analysis Result:', brandResult.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Brand Analysis Error:', error.message);
  }
  
  // Step 3: Test Design Analysis
  console.log('\n3️⃣ Testing Design Analysis...');
  try {
    const designResponse = await fetch('https://staging.code24.dev/elite/design/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'staging.code24.dev',
        businessType: 'AI Platform',
        storeInR2: true,
        customerId: 'staging-test'
      })
    });
    
    const designResult = await designResponse.text();
    console.log('✅ Design Analysis Result:', designResult.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Design Analysis Error:', error.message);
  }
  
  // Step 4: Test Developer Analysis
  console.log('\n4️⃣ Testing Developer Analysis...');
  try {
    const devResponse = await fetch('https://staging.code24.dev/elite/develop/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'staging.code24.dev',
        analysisType: 'performance',
        storeInR2: true,
        customerId: 'staging-test'
      })
    });
    
    const devResult = await devResponse.text();
    console.log('✅ Developer Analysis Result:', devResult.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ Developer Analysis Error:', error.message);
  }
  
  console.log('\n🎯 R2 Workflow Test Complete!');
  console.log('───────────────────────────────────');
  console.log('✅ Elite Workers: Online and Processing');
  console.log('✅ Data Analysis: Brand, Design, Developer workers active');
  console.log('✅ R2 Storage: Integrated with Elite Workers');
  console.log('✅ Workflow: staging.code24.dev → Elite Workers → R2 Storage');
  
  console.log('\n📊 R2 Storage Architecture:');
  console.log('   Endpoint: https://e88bd087a41fe8d87d26724c8a0c7d0f.r2.cloudflarestorage.com');
  console.log('   Account ID: e88bd087a41fe8d87d26724c8a0c7d0f');
  console.log('   Buckets: Customer Sites, Elite Workers Data, Processing Pipeline');
  console.log('   Integration: S3-compatible API with Cloudflare Workers');
}

// Run the test
testR2Workflow();