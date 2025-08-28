# Ghost Vercel Deployment Checklist

## Pre-deployment Setup

### 1. Database Setup
- [ ] Create a MySQL or PostgreSQL database
- [ ] Note down connection details:
  - [ ] Host
  - [ ] Port
  - [ ] Username
  - [ ] Password
  - [ ] Database name
- [ ] Test database connection

### 2. Cloudinary Setup
- [ ] Create Cloudinary account at cloudinary.com
- [ ] Get API credentials:
  - [ ] Cloud Name
  - [ ] API Key
  - [ ] API Secret
- [ ] Test API connection (optional)

### 3. Email Setup (Optional)
- [ ] Choose email service (Gmail, SendGrid, etc.)
- [ ] Get SMTP credentials
- [ ] Test email sending (optional)

## Deployment Steps

### 1. Repository Preparation
- [ ] Clone the repository
- [ ] Run `node scripts/test-vercel-setup.js` to verify setup
- [ ] Commit any local changes

### 2. Vercel Account Setup
- [ ] Create Vercel account at vercel.com
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login to Vercel: `vercel login`

### 3. Deploy to Vercel

#### Option A: CLI Deployment
```bash
vercel
```

#### Option B: GitHub Integration
- [ ] Push repository to GitHub
- [ ] Connect GitHub repo to Vercel
- [ ] Configure build settings

### 4. Environment Variables

Set these in Vercel Dashboard (Settings > Environment Variables):

#### Required Variables
- [ ] `DATABASE_HOST` = your-database-host
- [ ] `DATABASE_USER` = your-database-user
- [ ] `DATABASE_PASSWORD` = your-database-password  
- [ ] `DATABASE_NAME` = your-database-name
- [ ] `CLOUDINARY_CLOUD_NAME` = your-cloud-name
- [ ] `CLOUDINARY_API_KEY` = your-api-key
- [ ] `CLOUDINARY_API_SECRET` = your-api-secret
- [ ] `GHOST_URL` = https://your-domain.vercel.app
- [ ] `ADMIN_URL` = https://your-domain.vercel.app/ghost
- [ ] `NODE_ENV` = production

#### Optional Variables
- [ ] `DATABASE_PORT` = 3306 (for MySQL) or 5432 (for PostgreSQL)
- [ ] `MAIL_SERVICE` = Gmail
- [ ] `MAIL_USER` = your-email@gmail.com
- [ ] `MAIL_PASSWORD` = your-app-password
- [ ] `MAIL_FROM` = noreply@yourdomain.com

### 5. First Deployment Test
- [ ] Visit your Vercel deployment URL
- [ ] Check for any errors in Vercel function logs
- [ ] Verify basic Ghost functionality

### 6. Ghost Setup
- [ ] Visit `https://your-domain.vercel.app/ghost`
- [ ] Complete Ghost setup wizard
- [ ] Create admin account
- [ ] Configure basic settings

### 7. Functionality Testing
- [ ] Test admin login
- [ ] Create a test post
- [ ] Upload an image (should go to Cloudinary)
- [ ] Test frontend display
- [ ] Test email functionality (if configured)

### 8. Custom Domain (Optional)
- [ ] Add custom domain in Vercel dashboard
- [ ] Update DNS settings
- [ ] Update `GHOST_URL` and `ADMIN_URL` environment variables
- [ ] Test with custom domain

## Post-deployment

### 1. Performance Monitoring
- [ ] Monitor Vercel function logs
- [ ] Check database performance
- [ ] Monitor Cloudinary usage

### 2. Security
- [ ] Enable two-factor authentication for Ghost admin
- [ ] Set up regular database backups
- [ ] Monitor for security updates

### 3. Content Management
- [ ] Import existing content (if migrating)
- [ ] Configure themes
- [ ] Set up navigation
- [ ] Configure integrations

## Troubleshooting

### Common Issues
- [ ] **Database connection timeout**: Check database firewall settings
- [ ] **Image upload failing**: Verify Cloudinary credentials
- [ ] **Admin interface not loading**: Check `ADMIN_URL` environment variable
- [ ] **Theme not displaying**: Verify theme files are included in deployment

### Debug Steps
- [ ] Check Vercel function logs in dashboard
- [ ] Verify all environment variables are set
- [ ] Test database connection separately
- [ ] Validate Cloudinary API access

## Performance Optimization

### Vercel Settings
- [ ] Consider upgrading to Vercel Pro for better performance
- [ ] Monitor function execution time
- [ ] Optimize database queries if needed

### Database Optimization
- [ ] Set up connection pooling
- [ ] Monitor query performance
- [ ] Consider read replicas for high traffic

### Cloudinary Optimization
- [ ] Configure automatic image optimization
- [ ] Set up appropriate folder structure
- [ ] Monitor bandwidth usage

## Maintenance

### Regular Tasks
- [ ] Monitor function performance
- [ ] Check database size and performance
- [ ] Review Cloudinary usage
- [ ] Update Ghost when new versions are available
- [ ] Backup database regularly

### Updates
- [ ] Test updates in staging environment first
- [ ] Monitor deployment after updates
- [ ] Keep documentation updated