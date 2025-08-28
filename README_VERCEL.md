# 🚀 Ghost CMS on Vercel

A complete serverless deployment of Ghost CMS on Vercel with external database and cloud storage.

## ⚡ Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frichardokonicha%2FGhost&env=DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET,GHOST_URL&envDescription=Environment%20variables%20required%20for%20Ghost%20deployment&envLink=https%3A%2F%2Fgithub.com%2Frichardokonicha%2FGhost%2Fblob%2Fmain%2FVERCEL_DEPLOYMENT.md)

## 📋 What's Included

✅ **Serverless Ghost CMS** - Full Ghost functionality in serverless functions  
✅ **External Database Support** - MySQL/PostgreSQL with connection pooling  
✅ **Cloud Storage** - Cloudinary integration for images and media  
✅ **Production Ready** - Optimized configuration for Vercel deployment  
✅ **Admin Interface** - Complete Ghost admin panel  
✅ **Email Support** - SMTP integration for transactional emails  
✅ **Custom Themes** - Support for custom Ghost themes  

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vercel CDN    │    │  Serverless      │    │  External       │
│                 │    │  Functions       │    │  Services       │
│  • Static Assets│◄──►│                  │◄──►│                 │
│  • Theme Files  │    │  • Ghost Core    │    │  • MySQL/Postgres
│  • Admin UI     │    │  • Express App   │    │  • Cloudinary   │
│                 │    │  • API Routes    │    │  • SMTP Email   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔧 Requirements

Before deploying, you'll need:

1. **Database**: MySQL or PostgreSQL instance
   - [PlanetScale](https://planetscale.com) (MySQL) - Recommended
   - [Railway](https://railway.app) (MySQL/PostgreSQL)
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

2. **Storage**: Cloudinary account for images
   - [Sign up for free](https://cloudinary.com)

3. **Vercel Account**: For deployment
   - [Sign up here](https://vercel.com)

## 🚀 Deployment Options

### Option 1: One-Click Deploy (Easiest)

1. Click the "Deploy with Vercel" button above
2. Configure environment variables
3. Deploy and setup Ghost

### Option 2: Manual Deployment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/richardokonicha/Ghost.git
   cd Ghost
   ```

2. **Test the setup**:
   ```bash
   node scripts/test-vercel-setup.js
   ```

3. **Deploy to Vercel**:
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

4. **Configure environment variables** in Vercel dashboard

### Option 3: GitHub Integration

1. Fork this repository
2. Connect to Vercel via GitHub
3. Configure environment variables
4. Deploy automatically

## 📝 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_HOST` | Database server hostname | `db.example.com` |
| `DATABASE_USER` | Database username | `ghost_user` |
| `DATABASE_PASSWORD` | Database password | `secure_password` |
| `DATABASE_NAME` | Database name | `ghost_production` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `secret_key` |
| `GHOST_URL` | Your Ghost site URL | `https://mysite.vercel.app` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_URL` | Ghost admin URL | `{GHOST_URL}/ghost` |
| `DATABASE_PORT` | Database port | `3306` (MySQL) |
| `MAIL_SERVICE` | Email service | `Gmail` |
| `MAIL_USER` | Email username | - |
| `MAIL_PASSWORD` | Email password | - |

## 📚 Documentation

- **[Deployment Guide](VERCEL_DEPLOYMENT.md)** - Complete deployment instructions
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
- **[Environment Variables](.env.example)** - All environment variables explained

## 🏃‍♂️ Quick Start

1. **Set up database** (5 minutes)
   - Create a MySQL/PostgreSQL database
   - Note connection details

2. **Set up Cloudinary** (3 minutes)
   - Create free account
   - Get API credentials

3. **Deploy to Vercel** (5 minutes)
   - Use one-click deploy or manual method
   - Configure environment variables

4. **Setup Ghost** (5 minutes)
   - Visit `/ghost` on your deployed site
   - Complete setup wizard
   - Create admin account

**Total time: ~20 minutes** ⏱️

## 🎨 Customization

### Themes
- Upload custom themes through Ghost admin
- Themes are automatically synced to temporary storage
- Use Ghost's theme development tools

### Configuration
- Modify `ghost/core/config.vercel.json` for Ghost settings
- Update `vercel.json` for deployment configuration
- Use environment variables for runtime configuration

## 🔍 Monitoring

### Vercel Dashboard
- Function execution logs
- Performance metrics
- Error tracking

### Database Monitoring
- Connection pool status
- Query performance
- Storage usage

### Cloudinary Analytics
- Image transformations
- Bandwidth usage
- Storage metrics

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Timeout**
   - Check database firewall settings
   - Verify SSL configuration
   - Test connection string

2. **Image Upload Failing**
   - Verify Cloudinary credentials
   - Check API permissions
   - Review folder settings

3. **Admin Interface Not Loading**
   - Check `ADMIN_URL` environment variable
   - Verify admin assets are built
   - Review function logs

### Debug Tools

```bash
# Test Vercel setup
node scripts/test-vercel-setup.js

# Check function logs
vercel logs

# Test database connection
# (Use your database provider's tools)
```

## 📈 Performance

### Cold Starts
- First request: ~10-15 seconds
- Subsequent requests: ~200-500ms
- Consider Vercel Pro for better performance

### Scalability
- Serverless functions auto-scale
- Database connection pooling
- CDN for static assets

### Optimization Tips
- Use Vercel Pro for better cold starts
- Optimize database queries
- Enable image optimization in Cloudinary

## 🔒 Security

- SSL/TLS encryption by default
- Environment variables encrypted in Vercel
- Database connections over SSL
- Admin interface protected by Ghost authentication

## 💰 Cost Estimation

### Vercel
- **Hobby**: Free for personal projects
- **Pro**: $20/month for better performance

### Database
- **PlanetScale**: Free tier available
- **Railway**: $5/month minimum
- **Vercel Postgres**: Usage-based pricing

### Cloudinary
- **Free**: 25 credits/month
- **Plus**: $89/month for higher usage

**Typical monthly cost: $0-$30** for small-medium sites

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `node scripts/test-vercel-setup.js`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ghost Foundation](https://ghost.org) for the amazing CMS
- [Vercel](https://vercel.com) for serverless platform
- [Cloudinary](https://cloudinary.com) for image management
- Community contributors and testers

---

**Questions?** Open an issue or check the [documentation](VERCEL_DEPLOYMENT.md)!