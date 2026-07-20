'use client'

import { FaSearch, FaUtensils, FaCalendarAlt, FaThList } from 'react-icons/fa'
import { menuData } from './menuData'

interface FilterSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  activeFilters: string[]
  setActiveFilters: React.Dispatch<React.SetStateAction<string[]>>
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const FilterSidebar = ({
  activeTab,
  setActiveTab,
  activeFilters,
  setActiveFilters,
  searchQuery,
  setSearchQuery
}: FilterSidebarProps) => {

  const tabs = [
    { id: 'daily', label: 'Menu du Jour', icon: FaUtensils },
    { id: 'weekly', label: 'Menu de la Semaine', icon: FaCalendarAlt },
    { id: 'complete', label: 'Carte Complète', icon: FaThList }
  ]

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  return (
    <aside className="lg:w-72 flex-shrink-0">
      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#EAEAEA] p-4 mb-6">
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'text-[#111111] hover:bg-[#F7F6F3]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[#EAEAEA] p-4 mb-6">
        <label className="block text-sm font-semibold text-[#111111] mb-3">Rechercher</label>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#787774] w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom du plat..."
            className="w-full pl-10 pr-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
          />
        </div>
      </div>

      {/* Categories */}
      {activeTab === 'complete' && (
        <div className="bg-white rounded-xl border border-[#EAEAEA] p-4">
          <label className="block text-sm font-semibold text-[#111111] mb-3">Catégories</label>
          <div className="flex flex-col gap-2">
            {menuData.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleFilter(category.id)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilters.includes(category.id)
                    ? 'bg-[#111111] text-white'
                    : 'text-[#787774] hover:bg-[#F7F6F3] hover:text-[#111111]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

export default FilterSidebar
