import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import styles from './page.module.css'

async function getCollection(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const collections = await payload.find({
    collection: 'collections',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (collections.docs.length === 0) {
    return null
  }

  return collections.docs[0]
}

async function getGalleries(collectionId: string) {
  const payload = await getPayload({ config: configPromise })
  const galleries = await payload.find({
    collection: 'galleries',
    where: {
      and: [
        {
          collection: {
            equals: collectionId,
          },
        },
        {
          published: {
            equals: true,
          },
        },
      ],
    },
    limit: 100,
    sort: '-date',
  })
  return galleries.docs
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const collection = await getCollection(slug)

  if (!collection) {
    return {
      title: 'Collection Not Found',
    }
  }

  return {
    title: `${collection.title} | Melanie Hunter Photography`,
    description: collection.description || `${collection.title} collection`,
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const collection = await getCollection(slug)

  if (!collection) {
    notFound()
  }

  const galleries = await getGalleries(String(collection.id))

  return (
    <div className={styles.collectionPage}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>{collection.title}</span>
        </nav>

        <header className={styles.collectionHeader}>
          <h1 className={styles.collectionTitle}>{collection.title}</h1>
          {collection.description && (
            <p className={styles.collectionDescription}>
              {collection.description}
            </p>
          )}
        </header>

        <div className={styles.galleriesGrid}>
          {galleries.map((gallery) => {
            const coverImageUrl =
              typeof gallery.coverImage === 'object' && gallery.coverImage
                ? gallery.coverImage.url || ''
                : ''

            return (
              <Link
                key={gallery.id}
                href={`/galleries/${gallery.slug}`}
                className={styles.galleryCard}
              >
                {coverImageUrl && (
                  <div className={styles.galleryImage}>
                    <Image
                      src={coverImageUrl}
                      alt={gallery.title || 'Gallery cover'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className={styles.galleryInfo}>
                  <h3 className={styles.galleryTitle}>{gallery.title}</h3>
                  {gallery.date && (
                    <p className={styles.galleryDate}>
                      {new Date(gallery.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {galleries.length === 0 && (
          <div className={styles.emptyState}>
            <p>No galleries available in this collection yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

