# Deployment Guide

This guide provides step-by-step instructions for deploying the Melanie Hunter Photography website to production.

## Prerequisites

- GitHub account with repository access
- Vercel account (free tier works)
- PostgreSQL database (free tier recommended)
- (Optional) Cloudflare R2 or AWS S3 for image storage

## Step 1: Prepare Repository

Ensure all code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Set Up Database

Choose a PostgreSQL provider:

### Option A: Vercel Postgres (Recommended for Vercel deployment)

1. In Vercel dashboard, go to your project
2. Navigate to "Storage" → "Create Database"
3. Select "Postgres"
4. Choose a region close to your users
5. Copy the connection string

### Option B: Supabase (Free tier available)

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (use "Connection string" → "URI" format)

### Option C: Render PostgreSQL

1. Go to https://render.com
2. Create new PostgreSQL database
3. Copy the internal database URL

### Option D: Railway PostgreSQL

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL service
4. Copy the DATABASE_URL from variables

## Step 3: Set Up Image Storage (Optional but Recommended)

### Option A: Cloudflare R2 (Recommended - Lower cost)

1. Go to https://dash.cloudflare.com
2. Navigate to R2 → Create bucket
3. Name it (e.g., `melanie-hunter-photography`)
4. Go to "Manage R2 API Tokens"
5. Create API token with read/write permissions
6. Copy:
   - Account ID
   - Access Key ID
   - Secret Access Key
7. (Optional) Set up custom domain for CDN

### Option B: AWS S3

1. Go to AWS Console → S3
2. Create bucket
3. Configure CORS:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```
4. Create IAM user with S3 permissions
5. Generate access keys
6. (Optional) Set up CloudFront distribution

## Step 4: Deploy to Vercel

### 4.1 Import Project

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run generate:types && npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 4.2 Environment Variables

Add the following environment variables in Vercel:

**Required:**
```
DATABASE_URI=your-postgres-connection-string
PAYLOAD_SECRET=generate-with-openssl-rand-base64-32
NEXT_PUBLIC_SERVER_URL=https://your-domain.vercel.app
NEXT_PUBLIC_PAYLOAD_URL=https://your-domain.vercel.app
PAYLOAD_CONFIG_PATH=src/payload.config.ts
```

**If using Cloudflare R2:**
```
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET=your-bucket-name
R2_REGION=auto
R2_PUBLIC_URL=https://your-cdn-domain.com
```

**If using AWS S3:**
```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### 4.3 Generate PAYLOAD_SECRET

Generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as `PAYLOAD_SECRET`.

### 4.4 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployment URL

## Step 5: Post-Deployment Setup

### 5.1 Create Admin User

1. Visit `https://your-domain.vercel.app/admin`
2. Click "Create First User"
3. Enter email and password
4. Log in

### 5.2 Configure Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_SERVER_URL` and `NEXT_PUBLIC_PAYLOAD_URL` to use custom domain
5. Redeploy

### 5.3 Set Up Image Storage (If not done earlier)

If you configured R2 or S3, update Payload config to use it. The current setup uses local storage by default.

## Step 6: Verify Deployment

1. ✅ Visit homepage - should load collections
2. ✅ Visit `/admin` - should show login/admin panel
3. ✅ Create a test collection
4. ✅ Create a test gallery with photos
5. ✅ Verify photos display correctly
6. ✅ Test lightbox functionality
7. ✅ Test on mobile device

## Step 7: Production Checklist

- [ ] `PAYLOAD_SECRET` is set and secure
- [ ] Database backups are enabled
- [ ] Custom domain is configured (optional)
- [ ] SSL certificate is active (automatic with Vercel)
- [ ] Image storage is configured (optional but recommended)
- [ ] Admin user is created
- [ ] SEO metadata is reviewed
- [ ] Analytics is set up (optional)

## Monitoring & Maintenance

### Logs

View logs in Vercel dashboard under "Deployments" → Select deployment → "Functions" tab

### Database Backups

- Vercel Postgres: Automatic daily backups
- Supabase: Automatic backups (retention varies by plan)
- Render: Manual backups available
- Railway: Manual backups available

### Updates

To update the site:

```bash
git pull origin main
# Make changes
git add .
git commit -m "Update description"
git push origin main
```

Vercel will automatically redeploy.

## Troubleshooting

### Build Fails

- Check environment variables are set correctly
- Verify `DATABASE_URI` format
- Check build logs in Vercel dashboard
- Ensure `PAYLOAD_SECRET` is set

### Database Connection Errors

- Verify `DATABASE_URI` is correct
- Check database is running
- Verify IP allowlist (if applicable)
- Check firewall rules

### Image Upload Issues

- Verify storage credentials (if using R2/S3)
- Check file permissions
- Verify bucket exists and is accessible
- Check CORS configuration (for S3)

### Admin Panel Not Loading

- Verify `NEXT_PUBLIC_PAYLOAD_URL` matches deployment URL
- Check browser console for errors
- Verify Payload config is correct
- Check build logs

## Cost Estimates

**Minimal Setup (Small site, <1000 photos):**
- Vercel Hobby (Free): $0/month
- Supabase Free: $0/month
- Cloudflare R2: ~$0.50/month (storage + requests)
- **Total: ~$0.50/month**

**Recommended Setup (Medium site, 1000-5000 photos):**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Cloudflare R2: ~$2/month
- **Total: ~$47/month**

**Scalable Setup (Large site, 5000+ photos):**
- Vercel Pro: $20/month
- Managed PostgreSQL: $15-50/month
- Cloudflare R2: ~$5-10/month
- **Total: ~$40-80/month**

## Security Considerations

1. **Never commit `.env` files**
2. **Use strong `PAYLOAD_SECRET`**
3. **Enable database SSL connections**
4. **Use HTTPS (automatic with Vercel)**
5. **Regularly update dependencies**
6. **Monitor admin access logs**
7. **Use environment-specific secrets**

## Support

For deployment issues, check:
- Vercel documentation: https://vercel.com/docs
- Payload CMS documentation: https://payloadcms.com/docs
- Next.js documentation: https://nextjs.org/docs

