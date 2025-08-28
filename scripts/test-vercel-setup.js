#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

console.log('🧪 Testing Ghost Vercel setup...');

const rootDir = path.dirname(__dirname);  // Go up one level from scripts/
const apiDir = path.join(rootDir, 'api');
const ghostHandler = path.join(apiDir, 'ghost.js');
const vercelConfig = path.join(rootDir, 'vercel.json');

// Test 1: Check if required files exist
console.log('\n📁 Checking required files...');

const requiredFiles = [
    { path: ghostHandler, name: 'Ghost serverless handler' },
    { path: vercelConfig, name: 'Vercel configuration' },
    { path: path.join(rootDir, 'ghost', 'core', 'config.vercel.json'), name: 'Vercel Ghost config' },
    { path: path.join(rootDir, 'ghost', 'core', 'content', 'adapters', 'storage', 'cloudinary.js'), name: 'Cloudinary storage adapter' }
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
        console.log(`  ✅ ${file.name}`);
    } else {
        console.log(`  ❌ ${file.name} - MISSING`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ Some required files are missing. Please run the build script first.');
    process.exit(1);
}

// Test 2: Validate vercel.json syntax
console.log('\n📝 Validating Vercel configuration...');
try {
    const vercelConfigContent = fs.readFileSync(vercelConfig, 'utf8');
    const config = JSON.parse(vercelConfigContent);
    
    if (config.builds && config.routes && config.functions) {
        console.log('  ✅ Vercel configuration is valid');
    } else {
        console.log('  ⚠️  Vercel configuration may be incomplete');
    }
} catch (error) {
    console.log(`  ❌ Invalid vercel.json: ${error.message}`);
    process.exit(1);
}

// Test 3: Check package.json for necessary dependencies
console.log('\n📦 Checking dependencies...');
try {
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const requiredDeps = ['cloudinary'];
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies || !packageJson.dependencies[dep]);
    
    if (missingDeps.length === 0) {
        console.log('  ✅ All required dependencies present');
    } else {
        console.log(`  ⚠️  Missing dependencies: ${missingDeps.join(', ')}`);
    }
} catch (error) {
    console.log(`  ❌ Could not read package.json: ${error.message}`);
}

// Test 4: Check Ghost handler syntax
console.log('\n🔧 Validating Ghost handler...');
try {
    // Try to load the handler to check for syntax errors
    delete require.cache[require.resolve(ghostHandler)];
    require(ghostHandler);
    console.log('  ✅ Ghost handler syntax is valid');
} catch (error) {
    console.log(`  ❌ Ghost handler has syntax errors: ${error.message}`);
}

// Test 5: Environment variable checklist
console.log('\n🌍 Environment variables checklist...');
const requiredEnvVars = [
    'DATABASE_HOST',
    'DATABASE_USER', 
    'DATABASE_PASSWORD',
    'DATABASE_NAME',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'GHOST_URL'
];

console.log('  Required environment variables for production:');
requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
        console.log(`  ✅ ${envVar}=***`);
    } else {
        console.log(`  ⚠️  ${envVar} (not set - required for production)`);
    }
});

// Test 6: Check for build artifacts
console.log('\n🏗️  Checking build artifacts...');
const adminDistPath = path.join(rootDir, 'ghost', 'admin', 'dist');
const coreAssetsPath = path.join(rootDir, 'ghost', 'core', 'core', 'frontend', 'public');

if (fs.existsSync(adminDistPath)) {
    console.log('  ✅ Ghost admin build artifacts found');
} else {
    console.log('  ⚠️  Ghost admin not built (run: yarn build:prod in ghost/admin)');
}

if (fs.existsSync(path.join(coreAssetsPath, 'ghost.min.css'))) {
    console.log('  ✅ Ghost core assets found');
} else {
    console.log('  ⚠️  Ghost core assets not built (run: yarn build:assets in ghost/core)');
}

console.log('\n🎉 Ghost Vercel setup validation complete!');
console.log('\n📋 Next steps:');
console.log('1. Set up your database (MySQL/PostgreSQL)');
console.log('2. Create Cloudinary account for image storage');
console.log('3. Set environment variables in Vercel dashboard');
console.log('4. Deploy with: vercel');
console.log('\nFor detailed instructions, see: VERCEL_DEPLOYMENT.md');