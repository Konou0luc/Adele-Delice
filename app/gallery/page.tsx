'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/Gallery/HeroSection'
import GalleryContent from '@/components/Gallery/GalleryContent'
import { useState, useEffect } from 'react'
import { getGalleryItems } from '@/lib/api'
import type { GalleryItem } from '@/lib/api'

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const items = await getGalleryItems()
        setGalleryItems(items)
      } catch (error) {
        console.error('Error fetching gallery items:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-20">
        <HeroSection />
        
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111111]"></div>
            </div>
          ) : (
            <GalleryContent galleryItems={galleryItems} />
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
