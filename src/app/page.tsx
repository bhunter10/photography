import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import styles from './page.module.css'

async function getCollections() {
  const payload = await getPayload({ config })
  const collections = await payload.find({
    collection: 'collections',
    limit: 100,
    sort: 'order',
  })
  return collections.docs
}

export default async function HomePage() {
  const collections = await getCollections()

  return (
    <div className={styles.homepage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.brandName}>Melanie Hunter Photography</h1>
          <p className={styles.heroSubtitle}>
            Capturing life&apos;s most precious moments
          </p>
        </div>
      </section>

      {/* Featured Collections */}
      <section className={styles.collectionsSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Collections</h2>
          <div className={styles.collectionsGrid}>
            {collections.map((collection) => {
              const coverImageUrl =
                typeof collection.coverImage === 'object' && collection.coverImage
                  ? collection.coverImage.url || ''
                  : ''

              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className={styles.collectionCard}
                >
                  {coverImageUrl && (
                    <div className={styles.collectionImage}>
                      <Image
                        src={coverImageUrl}
                        alt={collection.title || 'Collection cover'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className={styles.collectionInfo}>
                    <h3 className={styles.collectionTitle}>{collection.title}</h3>
                    {collection.description && (
                      <p className={styles.collectionDescription}>
                        {collection.description}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

