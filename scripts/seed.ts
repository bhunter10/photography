/**
 * Seed script to populate database with sample data
 * 
 * Usage: npm run seed
 * 
 * This script creates sample collections and galleries for testing.
 * Note: Photos need to be uploaded manually as they require actual image files.
 */

// IMPORTANT: Load env vars first (this must be the first import)
import './load-env'

import { getPayload } from 'payload'
import configPromise from '../src/payload.config'

// Verify required env vars are loaded
console.log('🔍 PAYLOAD_SECRET exists:', !!process.env.PAYLOAD_SECRET)
console.log('🔍 PAYLOAD_SECRET length:', process.env.PAYLOAD_SECRET?.length || 0)
console.log('🔍 DATABASE_URI exists:', !!process.env.DATABASE_URI)

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET is not set in environment variables')
  console.error('   Please ensure .env.local or .env file exists with PAYLOAD_SECRET')
  process.exit(1)
}

if (!process.env.DATABASE_URI) {
  console.error('❌ DATABASE_URI is not set in environment variables')
  console.error('   Please ensure .env.local or .env file exists with DATABASE_URI')
  process.exit(1)
}

console.log('🔌 Using DATABASE_URI:', process.env.DATABASE_URI.replace(/:[^:@]+@/, ':****@'))

const UNSPLASH_BASE = 'https://images.unsplash.com'

// Sample collections data
const collections = [
  {
    title: 'Weddings',
    slug: 'weddings',
    description: 'Beautiful wedding moments captured with love and attention to detail',
    order: 1,
  },
  {
    title: 'Families',
    slug: 'families',
    description: 'Candid family portraits and special moments',
    order: 2,
  },
  {
    title: 'Seniors',
    slug: 'seniors',
    description: 'Senior portrait sessions celebrating milestones',
    order: 3,
  },
  {
    title: 'Sports',
    slug: 'sports',
    description: 'Action-packed sports photography',
    order: 4,
  },
]

// Sample galleries data
const galleries = [
  {
    title: 'Johnson Wedding - Summer 2024',
    slug: 'johnson-wedding-summer-2024',
    date: '2024-07-15',
    collection: 'weddings',
    description: 'A beautiful outdoor summer wedding at the Johnson Estate',
    photos: [
      { url: `${UNSPLASH_BASE}/photo-1519741497674-611481863552?w=2400&q=80`, alt: 'Wedding ceremony setup' },
      { url: `${UNSPLASH_BASE}/photo-1511285560929-80b456fea0bc?w=2400&q=80`, alt: 'Bride and groom portrait' },
      { url: `${UNSPLASH_BASE}/photo-1522673607200-164d1b6ce486?w=2400&q=80`, alt: 'Wedding reception details' },
      { url: `${UNSPLASH_BASE}/photo-1465495976277-4387d4b0e4a6?w=2400&q=80`, alt: 'Wedding cake cutting' },
      { url: `${UNSPLASH_BASE}/photo-1515934751635-c81c6bc9a2d8?w=2400&q=80`, alt: 'Dancing at reception' },
    ],
  },
  {
    title: 'Smith Family Session',
    slug: 'smith-family-session',
    date: '2024-08-20',
    collection: 'families',
    description: 'Fall family portraits in the park',
    photos: [
      { url: `${UNSPLASH_BASE}/photo-1511895426328-dc8714191300?w=2400&q=80`, alt: 'Family group photo' },
      { url: `${UNSPLASH_BASE}/photo-1515895307828-96a4bb3b7b7a?w=2400&q=80`, alt: 'Parents with children' },
      { url: `${UNSPLASH_BASE}/photo-1503454537195-1dcabb73ffb9?w=2400&q=80`, alt: 'Kids playing in leaves' },
    ],
  },
  {
    title: 'Emma - Senior Portraits',
    slug: 'emma-senior-portraits',
    date: '2024-09-10',
    collection: 'seniors',
    description: 'Senior portrait session celebrating graduation',
    photos: [
      { url: `${UNSPLASH_BASE}/photo-1492562080023-ab3db95bfbce?w=2400&q=80`, alt: 'Senior portrait outdoor' },
      { url: `${UNSPLASH_BASE}/photo-1534528741775-53994a69daeb?w=2400&q=80`, alt: 'Casual senior portrait' },
      { url: `${UNSPLASH_BASE}/photo-1506794778202-cad84cf45f1d?w=2400&q=80`, alt: 'Formal senior portrait' },
    ],
  },
  {
    title: 'High School Football - Championship Game',
    slug: 'football-championship-2024',
    date: '2024-11-15',
    collection: 'sports',
    description: 'Championship game action shots',
    photos: [
      { url: `${UNSPLASH_BASE}/photo-1574629810360-7efbbe195018?w=2400&q=80`, alt: 'Football player in action' },
      { url: `${UNSPLASH_BASE}/photo-1577223625816-7546f13df25d?w=2400&q=80`, alt: 'Touchdown celebration' },
      { url: `${UNSPLASH_BASE}/photo-1571019613454-1cb2f99b2d8b?w=2400&q=80`, alt: 'Team huddle' },
    ],
  },
]

async function seed() {
  console.log('🌱 Starting database seed...')
  
  const payload = await getPayload({ config: configPromise })

  try {
    // Create collections
    console.log('\n📁 Creating collections...')
    const createdCollections: Record<string, string> = {}
    
    for (const collectionData of collections) {
      try {
        // Check if collection already exists
        const existing = await payload.find({
          collection: 'collections',
          where: {
            slug: {
              equals: collectionData.slug,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`   ⏭️  Collection "${collectionData.title}" already exists, skipping...`)
          createdCollections[collectionData.slug] = existing.docs[0].id as string
          continue
        }

        const collection = await payload.create({
          collection: 'collections',
          data: {
            title: collectionData.title,
            slug: collectionData.slug,
            description: collectionData.description,
            order: collectionData.order,
          },
        })

        createdCollections[collectionData.slug] = collection.id as string
        console.log(`   ✅ Created collection: "${collectionData.title}"`)
      } catch (error) {
        console.error(`   ❌ Error creating collection "${collectionData.title}":`, error)
      }
    }

    // Create galleries with photos
    console.log('\n📸 Creating galleries and photos...')
    
    for (const galleryData of galleries) {
      try {
        // Check if gallery already exists
        const existing = await payload.find({
          collection: 'galleries',
          where: {
            slug: {
              equals: galleryData.slug,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`   ⏭️  Gallery "${galleryData.title}" already exists, skipping...`)
          continue
        }

        const collectionId = createdCollections[galleryData.collection]
        if (!collectionId) {
          console.error(`   ❌ Collection "${galleryData.collection}" not found, skipping gallery...`)
          continue
        }

        // Create photos for this gallery
        const photoIds: string[] = []
        
        for (const photoData of galleryData.photos) {
          try {
            // Note: Payload doesn't support creating photos with external URLs directly
            // This would require downloading and uploading the image, which is complex
            // For now, we'll create placeholder photo entries
            console.log(`   📷 Note: Photo "${photoData.alt}" would need to be uploaded manually`)
            console.log(`      Placeholder URL: ${photoData.url}`)
            // In a real scenario, you'd download the image and upload it here
            // For now, we'll skip photo creation and just create the gallery structure
          } catch (error) {
            console.error(`   ❌ Error with photo "${photoData.alt}":`, error)
          }
        }

        // Create gallery (without photos for now, since we can't create photos from URLs)
        const gallery = await payload.create({
          collection: 'galleries',
          data: {
            title: galleryData.title,
            slug: galleryData.slug,
            date: galleryData.date,
            collection: collectionId,
            description: galleryData.description,
            published: true,
            photos: [], // Empty for now - photos need to be uploaded manually
          },
        })

        console.log(`   ✅ Created gallery: "${galleryData.title}"`)
        console.log(`   ⚠️  Note: Add photos manually via admin panel or API`)
      } catch (error) {
        console.error(`   ❌ Error creating gallery "${galleryData.title}":`, error)
      }
    }

    console.log('\n✨ Seed complete!')
    console.log('\n📝 Next steps:')
    console.log('   1. Upload photos via the admin panel at http://localhost:3000/admin')
    console.log('   2. Or use the Payload API to upload photos programmatically')
    console.log('   3. Assign photos to galleries once they are uploaded')
    console.log('\n💡 Tip: You can use the placeholder URLs from this script as inspiration for finding images')
    
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('\n✅ Seed script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seed script error:', error)
    process.exit(1)
  })

