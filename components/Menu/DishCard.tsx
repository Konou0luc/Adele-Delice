'use client'

import { FaClock } from 'react-icons/fa'
import type { Dish } from './menuData'

interface DishCardProps {
  dish: Dish
}

const DishCard = ({ dish }: DishCardProps) => {
  return (
    <div className="group bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {dish.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {dish.badges.map((badge, index) => (
            <span
              key={index}
              className="bg-[#111111] text-white text-xs px-3 py-1 rounded-full font-semibold"
            >
              {badge}
            </span>
          ))}
          </div>
        )}

        {dish.isSpecial && dish.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
            -{dish.discount}%
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-[#111111]">{dish.name}</h3>
          <div className="text-right">
            {dish.discount ? (
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-400 line-through">{dish.price} FCFA</span>
                <span className="text-lg font-bold text-[#111111]">
                  {Math.round(dish.price * (1 - dish.discount / 100))} FCFA
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-[#111111]">{dish.price} FCFA</span>
            )}
          </div>
        </div>
        
        <p className="text-sm text-[#787774] mb-4">{dish.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#787774] text-sm">
            <FaClock className="w-4 h-4" />
            {dish.preparationTime}
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            dish.stock === 'available' 
              ? 'bg-green-100 text-green-700' 
              : dish.stock === 'low' 
                ? 'bg-yellow-100 text-yellow-700' 
                : 'bg-red-100 text-red-700'
          }`}>
            {dish.stock === 'available' 
              ? 'Disponible' 
              : dish.stock === 'low' 
                ? 'Peu disponible' 
                : 'Indisponible'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DishCard
