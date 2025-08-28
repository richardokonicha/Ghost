#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Ghost Vercel Deployment Script');
console.log('=====================================\n');

// Check if Vercel CLI is installed
try {
    execSync('vercel --version', { stdio: 'ignore' });
    console.log('✅ Vercel CLI is installed');
} catch (error) {
    console.log('❌ Vercel CLI not found. Installing...');
    try {
        execSync('npm install -g vercel', { stdio: 'inherit' });
        console.log('✅ Vercel CLI installed successfully');
    } catch (installError) {
        console.error('❌ Failed to install Vercel CLI. Please install manually:');
        console.error('   npm install -g vercel');
        process.exit(1);
    }
}

// Run setup validation
console.log('\n🧪 Running setup validation...');
try {
    execSync('node scripts/test-vercel-setup.js', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Setup validation failed. Please fix the issues above.');
    process.exit(1);
}

// Check for environment variables file
const envFile = path.join(__dirname, '..', '.env');
const envExampleFile = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envFile) && fs.existsSync(envExampleFile)) {
    console.log('\n📋 Creating .env file from example...');
    fs.copyFileSync(envExampleFile, envFile);
    console.log('✅ Created .env file. Please edit it with your values before deployment.');
    console.log('   Required variables: DATABASE_*, CLOUDINARY_*, GHOST_URL');
    
    console.log('\n⚠️  Please configure your environment variables in .env file and try again.');
    console.log('   Or set them directly in Vercel dashboard after deployment.');
    process.exit(0);
}

// Deploy to Vercel
console.log('\n🚀 Deploying to Vercel...');
console.log('This will deploy your Ghost CMS to Vercel.');
console.log('Make sure you have configured your environment variables!\n');

try {
    // Run Vercel deployment
    execSync('vercel', { stdio: 'inherit' });
    
    console.log('\n🎉 Deployment completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Set environment variables in Vercel dashboard if not already done');
    console.log('2. Visit your deployment URL');
    console.log('3. Go to /ghost to complete Ghost setup');
    console.log('4. Create your admin account');
    console.log('\n💡 Need help? Check VERCEL_DEPLOYMENT.md for detailed instructions.');
    
} catch (error) {
    console.error('\n❌ Deployment failed. Please check the error above.');
    console.error('💡 Common issues:');
    console.error('   - Not logged into Vercel (run: vercel login)');
    console.error('   - Missing environment variables');
    console.error('   - Build errors (check logs in Vercel dashboard)');
    process.exit(1);
}