# Quick Start: Managing Content via API

Since the admin UI has a bug, here's how to manage your photography website using the API.

## Option 1: Use the API Helper Script (Easiest)

We've created a simple interactive script:

```bash
./scripts/api-helper.sh
```

This script lets you:
- Create your first user
- Login and save token
- Create collections
- Upload photos
- Create galleries
- List all content

**Requirements:** `jq` (JSON processor)
```bash
# Install jq if needed (macOS)
brew install jq
```

## Option 2: Manual API Calls

### Step 1: Create Your First User

```bash
curl -X POST http://localhost:3000/api/users/first-register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "melanie@example.com",
    "password": "your-secure-password",
    "name": "Melanie Hunter"
  }'
```

### Step 2: Login and Get Token

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "melanie@example.com",
    "password": "your-secure-password"
  }'
```

**Save the token from the response!** You'll need it for all future requests.

### Step 3: Create a Collection

```bash
TOKEN="your-token-here"

curl -X POST http://localhost:3000/api/collections \
  -H "Content-Type: application/json" \
  -H "Authorization: JWT $TOKEN" \
  -d '{
    "title": "Weddings",
    "description": "Beautiful wedding photography",
    "order": 1
  }'
```

**Save the collection ID from the response!**

### Step 4: Upload Photos

```bash
curl -X POST http://localhost:3000/api/photos \
  -H "Authorization: JWT $TOKEN" \
  -F "file=@/path/to/your/photo.jpg" \
  -F "alt=Bride and groom at sunset"
```

Repeat for multiple photos. **Save each photo ID!**

### Step 5: Create a Gallery

```bash
curl -X POST http://localhost:3000/api/galleries \
  -H "Content-Type: application/json" \
  -H "Authorization: JWT $TOKEN" \
  -d '{
    "title": "Sarah & John Wedding - June 2024",
    "slug": "sarah-john-wedding",
    "collection": "COLLECTION_ID_HERE",
    "date": "2024-06-15",
    "description": "A beautiful summer wedding",
    "published": true,
    "photos": [
      {"photo": "PHOTO_ID_1", "order": 1},
      {"photo": "PHOTO_ID_2", "order": 2},
      {"photo": "PHOTO_ID_3", "order": 3}
    ]
  }'
```

### Step 6: View Your Site

Visit `http://localhost:3000` to see your galleries live!

## Option 3: Use Postman or Insomnia

1. **Download Postman** (https://www.postman.com/downloads/) or **Insomnia** (https://insomnia.rest/)
2. **Import API endpoints:**
   - Base URL: `http://localhost:3000/api`
   - Collections: `/collections`
   - Galleries: `/galleries`
   - Photos: `/photos`
   - Users: `/users`

3. **Set up authentication:**
   - Login via `/users/login`
   - Copy the JWT token
   - Add to all requests as header: `Authorization: JWT your-token`

4. **Create content visually** using the Postman/Insomnia UI

## Common API Operations

### List All Collections
```bash
curl -X GET http://localhost:3000/api/collections \
  -H "Authorization: JWT $TOKEN"
```

### List All Galleries
```bash
curl -X GET http://localhost:3000/api/galleries \
  -H "Authorization: JWT $TOKEN"
```

### List All Photos
```bash
curl -X GET http://localhost:3000/api/photos \
  -H "Authorization: JWT $TOKEN"
```

### Update a Gallery
```bash
curl -X PATCH http://localhost:3000/api/galleries/GALLERY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: JWT $TOKEN" \
  -d '{
    "published": false
  }'
```

### Delete a Gallery
```bash
curl -X DELETE http://localhost:3000/api/galleries/GALLERY_ID \
  -H "Authorization: JWT $TOKEN"
```

## Tips

1. **Save IDs**: Always save the IDs returned when creating collections, galleries, and photos
2. **Order matters**: Set the `order` field to control display order on the website
3. **Slugs**: Manually set slugs for better URLs (e.g., `sarah-john-wedding`)
4. **Published flag**: Only published galleries show on the website
5. **Cover images**: Set `coverImage` on collections and galleries for better presentation

## What's Next?

Once Payload fixes the admin UI bug, you can switch to using the browser interface. All your content will be there - no migration needed!

For more options, see `ADMIN_FIX_OPTIONS.md`.

