#!/usr/bin/env node

/**
 * Automated Vercel Deployment Script for Ghost CMS
 * This script helps automate the deployment process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Ghost CMS - Automated Vercel Deployment');
console.log('===========================================\n');

// Check if Vercel CLI is installed
function checkVercelCLI() {
    try {
        execSync('vercel --version', { stdio: 'ignore' });
        console.log('✅ Vercel CLI is available');
        return true;
    } catch (error) {
        console.log('❌ Vercel CLI not found');
        console.log('📥 Install with: npm install -g vercel');
        return false;
    }
}

// Check if user is logged in to Vercel
function checkVercelAuth() {
    try {
        execSync('vercel whoami', { stdio: 'ignore' });
        console.log('✅ Logged in to Vercel');
        return true;
    } catch (error) {
        console.log('❌ Not logged in to Vercel');
        console.log('🔑 Login with: vercel login');
        return false;
    }
}

// Display deployment options
function showDeploymentOptions() {
    console.log('\n🎯 Deployment Options:\n');
    
    console.log('1. 📱 One-Click Deploy (Easiest)');
    console.log('   Click: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frichardokonicha%2FGhost&env=DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET,GHOST_URL');
    console.log('');
    
    console.log('2. 🔧 CLI Deploy (Advanced)');
    console.log('   Run: vercel');
    console.log('');
    
    console.log('3. 🔗 GitHub Integration');
    console.log('   1. Fork this repository');
    console.log('   2. Connect to Vercel via GitHub');
    console.log('   3. Configure environment variables');
    console.log('');
}

// Show required environment variables
function showEnvironmentVariables() {
    console.log('🌍 Required Environment Variables:\n');
    
    const requiredVars = [
        { name: 'DATABASE_HOST', description: 'Your database host (e.g., mysql.planetscale.com)' },
        { name: 'DATABASE_USER', description: 'Database username' },
        { name: 'DATABASE_PASSWORD', description: 'Database password' },
        { name: 'DATABASE_NAME', description: 'Database name' },
        { name: 'CLOUDINARY_CLOUD_NAME', description: 'Cloudinary cloud name' },
        { name: 'CLOUDINARY_API_KEY', description: 'Cloudinary API key' },
        { name: 'CLOUDINARY_API_SECRET', description: 'Cloudinary API secret' },
        { name: 'GHOST_URL', description: 'Your site URL (e.g., https://my-ghost.vercel.app)' }
    ];
    
    requiredVars.forEach(variable => {
        console.log(`📝 ${variable.name}`);
        console.log(`   ${variable.description}`);
        console.log('');
    });
}

// Show service setup guides
function showServiceSetup() {
    console.log('🛠️  Service Setup:\n');
    
    console.log('📊 Database Options:');
    console.log('   • PlanetScale (MySQL): https://planetscale.com');
    console.log('   • Railway (PostgreSQL): https://railway.app');
    console.log('   • Vercel Postgres: Built into Vercel');
    console.log('');
    
    console.log('🖼️  Image Storage:');
    console.log('   • Cloudinary (Free tier): https://cloudinary.com');
    console.log('');
}

// Main function
function main() {
    // Run setup validation
    console.log('🧪 Running setup validation...');
    try {
        execSync('node scripts/test-vercel-setup.js', { stdio: 'inherit' });
    } catch (error) {
        console.error('\n❌ Setup validation failed. Please check the output above.');
        process.exit(1);
    }
    
    console.log('\n✅ Setup validation passed!\n');
    
    // Check CLI availability
    const hasVercelCLI = checkVercelCLI();
    const isLoggedIn = hasVercelCLI ? checkVercelAuth() : false;
    
    console.log('');
    
    // Show deployment options
    showDeploymentOptions();
    
    // Show environment variables
    showEnvironmentVariables();
    
    // Show service setup
    showServiceSetup();
    
    console.log('📋 Next Steps:\n');
    
    if (hasVercelCLI && isLoggedIn) {
        console.log('   You can deploy now with: vercel');
        console.log('   Or use the one-click deploy button above');
    } else if (hasVercelCLI && !isLoggedIn) {
        console.log('   1. Login: vercel login');
        console.log('   2. Deploy: vercel');
        console.log('   Or use the one-click deploy button above');
    } else {
        console.log('   1. Use the one-click deploy button above (recommended)');
        console.log('   2. Or install Vercel CLI: npm install -g vercel');
    }
    
    console.log('\n🎉 Your Ghost CMS is ready for deployment!');
    console.log('📚 For detailed instructions, see: VERCEL_DEPLOYMENT.md');
}

// Run the script
main();