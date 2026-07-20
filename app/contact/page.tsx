'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/Contact/HeroSection'
import ContactContent from '@/components/Contact/ContactContent'

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-20">
        <HeroSection />
        <ContactContent />
      </div>
      <Footer />
    </>
  )
}
