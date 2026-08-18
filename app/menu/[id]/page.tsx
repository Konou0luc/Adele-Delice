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
import {
  FaArrowLeft,
  FaCartShopping,
  FaClock,
  FaUtensils,
  FaPepperHot,
  FaQrcode,
  FaShareNodes,
  FaWhatsapp,
  FaFacebook,
  FaXTwitter,
  FaCopy,
} from 'react-icons/fa6'
import { toast } from 'sonner'

export default function DishDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id
  const [dish, setDish] = useState<Dish | null>(null)
  const [relatedDishes, setRelatedDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showQrModal, setShowQrModal] = useState(false)

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
    toast.success('Lien du plat copié dans le presse-papier !')
  }

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'twitter') => {
    const text = encodeURIComponent(`Découvrez le plat "${dish?.name}" chez Adèle Délice : ${currentUrl}`)
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${text}`, '_blank')
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
    }
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

  const images = dish.images && dish.images.length > 0 ? dish.images : ['/placeholder-image.webp']

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-24 pb-16">
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
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-[#EAEAEA] bg-white">
                <img
                  src={images[activeImageIndex] || '/placeholder-image.webp'}
                  alt={dish.name}
                  className="h-[420px] w-full object-cover transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`overflow-hidden rounded-xl border-2 transition-all ${
                        activeImageIndex === idx ? 'border-[#111111] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Vignette ${idx}`} className="h-20 w-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-[#EAEAEA] bg-white p-8 space-y-6">
              <div>
                {badges.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {badges.map((badge) => (
                      <span key={badge} className="rounded-full bg-[#111111] px-3 py-1 text-xs font-semibold text-white">
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.25em] text-[#787774]">Détail du plat</p>
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#EAEAEA] px-3 py-1 text-xs font-semibold text-[#111111] hover:bg-[#F7F6F3]"
                  >
                    <FaQrcode className="h-3.5 w-3.5" /> QR Code
                  </button>
                </div>
                <h1 className="mt-2 text-4xl font-bold text-[#111111]">{dish.name}</h1>
                <p className="mt-4 text-lg text-[#2F3437]">{dish.description || 'Description à venir.'}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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

              {/* Spice Level & Allergens */}
              {(dish.spiceLevel || (dish.allergens && dish.allergens.length > 0)) && (
                <div className="rounded-2xl border border-[#EAEAEA] p-4 space-y-3 bg-[#FBFBFA]">
                  {dish.spiceLevel ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#111111]">
                      <span>Niveau de piquant :</span>
                      <div className="flex items-center text-red-500">
                        {Array.from({ length: dish.spiceLevel }).map((_, i) => (
                          <FaPepperHot key={i} className="h-4 w-4" />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {dish.allergens && dish.allergens.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[#787774]">Allergènes :</p>
                      <div className="flex flex-wrap gap-1.5">
                        {dish.allergens.map((allergen, idx) => (
                          <span key={idx} className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs text-amber-800 font-medium">
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
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
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#111111] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaCartShopping className="h-4 w-4" />
                  Ajouter au panier
                </button>
                <Link
                  href="/cart"
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-[#EAEAEA] px-6 py-3.5 font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3]"
                >
                  Voir le panier
                </Link>
              </div>

              {/* Social Sharing */}
              <div className="border-t border-[#EAEAEA] pt-4 space-y-2">
                <p className="text-xs font-semibold text-[#787774] flex items-center gap-1.5">
                  <FaShareNodes className="h-3.5 w-3.5" /> Partager ce plat :
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                  >
                    <FaWhatsapp className="h-3.5 w-3.5" /> WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    <FaFacebook className="h-3.5 w-3.5" /> Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                  >
                    <FaXTwitter className="h-3.5 w-3.5" /> X
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#EAEAEA] bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] hover:bg-[#F7F6F3]"
                  >
                    <FaCopy className="h-3.5 w-3.5" /> Copier lien
                  </button>
                </div>
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

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center space-y-4">
            <h3 className="text-lg font-bold text-[#111111]">{dish.name}</h3>
            <div className="mx-auto w-48 h-48 rounded-xl border border-[#EAEAEA] p-2 bg-white">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`}
                alt={`QR Code ${dish.name}`}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs text-[#787774]">Scannez pour accéder directement à la fiche du plat.</p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full rounded-xl bg-[#111111] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#333333]"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
