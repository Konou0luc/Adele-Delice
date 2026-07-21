'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/Menu/HeroSection'
import FilterSidebar from '@/components/Menu/FilterSidebar'
import MenuContent from '@/components/Menu/MenuContent'
import { getCategories, getDishes, getMenus } from '@/lib/api'
import type { Category, Dish, Menu } from '@/lib/api'

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('daily')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [dishesData, categoriesData, menusData] = await Promise.all([
          getDishes(),
          getCategories(),
          getMenus(),
        ])
        setDishes(dishesData)
        setCategories(categoriesData)
        setMenus(menusData)
      } catch (error) {
        console.error('Error fetching menu data:', error)
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
              categories={categories}
            />
            
            {/* Contenu principal */}
            <main className="flex-1 min-w-0">
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111111]"></div>
                  <p className="text-[#787774] mt-4">Chargement du menu...</p>
                </div>
              ) : (
                <MenuContent
                  activeTab={activeTab}
                  activeFilters={activeFilters}
                  searchQuery={searchQuery}
                  dishes={dishes}
                  categories={categories}
                  menus={menus}
                />
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
