import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import PhotoGrid from '@/components/PhotoGrid'
import styles from './page.module.css'

async function getGallery(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const galleries = await payload.find({
    collection: 'galleries',
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          published: {
            equals: true,
          },
        },
      ],
    },
    limit: 1,
    depth: 2,
  })

  if (galleries.docs.length === 0) {
    return null
  }

  return galleries.docs[0]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const gallery = await getGallery(slug)

  if (!gallery) {
    return {
      title: 'Gallery Not Found',
    }
  }

  const collectionTitle =
    typeof gallery.collection === 'object' && gallery.collection
      ? gallery.collection.title
      : ''

  return {
    title: `${gallery.title} | Melanie Hunter Photography`,
    description: gallery.description || `${gallery.title} gallery`,
  }
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const gallery = await getGallery(slug)

  if (!gallery) {
    notFound()
  }

  const collection =
    typeof gallery.collection === 'object' && gallery.collection
      ? gallery.collection
      : null

  // Sort photos by order
  const photos =
    gallery.photos && Array.isArray(gallery.photos)
      ? [...gallery.photos]
          .filter((item) => item.photo)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((item) => item.photo)
      : []

  return (
    <div className={styles.galleryPage}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          {collection && (
            <>
              <span className={styles.breadcrumbSeparator}>/</span>
              <Link href={`/collections/${collection.slug}`}>
                {collection.title}
              </Link>
            </>
          )}
          <span className={styles.breadcrumbSeparator}>/</span>
          <span>{gallery.title}</span>
        </nav>

        <header className={styles.galleryHeader}>
          <h1 className={styles.galleryTitle}>{gallery.title}</h1>
          {gallery.date && (
            <p className={styles.galleryDate}>
              {new Date(gallery.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
          {gallery.description && (
            <p className={styles.galleryDescription}>{gallery.description}</p>
          )}
        </header>

        {photos.length > 0 ? (
          <PhotoGrid photos={photos} />
        ) : (
          <div className={styles.emptyState}>
            <p>No photos in this gallery yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

