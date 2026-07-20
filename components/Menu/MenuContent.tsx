'use client'

import DishCard from './DishCard'
import { menuData } from './menuData'
import { FaCalendar, FaTag } from 'react-icons/fa'

interface MenuContentProps {
  activeTab: string
  activeFilters: string[]
  searchQuery: string
}

const MenuContent = ({ activeTab, activeFilters, searchQuery }: MenuContentProps) => {
  // Menu du Jour
  if (activeTab === 'daily') {
    const filteredDishes = menuData.dailyMenu.filter(dish =>
      dish.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
      <div>
        <div className="bg-white rounded-xl border border-[#EAEAEA] p-6 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full">
            <FaCalendar className="w-4 h-4" />
            <span className="font-semibold text-sm">AUJOURD'HUI</span>
          </div>
          <div className="text-[#111111] font-bold">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map(dish => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      </div>
    )
  }

  // Menu de la Semaine
  if (activeTab === 'weekly') {
    return (
      <div className="space-y-8">
        {menuData.weeklyMenu.map((day, index) => (
          <div key={index} className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden">
            <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaCalendar className="w-5 h-5" />
                <h3 className="text-xl font-bold">{day.day}</h3>
                <span className="text-gray-300 text-sm">{day.date}</span>
              </div>
              <span className="bg-white/20 px-4 py-1 rounded-full font-bold">
                {day.totalPrice} FCFA
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {day.dishes.map((dish, idx) => (
                  <div key={idx} className="border border-[#EAEAEA] rounded-xl p-4">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-24 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-bold text-[#111111] mb-1">{dish.name}</h4>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#787774]">{dish.category}</span>
                      <span className="font-bold text-[#111111]">{dish.price} FCFA</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Carte Complète
  if (activeTab === 'complete') {
    // Filter dishes
    const filteredDishes = menuData.dailyMenu.filter(dish => {
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dish.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = activeFilters.length === 0 ||
        activeFilters.includes(dish.category.toLowerCase().replace(/\s+/g, '-'))

      return matchesSearch && matchesCategory
    })

    // Group by category
    const categoryMap = new Map<string, typeof menuData.dailyMenu>()
    for (const dish of filteredDishes) {
      const category = dish.category
      if (!categoryMap.has(category)) {
        categoryMap.set(category, [])
      }
      categoryMap.get(category)!.push(dish)
    }

    return (
      <div className="space-y-10">
        {Array.from(categoryMap.entries()).map(([category, dishes]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-[#111111] mb-6 flex items-center gap-2">
              <FaTag className="w-5 h-5" />
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes.map(dish => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          </div>
        ))}

        {filteredDishes.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-[#EAEAEA]">
            <p className="text-[#787774] text-lg">Aucun plat trouvé</p>
          </div>
        )}
      </div>
    )
  }

  return null
}

export default MenuContent
