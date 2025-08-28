# Ghost on Vercel Deployment Guide

This guide will help you deploy Ghost CMS to Vercel as a serverless application.

## 🎯 Overview

This implementation converts Ghost from a traditional long-running Node.js server to a serverless application that can run on Vercel. The key changes include:

- **Serverless Function Handler**: Ghost is wrapped in a Vercel serverless function
- **External Database**: Uses MySQL/PostgreSQL instead of local SQLite
- **Cloud Storage**: Uses Cloudinary for image/media storage instead of local files
- **Optimized Configuration**: Streamlined for serverless cold starts

## 📋 Prerequisites

Before deploying, you'll need:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database Service**: 
   - [PlanetScale](https://planetscale.com) (MySQL)
   - [Railway](https://railway.app) (PostgreSQL/MySQL)
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Any MySQL/PostgreSQL hosting service
3. **Cloudinary Account**: For image storage at [cloudinary.com](https://cloudinary.com)
4. **Email Service** (Optional): For sending emails via SMTP

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Clone and prepare the repository**:
   ```bash
   git clone https://github.com/richardokonicha/Ghost.git
   cd Ghost
   ```

2. **Run the build script**:
   ```bash
   node scripts/build-vercel.js
   ```

### Step 2: Set Up Database

#### Option A: PlanetScale (Recommended)
1. Create a free account at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get your connection details from the dashboard

#### Option B: Railway
1. Create account at [railway.app](https://railway.app)
2. Create a MySQL or PostgreSQL database
3. Note the connection details

#### Option C: Vercel Postgres
1. Go to Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Note the connection details

### Step 3: Set Up Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard to get your:
   - Cloud Name
   - API Key
   - API Secret

### Step 4: Deploy to Vercel

#### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set environment variables**:
   ```bash
   vercel env add DATABASE_HOST
   vercel env add DATABASE_USER
   vercel env add DATABASE_PASSWORD
   vercel env add DATABASE_NAME
   vercel env add CLOUDINARY_CLOUD_NAME
   vercel env add CLOUDINARY_API_KEY
   vercel env add CLOUDINARY_API_SECRET
   vercel env add GHOST_URL
   vercel env add ADMIN_URL
   ```

#### Method 2: GitHub Integration

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare Ghost for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)

### Step 5: Configure Environment Variables

Set these environment variables in your Vercel dashboard:

#### Database Configuration
```
DATABASE_HOST=your-database-host
DATABASE_USER=your-database-user
DATABASE_PASSWORD=your-database-password
DATABASE_NAME=your-database-name
DATABASE_PORT=3306
```

#### Storage Configuration
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Ghost Configuration
```
GHOST_URL=https://your-ghost-site.vercel.app
ADMIN_URL=https://your-ghost-site.vercel.app/ghost
NODE_ENV=production
```

#### Email Configuration (Optional)
```
MAIL_SERVICE=Gmail
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Step 6: Initialize Database

After first deployment, you'll need to initialize the Ghost database:

1. **Visit your site**: Go to `https://your-ghost-site.vercel.app/ghost`
2. **Complete setup**: Follow the Ghost setup wizard
3. **Create admin account**: Set up your first admin user

## 🔧 Configuration Details

### Database Connection

The deployment uses connection pooling optimized for serverless:

```json
{
  "pool": {
    "min": 0,
    "max": 10,
    "acquireTimeoutMillis": 30000,
    "createTimeoutMillis": 30000,
    "destroyTimeoutMillis": 5000,
    "idleTimeoutMillis": 30000
  }
}
```

### Storage Adapter

Images and media are automatically uploaded to Cloudinary instead of local storage. The custom storage adapter handles:

- Image uploads with automatic optimization
- Secure URL generation
- File deletion when content is removed

### Serverless Optimizations

- **Content Path**: Uses `/tmp/ghost-content` for temporary files
- **Theme Handling**: Copies default theme to temporary storage
- **Background Jobs**: Disabled resource-intensive background processes
- **Caching**: Optimized for serverless environment

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Timeout**
   - Ensure your database allows connections from Vercel IPs
   - Check that SSL is properly configured
   - Verify connection string format

2. **Theme Not Loading**
   - Check that the default theme is properly copied
   - Verify content path permissions
   - Ensure theme files are included in deployment

3. **Image Upload Failing**
   - Verify Cloudinary credentials
   - Check API key permissions
   - Ensure folder settings in Cloudinary

4. **Admin Interface Not Loading**
   - Verify ADMIN_URL environment variable
   - Check that admin assets are built
   - Ensure GHOST_URL is correct

### Debug Mode

To enable debug logging, add this environment variable:
```
DEBUG=ghost:*
```

### Logs

View deployment logs in Vercel dashboard:
1. Go to your project dashboard
2. Click on a deployment
3. View "Functions" tab for serverless function logs

## 📊 Performance Considerations

### Cold Starts
- First request may take 10-15 seconds
- Subsequent requests are much faster
- Consider using Vercel Pro for better cold start performance

### Resource Limits
- Vercel functions have a 50MB deployment size limit
- 3008MB memory limit for Pro accounts
- 30-second execution timeout

### Database Performance
- Use connection pooling
- Consider read replicas for high traffic
- Monitor database performance metrics

## 🔒 Security

### Environment Variables
- Never commit secrets to your repository
- Use Vercel's environment variable encryption
- Rotate API keys regularly

### Database Security
- Use SSL connections
- Restrict database access to necessary IPs
- Use strong passwords and proper user permissions

### Content Security
- Images are served from Cloudinary CDN
- Admin interface uses standard Ghost security
- Consider additional security headers if needed

## 🔄 Updates

To update Ghost:

1. **Update the repository**:
   ```bash
   git pull origin main
   ```

2. **Rebuild for Vercel**:
   ```bash
   node scripts/build-vercel.js
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Vercel function logs
3. Verify all environment variables are set correctly
4. Ensure database connectivity
5. Check Cloudinary configuration

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Ghost Documentation](https://ghost.org/docs/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [PlanetScale Documentation](https://docs.planetscale.com/)

## ⚡ Performance Tips

1. **Use Vercel Pro**: Better cold start performance and longer function timeouts
2. **Optimize Images**: Cloudinary automatically optimizes images
3. **Database Indexing**: Ensure proper database indexes for better performance
4. **CDN**: Leverage Vercel's edge network for static assets
5. **Monitoring**: Use Vercel Analytics to monitor performance