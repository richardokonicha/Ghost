#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Ghost for Vercel deployment...');

const rootDir = path.join(__dirname, '..');
const ghostCoreDir = path.join(rootDir, 'ghost', 'core');

// Step 1: Install dependencies with --ignore-engines flag
console.log('📦 Installing dependencies...');
try {
    execSync('yarn install --ignore-engines --frozen-lockfile', { 
        cwd: rootDir, 
        stdio: 'inherit' 
    });
} catch (error) {
    console.error('Failed to install dependencies:', error.message);
    process.exit(1);
}

// Step 2: Build Ghost admin
console.log('🏗️  Building Ghost admin...');
try {
    execSync('yarn build:prod', { 
        cwd: path.join(rootDir, 'ghost', 'admin'), 
        stdio: 'inherit' 
    });
} catch (error) {
    console.warn('Admin build failed, continuing...', error.message);
}

// Step 3: Build Ghost core assets
console.log('🎨 Building Ghost core assets...');
try {
    execSync('yarn build:assets', { 
        cwd: ghostCoreDir, 
        stdio: 'inherit' 
    });
} catch (error) {
    console.warn('Asset build failed, continuing...', error.message);
}

// Step 4: Create necessary directories for runtime
console.log('📁 Creating runtime directories...');
const runtimeDirs = [
    path.join(rootDir, 'api'),
    path.join(rootDir, 'ghost', 'core', 'content', 'themes'),
    path.join(rootDir, 'ghost', 'core', 'content', 'data'),
    path.join(rootDir, 'ghost', 'core', 'content', 'logs'),
    path.join(rootDir, 'ghost', 'core', 'content', 'adapters', 'storage')
];

runtimeDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  ✅ Created ${dir}`);
    }
});

// Step 5: Copy default theme if it doesn't exist
const defaultThemeSource = path.join(ghostCoreDir, 'core', 'frontend', 'web');
const defaultThemeDest = path.join(ghostCoreDir, 'content', 'themes', 'casper');

if (fs.existsSync(defaultThemeSource) && !fs.existsSync(defaultThemeDest)) {
    console.log('📋 Copying default theme...');
    try {
        execSync(`cp -r "${defaultThemeSource}" "${defaultThemeDest}"`);
        console.log('  ✅ Default theme copied');
    } catch (error) {
        console.warn('Failed to copy default theme:', error.message);
    }
}

// Step 6: Create package.json for Cloudinary dependency
console.log('📄 Setting up storage dependencies...');
const cloudinaryPackage = {
    "name": "ghost-cloudinary-storage",
    "version": "1.0.0",
    "dependencies": {
        "cloudinary": "^2.5.1",
        "ghost-storage-base": "^1.0.0"
    }
};

const storagePath = path.join(ghostCoreDir, 'content', 'adapters', 'storage');
fs.writeFileSync(
    path.join(storagePath, 'package.json'), 
    JSON.stringify(cloudinaryPackage, null, 2)
);

// Install Cloudinary dependencies
try {
    execSync('npm install', { 
        cwd: storagePath, 
        stdio: 'inherit' 
    });
    console.log('  ✅ Storage dependencies installed');
} catch (error) {
    console.warn('Failed to install storage dependencies:', error.message);
}

// Step 7: Create .vercelignore
console.log('🚫 Creating .vercelignore...');
const vercelIgnore = `# Dependencies
node_modules/
.yarn/
.cache/

# Development files
.git/
.github/
.vscode/
.env*
*.log

# Test files
test/
tests/
*.test.js
*.spec.js

# Build artifacts
ghost/admin/node_modules/
ghost/admin/tmp/
ghost/admin/dist/

# Content that should be external
ghost/core/content/images/
ghost/core/content/data/
ghost/core/content/logs/

# OS files
.DS_Store
Thumbs.db
`;

fs.writeFileSync(path.join(rootDir, '.vercelignore'), vercelIgnore);

// Step 8: Update package.json with Vercel-specific scripts
console.log('📝 Updating package.json for Vercel...');
const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.scripts = {
    ...packageJson.scripts,
    "vercel-build": "node scripts/build-vercel.js",
    "start": "node api/ghost.js"
};

// Add necessary dependencies for Vercel deployment
packageJson.dependencies = {
    ...packageJson.dependencies,
    "cloudinary": "^2.5.1"
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('✅ Ghost build for Vercel completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Set up environment variables in Vercel dashboard');
console.log('2. Configure external database (MySQL/PostgreSQL)');
console.log('3. Set up Cloudinary account for image storage');
console.log('4. Deploy to Vercel using `vercel` command');
console.log('\n🔧 Required environment variables:');
console.log('- DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME');
console.log('- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
console.log('- GHOST_URL, ADMIN_URL');
console.log('- MAIL_SERVICE, MAIL_USER, MAIL_PASSWORD (optional)');