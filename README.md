# Melanie Hunter Photography Website

A modern photography portfolio website built with Next.js and Payload CMS, featuring public galleries, an admin dashboard, and optimized image delivery.

## Features

- 🖼️ **Public Galleries**: Beautiful, responsive photo galleries with full-screen lightbox viewing
- 📱 **Mobile-First Design**: Fully responsive layout using Material Design 3
- 🎨 **Clean UI**: Modern, image-first design inspired by Pixieset
- 🔐 **Admin Dashboard**: Secure CMS for managing collections, galleries, and photos
- ⚡ **Performance**: Optimized images with lazy loading and responsive sizing
- 🔍 **SEO Friendly**: Proper metadata, semantic HTML, and clean URLs

## Tech Stack

- **Frontend**: Next.js 14 (React)
- **Styling**: Material Design 3 CSS
- **Backend/CMS**: Payload CMS
- **Database**: PostgreSQL
- **Image Storage**: Local (configurable for Cloudflare R2 or AWS S3)
- **Hosting**: Vercel (frontend), Render/Railway (backend)

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- (Optional) Cloudflare R2 or AWS S3 account for image storage

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/bhunter10/photography.git
cd photography
npm install --legacy-peer-deps
```

**Note:** Payload CMS 3.x requires `--legacy-peer-deps` flag due to peer dependency requirements. This is safe and recommended.

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URI=postgresql://user:password@localhost:5432/melanie_hunter_photography

# Payload
PAYLOAD_SECRET=your-secret-key-here-change-in-production
PAYLOAD_CONFIG_PATH=src/payload.config.ts

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000

# Optional: Cloudflare R2
# R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
# R2_ACCESS_KEY_ID=your-access-key
# R2_SECRET_ACCESS_KEY=your-secret-key
# R2_BUCKET=melanie-hunter-photography
# R2_REGION=auto
# R2_PUBLIC_URL=https://your-cdn-url.com

# Or AWS S3
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=melanie-hunter-photography
```

**Important**: Generate a secure `PAYLOAD_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Database Setup

Create a PostgreSQL database:

```bash
createdb melanie_hunter_photography
```

Or using psql:

```sql
CREATE DATABASE melanie_hunter_photography;
```

### 4. Generate TypeScript Types

```bash
npm run generate:types
```

### 5. Run Development Server

```bash
npm run dev
```

The site will be available at:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin (⚠️ currently affected by Payload 3.x bug)

### 6. Admin Access

⚠️ **Known Issue:** The Payload 3.x admin UI currently has a bug with Next.js 15.

**Recommended Workarounds:**
1. **Use the API Helper Script** (easiest):
   ```bash
   ./scripts/api-helper.sh
   ```

2. **Use REST API directly** - see `QUICK_START_API.md` for step-by-step guide

3. **Use Postman/Insomnia** for visual API management

4. **Wait for official fix** - monitor Payload GitHub for updates

**Note:** The backend is 100% functional via API. Only the browser admin UI is affected.

**📚 Documentation:**
- `QUICK_START_API.md` - Step-by-step guide to managing content via API
- `ADMIN_FIX_OPTIONS.md` - Complete guide to all available workarounds
- `ADMIN_UI_STATUS.md` - Bug details and tested versions
3. Enter your email and password
4. Log in to the admin panel

## Project Structure

```
photography/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (payload)/admin/    # Payload admin routes
│   │   ├── api/                # API routes
│   │   ├── collections/        # Collection pages
│   │   ├── galleries/          # Gallery pages
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── collections/            # Payload CMS collections
│   │   ├── Collections.ts      # Collections schema
│   │   ├── Galleries.ts        # Galleries schema
│   │   ├── Photos.ts           # Photos schema
│   │   └── Users.ts            # Users schema
│   ├── components/             # React components
│   │   ├── PhotoGrid.tsx       # Photo grid component
│   │   └── Lightbox.tsx        # Lightbox component
│   └── payload.config.ts       # Payload CMS configuration
├── public/                     # Static assets
├── media/                      # Uploaded images (gitignored)
└── payload-types.ts            # Generated TypeScript types
```

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

**Vercel Environment Variables:**
- `DATABASE_URI`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SERVER_URL` (your production URL)
- `NEXT_PUBLIC_PAYLOAD_URL` (your production URL)
- Image storage variables (if using R2/S3)

### Backend (Render/Railway)

Since Payload CMS runs alongside Next.js, you can deploy the entire application on Vercel. However, if you need a separate backend:

**Render:**
1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Configure environment variables
6. Add PostgreSQL database

**Railway:**
1. Create new project from GitHub
2. Add PostgreSQL service
3. Configure environment variables
4. Deploy

### Database

Use managed PostgreSQL services:
- **Vercel Postgres** (if deploying on Vercel)
- **Render PostgreSQL**
- **Railway PostgreSQL**
- **Supabase**
- **Neon**

### Image Storage (Optional)

For production, configure Cloudflare R2 or AWS S3:

**Cloudflare R2:**
1. Create R2 bucket in Cloudflare dashboard
2. Generate API tokens
3. Set up custom domain (optional, for CDN)
4. Configure environment variables

**AWS S3:**
1. Create S3 bucket
2. Configure CORS and permissions
3. Set up CloudFront CDN (optional)
4. Configure environment variables

## Usage

### Creating Collections

1. Log in to admin panel at `/admin`
2. Navigate to "Collections"
3. Click "Create New"
4. Enter title, slug, description
5. Upload cover image
6. Set display order
7. Save

### Creating Galleries

1. Navigate to "Galleries" in admin
2. Click "Create New"
3. Enter title, slug, date
4. Select collection
5. Upload cover image
6. Add photos to gallery (drag to reorder)
7. Toggle "Published" to make it visible
8. Save

### Managing Photos

1. Navigate to "Photos" in admin
2. Click "Create New"
3. Upload image file
4. Add alt text (required for accessibility)
5. Add optional caption
6. Save

Photos can be reused across multiple galleries.

## Image Optimization

The system automatically generates:
- **Thumbnail**: ~400px wide (for grid views)
- **Web**: ~2400px wide (for lightbox/full view)
- **Original**: Preserved for archival

Images are served responsively using Next.js Image component with lazy loading.

## Cost Optimization

- Uses free tiers where possible
- Image optimization handled locally (no paid services)
- Static generation for performance
- Efficient database queries

Estimated monthly costs (small to medium site):
- Vercel: Free (Hobby) or $20/month (Pro)
- PostgreSQL: Free-$7/month (Supabase/Render) or $5/month (Railway)
- Image Storage: $0.015/GB (R2) or $0.023/GB (S3)
- CDN: Included with R2/S3

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URI` is correct
- Ensure database is running and accessible
- Check firewall rules if using cloud database

### Image Upload Issues

- Check file permissions on `media/` directory
- Verify image formats are supported
- Check disk space

### Build Errors

- Run `npm run generate:types` before building
- Clear `.next` directory and rebuild
- Verify all environment variables are set

## License

Private project - All rights reserved

## Support

For issues or questions, please contact the development team.
