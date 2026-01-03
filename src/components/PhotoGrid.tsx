'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from './Lightbox'
import styles from './PhotoGrid.module.css'

interface Photo {
  id: string
  url?: string
  alt?: string
  caption?: string
  sizes?: {
    web?: {
      url?: string
      width?: number
      height?: number
    }
    thumbnail?: {
      url?: string
      width?: number
      height?: number
    }
  }
  width?: number
  height?: number
}

interface PhotoGridProps {
  photos: Photo[]
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'unset'
  }

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
  }

  const goToNext = () => {
    setLightboxIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
  }

  return (
    <>
      <div className={styles.photoGrid}>
        {photos.map((photo, index) => {
          const imageUrl = photo.url || photo.sizes?.thumbnail?.url || ''
          const webUrl = photo.sizes?.web?.url || photo.url || ''
          
          if (!imageUrl) return null

          return (
            <button
              key={photo.id}
              className={styles.photoItem}
              onClick={() => openLightbox(index)}
              aria-label={photo.alt || `Photo ${index + 1}`}
            >
              <div className={styles.photoWrapper}>
                <Image
                  src={imageUrl}
                  alt={photo.alt || ''}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  loading={index < 12 ? 'eager' : 'lazy'}
                />
              </div>
            </button>
          )
        })}
      </div>

      {lightboxOpen && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      )}
    </>
  )
}

