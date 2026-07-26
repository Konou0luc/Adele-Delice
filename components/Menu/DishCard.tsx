'use client'

import Link from 'next/link'
import { FaClock } from 'react-icons/fa'
import { toast } from 'sonner'
import type { Dish } from '@/lib/api'
import { addCartItem } from '@/lib/user-flow'

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

        <div className="mt-4 flex gap-3">
          <Link
            href={`/menu/${dish.id}`}
            className="flex-1 rounded-lg border border-[#EAEAEA] px-4 py-2 text-center text-sm font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3]"
          >
            Détail
          </Link>
          <button
            type="button"
            onClick={() => {
              addCartItem({
                dishId: dish.id,
                name: dish.name,
                price: Number(dish.price),
                image: dish.images[0],
                categoryName,
                preparationTime: dish.preparationTime,
              })
              toast.success(`${dish.name} ajouté au panier`)
            }}
            disabled={!dish.isAvailable}
            className="flex-1 rounded-lg bg-[#111111] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}

export default DishCard
