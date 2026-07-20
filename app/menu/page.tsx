'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/Menu/HeroSection'
import FilterSidebar from '@/components/Menu/FilterSidebar'
import MenuContent from '@/components/Menu/MenuContent'

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('daily') // 'daily' | 'weekly' | 'complete'
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-20">
        <HeroSection />
        
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar de filtres */}
            <FilterSidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters as React.Dispatch<React.SetStateAction<string[]>>}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            
            {/* Contenu principal */}
            <main className="flex-1 min-w-0">
              <MenuContent
                activeTab={activeTab}
                activeFilters={activeFilters}
                searchQuery={searchQuery}
              />
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
