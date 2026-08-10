'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DishCard from '@/components/Menu/DishCard'
import { getDishes, getDish, getCategories } from '@/lib/api'
import { addCartItem } from '@/lib/user-flow'
import type { Dish, Category } from '@/lib/api'
import { FaArrowLeft, FaCartShopping, FaClock, FaUtensils } from 'react-icons/fa6'
import { toast } from 'sonner'

export default function DishDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id
  const [dish, setDish] = useState<Dish | null>(null)
  const [relatedDishes, setRelatedDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    let isMounted = true

    const loadDish = async () => {
      try {
        setLoading(true)
        const [currentDish, allCategories] = await Promise.all([
          getDish(id),
          getCategories(),
        ])
        if (!isMounted) return
        setDish(currentDish)
        setCategories(allCategories)

        const related = await getDishes({ categoryId: currentDish.categoryId })
        if (!isMounted) return
        setRelatedDishes(related.filter((item) => item.id !== currentDish.id))
      } catch {
        if (isMounted) {
          setDish(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDish()

    return () => {
      isMounted = false
    }
  }, [id])

  const badges = useMemo(() => {
    if (!dish) return []
    return [dish.isPromoted && 'Promo', dish.isNew && 'Nouveau'].filter(Boolean) as string[]
  }, [dish])

  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>()
    categories.forEach(category => {
      map.set(category.id, category.name)
    })
    return map
  }, [categories])

  const getCategoryName = (categoryId: string) => {
    return categoryNameMap.get(categoryId) || 'Catégorie inconnue'
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F6F3] pt-24">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center text-[#787774]">
            Chargement du plat...
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!dish) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F6F3] pt-24">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="rounded-3xl border border-[#EAEAEA] bg-white p-10 text-center">
              <p className="text-2xl font-bold text-[#111111]">Plat introuvable</p>
              <Link
                href="/menu"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#111111] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#333333]"
              >
                Retour au menu
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-24">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#787774] transition-colors hover:text-[#111111]"
          >
            <FaArrowLeft className="h-4 w-4" />
            Retour
          </button>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-3xl border border-[#EAEAEA] bg-white">
              <img
                src={dish.images[0] || '/placeholder-image.webp'}
                alt={dish.name}
                className="h-[420px] w-full object-cover"
              />
            </div>

            <div className="rounded-3xl border border-[#EAEAEA] bg-white p-8">
              {badges.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {badges.map((badge) => (
                    <span key={badge} className="rounded-full bg-[#111111] px-3 py-1 text-xs font-semibold text-white">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-sm uppercase tracking-[0.25em] text-[#787774]">Détail du plat</p>
              <h1 className="mt-2 text-4xl font-bold text-[#111111]">{dish.name}</h1>
              <p className="mt-4 text-lg text-[#2F3437]">{dish.description || 'Description à venir.'}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#F7F6F3] p-4">
                  <p className="text-sm text-[#787774]">Prix</p>
                  <p className="text-2xl font-bold text-[#111111]">{dish.price} FCFA</p>
                </div>
                <div className="rounded-2xl bg-[#F7F6F3] p-4">
                  <p className="text-sm text-[#787774]">Disponibilité</p>
                  <p className="text-2xl font-bold text-[#111111]">{dish.isAvailable ? 'Disponible' : 'Indisponible'}</p>
                </div>
                <div className="rounded-2xl bg-[#F7F6F3] p-4">
                  <p className="text-sm text-[#787774]">Préparation</p>
                  <p className="flex items-center gap-2 text-lg font-semibold text-[#111111]">
                    <FaClock className="h-4 w-4" />
                    {dish.preparationTime ? `${dish.preparationTime} min` : 'Non précisé'}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F7F6F3] p-4">
                  <p className="text-sm text-[#787774]">Catégorie</p>
                  <p className="flex items-center gap-2 text-lg font-semibold text-[#111111]">
                    <FaUtensils className="h-4 w-4" />
                    {dish ? getCategoryName(dish.categoryId) : '-'}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    addCartItem({
                      dishId: dish.id,
                      name: dish.name,
                      price: Number(dish.price),
                      image: dish.images[0],
                      categoryName: getCategoryName(dish.categoryId),
                      preparationTime: dish.preparationTime,
                    })
                    toast.success('Ajouté au panier')
                  }}
                  disabled={!dish.isAvailable}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#111111] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaCartShopping className="h-4 w-4" />
                  Ajouter au panier
                </button>
                <Link
                  href="/cart"
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#EAEAEA] px-6 py-3 font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3]"
                >
                  Voir le panier
                </Link>
              </div>
            </div>
          </div>

          {relatedDishes.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-[#111111]">Suggestions similaires</h2>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {relatedDishes.slice(0, 3).map((relatedDish) => (
                  <DishCard key={relatedDish.id} dish={relatedDish} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
