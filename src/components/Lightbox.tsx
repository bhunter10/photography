'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import styles from './Lightbox.module.css'

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
  }
  width?: number
  height?: number
}

interface LightboxProps {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}: LightboxProps) {
  const currentPhoto = photos[currentIndex]
  const imageUrl =
    currentPhoto?.sizes?.web?.url || currentPhoto?.url || ''

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        onPrevious()
      } else if (e.key === 'ArrowRight') {
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrevious, onNext])

  if (!currentPhoto || !imageUrl) return null

  return (
    <div className={styles.lightbox} onClick={onClose}>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      <button
        className={styles.navButton}
        style={{ left: '20px' }}
        onClick={(e) => {
          e.stopPropagation()
          onPrevious()
        }}
        aria-label="Previous photo"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      <button
        className={styles.navButton}
        style={{ right: '20px' }}
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        aria-label="Next photo"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={currentPhoto.alt || ''}
            fill
            style={{ objectFit: 'contain' }}
            priority
            sizes="100vw"
          />
        </div>

        {(currentPhoto.caption || currentPhoto.alt) && (
          <div className={styles.caption}>
            {currentPhoto.caption && (
              <p className={styles.captionText}>{currentPhoto.caption}</p>
            )}
            {currentPhoto.alt && (
              <p className={styles.altText}>{currentPhoto.alt}</p>
            )}
          </div>
        )}

        <div className={styles.counter}>
          {currentIndex + 1} / {photos.length}
        </div>
      </div>
    </div>
  )
}

