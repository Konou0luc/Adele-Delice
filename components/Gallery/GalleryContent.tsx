'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import type { GalleryItem } from '@/lib/api'

const staticGalleryImages = [
  "/Gallery/sitting-table-with-chairs-yellow-sofa-restaurant-with-panoramic-view.webp",
  "/Gallery/fashionable-feminist-african-american-woman-wear-black-tshirt-shorts-posed-restaurant-eat-cheese-cake.webp",
  "/Gallery/interior-shot-cafe-with-chairs-near-bar-with-wooden-tables.webp",
  "/Gallery/stylish-african-woman-red-shirt-hat-posed-indoor-cafe-drinking-pineapple-lemonade.webp",
  "/Gallery/pork-hock-german-with-sauces-dark-background.webp",
  "/Plats/IMG_20260628_185117968_AE.webp",
  "/Plats/IMG_20260628_215543957_AE.webp",
  "/Plats/IMG_20260602_155913180_AE.webp",
  "/Plats/IMG_20260607_162631098_AE.webp",
  "/Plats/IMG_20260619_134807356_AE.webp",
  "/Plats/IMG_20260630_160448385_HDR_AE.webp",
  "/Plats/IMG_20260606_170302427_AE.webp"
]

interface GalleryContentProps {
  galleryItems: GalleryItem[]
}

const GalleryContent = ({ galleryItems }: GalleryContentProps) => {
  const allImages = galleryItems.length > 0 
    ? galleryItems.map(item => item.imageUrl)
    : staticGalleryImages

  const [visibleCount, setVisibleCount] = useState(8)
  const visibleImages = allImages.slice(0, visibleCount)
  const hasMore = visibleCount < allImages.length

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, allImages.length))
  }

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setActiveIndex(index)
  }

  const closeLightbox = () => {
    setActiveIndex(null)
  }

  const nextImage = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex + 1) % allImages.length)
    }
  }

  const prevImage = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex - 1 + allImages.length) % allImages.length)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return
      
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex])

  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [activeIndex])

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visibleImages.map((image, idx) => (
          <div 
            key={idx} 
            className="group overflow-hidden rounded-xl aspect-square cursor-pointer"
            onClick={() => openLightbox(idx)}
          >
            <img 
              src={image} 
              alt={`Galerie ${idx + 1}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button 
            onClick={loadMore}
            className="px-10 py-4 bg-[#111111] text-white text-lg font-semibold rounded-lg hover:bg-[#333333] transition-colors"
          >
            Charger plus de photos
          </button>
        </div>
      )}

      {activeIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition-colors z-10"
          >
            <FaTimes />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors z-10"
          >
            <FaChevronLeft />
          </button>

          <button 
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors z-10"
          >
            <FaChevronRight />
          </button>

          <img 
            src={allImages[activeIndex]} 
            alt={`Galerie ${activeIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-lg">
            {activeIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  )
}

export default GalleryContent
