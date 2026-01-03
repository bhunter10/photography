# Image Storage Configuration

## Current Setup (Local Storage)

By default, images are stored locally in the `media/` directory. This works well for development and small deployments, but for production, you should consider using cloud storage.

## Setting Up Cloud Storage

### Option 1: Cloudflare R2 (Recommended)

Cloudflare R2 is S3-compatible and offers low-cost storage with egress fees. It's the most cost-effective option.

#### Steps:

1. **Create R2 Bucket**
   - Go to Cloudflare Dashboard → R2
   - Create a new bucket (e.g., `melanie-hunter-photography`)
   - Note your Account ID

2. **Create API Token**
   - Go to "Manage R2 API Tokens"
   - Create token with read/write permissions
   - Save Access Key ID and Secret Access Key

3. **Configure Environment Variables**
   ```env
   R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=your-access-key-id
   R2_SECRET_ACCESS_KEY=your-secret-access-key
   R2_BUCKET=melanie-hunter-photography
   R2_REGION=auto
   R2_PUBLIC_URL=https://your-cdn-domain.com
   ```

4. **Update Payload Config**

   Uncomment the S3 plugin configuration in `src/payload.config.ts`:

   ```typescript
   import { s3Storage } from '@payloadcms/plugin-s3'
   
   // Add to plugins array:
   plugins: [
     s3Storage({
       collections: {
         photos: {
           prefix: 'photos',
           disableLocalStorage: true,
           generateFileURL: ({ prefix, filename }) => {
             const baseUrl = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_SERVER_URL
             return `${baseUrl}/${prefix}/${filename}`
           },
         },
       },
       bucket: process.env.R2_BUCKET || '',
       config: {
         endpoint: process.env.R2_ENDPOINT,
         region: process.env.R2_REGION || 'auto',
         credentials: {
           accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
           secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
         },
         forcePathStyle: true,
       },
     }),
   ],
   ```

5. **Set Up Custom Domain (Optional)**
   - In R2 bucket settings, configure custom domain
   - Update DNS records as instructed
   - Use custom domain in `R2_PUBLIC_URL`

### Option 2: AWS S3

AWS S3 is a reliable option with good integration options.

#### Steps:

1. **Create S3 Bucket**
   - Go to AWS Console → S3
   - Create bucket (e.g., `melanie-hunter-photography`)
   - Choose region close to your users
   - Enable versioning (optional but recommended)

2. **Configure CORS**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

3. **Create IAM User**
   - Go to IAM → Users → Create User
   - Attach policy: `AmazonS3FullAccess` (or create custom policy)
   - Create access keys
   - Save Access Key ID and Secret Access Key

4. **Configure Environment Variables**
   ```env
   AWS_ACCESS_KEY_ID=your-access-key-id
   AWS_SECRET_ACCESS_KEY=your-secret-access-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=melanie-hunter-photography
   ```

5. **Update Payload Config**

   Similar to R2, but use AWS config:
   ```typescript
   plugins: [
     s3Storage({
       collections: {
         photos: {
           prefix: 'photos',
           disableLocalStorage: true,
         },
       },
       bucket: process.env.AWS_S3_BUCKET || '',
       config: {
         region: process.env.AWS_REGION || 'us-east-1',
         credentials: {
           accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
           secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
         },
       },
     }),
   ],
   ```

6. **Set Up CloudFront (Optional but Recommended)**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Use CloudFront URL in image URLs for faster delivery

## Image Optimization

The system automatically generates optimized versions:

- **Thumbnail**: ~400px wide (for grid views)
- **Web**: ~2400px wide (for lightbox/full view)
- **Original**: Preserved for archival

These are generated using Sharp during upload and stored alongside the original.

## Cost Comparison

**Cloudflare R2:**
- Storage: $0.015/GB/month
- Class A operations (writes): $4.50 per million
- Class B operations (reads): $0.36 per million
- No egress fees

**AWS S3:**
- Storage: $0.023/GB/month (standard)
- PUT requests: $0.005 per 1,000
- GET requests: $0.0004 per 1,000
- Data transfer out: $0.09/GB (first 10 TB)

**Example (5,000 photos, ~50GB):**
- R2: ~$0.75/month storage + operations
- S3: ~$1.15/month storage + operations + transfer
- **R2 is typically 30-50% cheaper**

## Migration from Local to Cloud

If you've already uploaded images locally and want to migrate:

1. Set up cloud storage (R2 or S3)
2. Update Payload config to use cloud storage
3. Upload existing images through admin panel (they'll go to cloud)
4. Or use a migration script to upload existing files

For existing deployments, you may need to update image URLs in the database after migration.

## Best Practices

1. **Always use CDN**: Set up custom domain/CloudFront for faster delivery
2. **Enable versioning**: Keep originals safe
3. **Monitor usage**: Set up billing alerts
4. **Optimize before upload**: Compress images before uploading when possible
5. **Use appropriate formats**: JPEG for photos, consider WebP for better compression
6. **Set up backups**: Ensure images are backed up regularly

