const path = require('path');
const fs = require('fs');

// Set up environment for Ghost
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Set Ghost root path and change directory
const ghostRoot = path.join(__dirname, '..', 'ghost', 'core');

// Override Ghost config loading for Vercel environment
function setupVercelConfig() {
  // Replace environment variables in config
  const envReplacements = {
    'DB_HOST': process.env.DATABASE_HOST,
    'DB_PORT': process.env.DATABASE_PORT || '3306',
    'DB_USER': process.env.DATABASE_USER,
    'DB_PASS': process.env.DATABASE_PASSWORD,
    'DB_NAME': process.env.DATABASE_NAME,
    'CLOUDINARY_CLOUD_NAME': process.env.CLOUDINARY_CLOUD_NAME,
    'CLOUDINARY_API_KEY': process.env.CLOUDINARY_API_KEY,
    'CLOUDINARY_API_SECRET': process.env.CLOUDINARY_API_SECRET,
    'REDIS_HOST': process.env.REDIS_HOST,
    'REDIS_PORT': process.env.REDIS_PORT || '6379',
    'REDIS_PASSWORD': process.env.REDIS_PASSWORD,
    'MAIL_SERVICE': process.env.MAIL_SERVICE,
    'MAIL_USER': process.env.MAIL_USER,
    'MAIL_PASS': process.env.MAIL_PASSWORD
  };

  // Read and process config file
  const configPath = path.join(ghostRoot, 'config.vercel.json');
  if (fs.existsSync(configPath)) {
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Replace environment variable placeholders
    Object.entries(envReplacements).forEach(([key, value]) => {
      if (value) {
        configContent = configContent.replace(new RegExp(key, 'g'), value);
      }
    });

    // Write processed config to production config location
    const prodConfigPath = path.join(ghostRoot, 'config.production.json');
    fs.writeFileSync(prodConfigPath, configContent);
  }

  // Set Ghost-specific environment variables
  process.env.url = process.env.GHOST_URL || 'https://your-ghost-site.vercel.app';
  process.env.admin__url = process.env.ADMIN_URL || process.env.url + '/ghost';
  process.env.paths__contentPath = '/tmp/ghost-content';
}

// Initialize Ghost with serverless-friendly configuration
async function initializeGhost() {
  // Set up configuration for Vercel
  setupVercelConfig();
  
  // Ensure content directory exists in /tmp
  const contentPath = '/tmp/ghost-content';
  
  if (!fs.existsSync(contentPath)) {
    fs.mkdirSync(contentPath, { recursive: true });
    
    // Create necessary subdirectories
    const subdirs = ['themes', 'images', 'data', 'logs', 'adapters', 'settings', 'public'];
    subdirs.forEach(dir => {
      fs.mkdirSync(path.join(contentPath, dir), { recursive: true });
    });
  }

  // Copy default theme if it doesn't exist
  const defaultThemePath = path.join(contentPath, 'themes', 'casper');
  const sourceThemePath = path.join(ghostRoot, 'content', 'themes', 'casper');
  
  if (!fs.existsSync(defaultThemePath) && fs.existsSync(sourceThemePath)) {
    try {
      // Copy theme directory recursively
      const copyRecursive = (src, dest) => {
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          fs.readdirSync(src).forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
          });
        } else {
          fs.copyFileSync(src, dest);
        }
      };
      
      copyRecursive(sourceThemePath, defaultThemePath);
    } catch (err) {
      console.warn('Could not copy default theme:', err.message);
    }
  }

  // Change to Ghost root directory
  process.chdir(ghostRoot);

  // Boot Ghost with serverless configuration
  const bootGhost = require('../ghost/core/core/boot');
  
  return await bootGhost({
    backend: true,
    frontend: true,
    server: false  // Don't start HTTP server, we'll handle that
  });
}

// Cache Ghost instance
let ghostApp = null;
let initPromise = null;

async function getGhostApp() {
  if (ghostApp) {
    return ghostApp;
  }
  
  if (!initPromise) {
    initPromise = initializeGhost();
  }
  
  ghostApp = await initPromise;
  return ghostApp;
}

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Get Ghost app instance
    const app = await getGhostApp();
    
    // Create mock Node.js request/response objects that work with Express
    const originalUrl = req.url;
    const method = req.method;
    const headers = req.headers;
    const body = req.body;

    // Handle the request through Ghost's Express app
    return new Promise((resolve) => {
      // Mock Express request object
      const mockReq = Object.assign(req, {
        url: originalUrl,
        method: method,
        headers: headers,
        body: body,
        get: function(header) {
          return headers[header.toLowerCase()];
        }
      });

      // Mock Express response object
      const mockRes = Object.assign(res, {
        locals: {},
        headersSent: false,
        get: function(header) {
          return this.getHeader(header);
        },
        set: function(header, value) {
          this.setHeader(header, value);
          return this;
        },
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          this.setHeader('Content-Type', 'application/json');
          this.end(JSON.stringify(data));
          return this;
        },
        redirect: function(url) {
          this.setHeader('Location', url);
          this.statusCode = 302;
          this.end();
          return this;
        }
      });

      // Override end to resolve the promise
      const originalEnd = mockRes.end;
      mockRes.end = function(chunk, encoding) {
        originalEnd.call(this, chunk, encoding);
        resolve();
      };

      // Process request through Ghost
      app(mockReq, mockRes, (err) => {
        if (err) {
          console.error('Ghost processing error:', err);
          res.status(500).json({ error: 'Internal server error' });
          resolve();
        }
      });
    });

  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize Ghost',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};