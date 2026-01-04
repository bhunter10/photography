# Scripts Directory

This directory contains utility scripts for managing the photography portfolio database.

## Seed Script

The seed script (`seed.ts`) populates your database with sample collections and galleries for testing.

### Usage

```bash
npm run seed
```

### What it does

1. Creates sample collections:
   - Weddings
   - Families
   - Seniors
   - Sports

2. Creates sample galleries within each collection

3. **Note**: Photos cannot be created automatically from URLs. You'll need to upload photos manually via:
   - The admin panel (when working): http://localhost:3000/admin
   - The Payload API: `POST /api/photos`
   - Or use the helper script below

### Adding Photos

Since photos require actual image files, you have a few options:

#### Option 1: Manual Upload via API

```bash
# Upload a photo
curl -X POST http://localhost:3000/api/photos \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@path/to/image.jpg" \
  -F "alt=Description of the image" \
  -F "caption=Optional caption"
```

#### Option 2: Use Admin Panel

When the admin UI is working, you can upload photos directly through the web interface.

#### Option 3: Download and Upload Placeholder Images

You can download images from Unsplash and upload them:

```bash
# Example: Download an image
curl -o test-image.jpg "https://images.unsplash.com/photo-1519741497674-611481863552?w=2400&q=80"

# Then upload via API
curl -X POST http://localhost:3000/api/photos \
  -F "file=@test-image.jpg" \
  -F "alt=Sample wedding photo"
```

## Re-running the Seed Script

The seed script is idempotent - it won't create duplicates. If a collection or gallery with the same slug already exists, it will skip it.

To reset and re-seed:
1. Drop the database (or specific collections/galleries)
2. Run `npm run seed` again

