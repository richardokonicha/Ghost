# 🚀 Quick Deployment Guide

This Ghost CMS repository is ready for deployment to Vercel! Here are your deployment options:

## Option 1: One-Click Deploy (Recommended)

**Click this button to deploy instantly:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frichardokonicha%2FGhost&env=DATABASE_HOST,DATABASE_USER,DATABASE_PASSWORD,DATABASE_NAME,CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET,GHOST_URL&envDescription=Environment%20variables%20required%20for%20Ghost%20deployment&envLink=https%3A%2F%2Fgithub.com%2Frichardokonicha%2FGhost%2Fblob%2Fmain%2FVERCEL_DEPLOYMENT.md)

### What happens when you click:
1. **Fork/Clone**: Vercel will clone this repository to your account
2. **Environment Setup**: You'll be prompted to configure required environment variables
3. **Automatic Deploy**: Vercel will build and deploy your Ghost CMS
4. **Live URL**: You'll get a live URL for your Ghost site

## Option 2: GitHub Integration

1. **Fork this repository** to your GitHub account
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Import Project"
   - Select your forked repository
3. **Configure environment variables** (see below)
4. **Deploy automatically**

## Option 3: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from this directory
vercel

# Set environment variables (prompted during deploy)
```

## 🔧 Required Environment Variables

You'll need these services and their credentials:

### Database (Choose one):
- **PlanetScale** (MySQL) - [planetscale.com](https://planetscale.com)
- **Railway** (PostgreSQL/MySQL) - [railway.app](https://railway.app)
- **Vercel Postgres** - Built into Vercel

### Image Storage:
- **Cloudinary** (Free tier available) - [cloudinary.com](https://cloudinary.com)

### Environment Variables to Set:

```
DATABASE_HOST=your-database-host.com
DATABASE_USER=ghost_user
DATABASE_PASSWORD=your-secure-password
DATABASE_NAME=ghost_production
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-cloudinary-secret
GHOST_URL=https://your-site-name.vercel.app
```

## ⚡ After Deployment

1. **Visit your deployed site**: `https://your-site-name.vercel.app`
2. **Setup Ghost admin**: Go to `/ghost` on your site
3. **Create admin account**: Follow the setup wizard
4. **Start publishing**: Your Ghost CMS is ready!

## 📚 Need Help?

- **Complete Guide**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **Deployment Checklist**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Environment Variables**: [.env.example](.env.example)

---

**Total deployment time: ~15 minutes** ⏱️

**Ready to deploy?** Click the deploy button above! 👆