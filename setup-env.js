#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌍 JALNET Environment Setup');
console.log('==========================\n');

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
    console.log('✅ .env file already exists');
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('GOOGLEMAP_API_KEY')) {
        console.log('✅ GOOGLEMAP_API_KEY is already configured');
    } else {
        console.log('⚠️  GOOGLEMAP_API_KEY is missing from .env file');
        console.log('Please add: GOOGLEMAP_API_KEY=your_api_key_here');
    }
} else {
    console.log('📝 Creating .env file...');
    const envContent = `# Google Maps API Key
# Get your API key from: https://console.cloud.google.com/apis/credentials
GOOGLEMAP_API_KEY=your_google_maps_api_key_here

# Add other environment variables here as needed
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📋 Please edit the .env file and replace "your_google_maps_api_key_here" with your actual Google Maps API key');
}

console.log('\n📚 How to get a Google Maps API key:');
console.log('1. Go to https://console.cloud.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable Maps JavaScript API');
console.log('4. Create credentials (API key)');
console.log('5. Add the API key to your .env file');
console.log('\n🚀 After setting up the API key, run: npm run dev'); 