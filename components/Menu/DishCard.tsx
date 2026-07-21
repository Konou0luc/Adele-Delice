'use client'

import { FaClock } from 'react-icons/fa'
import type { Dish } from '@/lib/api'

interface DishCardProps {
  dish: Dish
  categoryName?: string
}

const DishCard = ({ dish, categoryName }: DishCardProps) => {
  const badges: string[] = []
  if (dish.isPromoted) badges.push('Promo')
  if (dish.isNew) badges.push('Nouveau')

  return (
    <div className="group bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={dish.images[0] || '/placeholder-image.webp'}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <span
              key={index}
              className="bg-[#111111] text-white text-xs px-3 py-1 rounded-full font-semibold"
            >
              {badge}
            </span>
          ))}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-[#111111]">{dish.name}</h3>
          <div className="text-right">
            <span className="text-lg font-bold text-[#111111]">{dish.price} FCFA</span>
          </div>
        </div>
        
        <p className="text-sm text-[#787774] mb-4">{dish.description || ''}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#787774] text-sm">
            {dish.preparationTime && (
              <>
                <FaClock className="w-4 h-4" />
                {`${dish.preparationTime} min`}
              </>
            )}
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            dish.isAvailable 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {dish.isAvailable ? 'Disponible' : 'Indisponible'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DishCard
