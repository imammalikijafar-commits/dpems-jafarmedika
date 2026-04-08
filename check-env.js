// check-env.js (jalankan dengan: node check-env.js)
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

try {
  if (!fs.existsSync(envPath)) {
    console.error('❌ File .env.local TIDAK DITEMUKAN!');
    console.log('   Buat dulu dengan: touch .env.local');
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  
  console.log('\n📋 Checking .env.local...\n');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',  // YANG INI YANG PENTING!
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  let allGood = true;
  
  for (const varName of requiredVars) {
    const line = lines.find(l => l.startsWith(varName + '='));
    
    if (!line) {
      console.error(`❌ MISSING: ${varName}`);
      allGood = false;
    } else {
      const value = line.split('=')[1];
      if (!value || value.length < 10) {
        console.error(`⚠️  EMPTY/SHORT: ${varName} (value too short or empty)`);
        allGood = false;
      } else {
        console.log(`✅ FOUND: ${varName} = ${value.substring(0, 20)}...`);
      }
    }
  }
  
  // Check for WRONG variable names
  const wrongNames = ['PUBLISHABLE_DEFAULT_KEY', 'SUPABASE_URL']; // tanpa NEXT_PUBLIC_
  for (const wrong of wrongNames) {
    if (lines.some(l => l.includes(wrong))) {
      console.error(`\n🚨 WRONG VARIABLE NAME DETECTED: "${wrong}"`);
      console.error('   Correct name should be: "NEXT_PUBLIC_SUPABASE_ANON_KEY"');
      allGood = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  if (allGood) {
    console.log('✅ ALL GOOD! Restart dev server now (Ctrl+C → npm run dev)');
  } else {
    console.log('❌ FIX ERRORS ABOVE then run this check again');
  }
  
} catch (e) {
  console.error('Error reading file:', e.message);
}