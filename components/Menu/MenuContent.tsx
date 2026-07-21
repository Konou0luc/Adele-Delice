'use client'

import DishCard from './DishCard'
import { FaCalendar, FaTag } from 'react-icons/fa'
import type { Dish, Menu, Category } from '@/lib/api'

interface MenuContentProps {
  activeTab: string
  activeFilters: string[]
  searchQuery: string
  dishes: Dish[]
  categories: Category[]
  menus: Menu[]
}

const MenuContent = ({ activeTab, activeFilters, searchQuery, dishes, categories, menus }: MenuContentProps) => {
  // Create a map for category name lookup
  const categoryNameMap = new Map<string, string>()
  categories.forEach(category => {
    categoryNameMap.set(category.id, category.name)
  })

  // Menu du Jour (use daily menus from API, or promoted dishes if no menus available
  if (activeTab === 'daily') {
    const dailyMenus = menus.filter(menu => menu.type === 'DAILY')
    let dailyDishes: Dish[] = []
    if (dailyMenus.length > 0 && dailyMenus[0].menuItems) {
      dailyDishes = dailyMenus[0].menuItems
        .map(item => item.dish || dishes.find(d => d.id === item.dishId))
        .filter((d): d is Dish => d !== undefined)
    } else {
      dailyDishes = dishes.filter(dish => dish.isPromoted || dish.isNew)
    }

    const filteredDishes = dailyDishes.filter(dish =>
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
            <DishCard key={dish.id} dish={dish} categoryName={categoryNameMap.get(dish.categoryId)} />
          ))}
        </div>
      </div>
    )
  }

  // Menu de la Semaine
  if (activeTab === 'weekly') {
    const weeklyMenus = menus.filter(menu => menu.type === 'WEEKLY')
    const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

    return (
      <div className="space-y-8">
        {weeklyMenus.length > 0 ? (
          weeklyMenus.map((menu, index) => {
            const dayName = weekDays[menu.dayOfWeek || index % 7]
            const menuDishes = menu.menuItems?.map(item => ({
              ...item.dish || dishes.find(d => d.id === item.dishId),
              price: item.price
            })).filter(Boolean) as (Dish & { price: number })[]
            const totalPrice = menuDishes.reduce((sum, dish) => sum + dish.price, 0)

            return (
              <div key={menu.id} className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden">
                <div className="bg-[#111111] text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaCalendar className="w-5 h-5" />
                    <h3 className="text-xl font-bold">{menu.name || dayName}</h3>
                    {menu.date && (
                      <span className="text-gray-300 text-sm">
                        {new Date(menu.date).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                  <span className="bg-white/20 px-4 py-1 rounded-full font-bold">
                    {totalPrice} FCFA
                  </span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {menuDishes.map((dish, idx) => (
                      <div key={dish.id || idx} className="border border-[#EAEAEA] rounded-xl p-4">
                        <img
                          src={dish.images[0] || '/placeholder-image.webp'}
                          alt={dish.name}
                          className="w-full h-24 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-bold text-[#111111] mb-1">{dish.name}</h4>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#787774]">
                            {categoryNameMap.get(dish.categoryId) || 'Plat'}
                          </span>
                          <span className="font-bold text-[#111111]">{dish.price} FCFA</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-[#EAEAEA]">
            <p className="text-[#787774] text-lg">Aucun menu hebdomadaire disponible</p>
          </div>
        )}
      </div>
    )
  }

  // Carte Complète
  if (activeTab === 'complete') {
    // Filter dishes
    const filteredDishes = dishes.filter(dish => {
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (dish.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      
      const matchesCategory = activeFilters.length === 0 ||
        activeFilters.includes(dish.categoryId)

      return matchesSearch && matchesCategory
    })

    // Group by category
    const categoryMap = new Map<string, Dish[]>()
    for (const dish of filteredDishes) {
      const categoryName = categoryNameMap.get(dish.categoryId) || 'Autres'
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, [])
      }
      categoryMap.get(categoryName)!.push(dish)
    }

    return (
      <div className="space-y-10">
        {Array.from(categoryMap.entries()).map(([categoryName, categoryDishes]) => (
          <div key={categoryName}>
            <h2 className="text-2xl font-bold text-[#111111] mb-6 flex items-center gap-2">
              <FaTag className="w-5 h-5" />
              {categoryName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryDishes.map(dish => (
                <DishCard key={dish.id} dish={dish} categoryName={categoryName} />
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
