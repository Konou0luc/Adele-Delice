'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/Gallery/HeroSection'
import GalleryContent from '@/components/Gallery/GalleryContent'

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-20">
        <HeroSection />
        
        <div className="max-w-7xl mx-auto px-4 py-12">
          <GalleryContent />
        </div>
      </div>
      <Footer />
    </>
  )
}
