'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog'
import {
  getCartItems,
  getCartTotal,
  clearCart,
  removeCartItem,
  updateCartQuantity,
  type CartItem,
} from '@/lib/user-flow'
import { FaBagShopping, FaClock, FaMinus, FaPlus, FaShieldHeart, FaTrash } from 'react-icons/fa6'

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null)
  const [isClearingCart, setIsClearingCart] = useState(false)

  useEffect(() => {
    setItems(getCartItems())
  }, [])

  const total = useMemo(() => getCartTotal(items), [items])
  const articleCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  const sync = (nextItems: CartItem[]) => setItems(nextItems)

  const confirmRemoval = () => {
    if (!itemToRemove) {
      return
    }

    sync(removeCartItem(itemToRemove.dishId))
    setItemToRemove(null)
  }

  const confirmClearCart = () => {
    clearCart()
    setItems([])
    setIsClearingCart(false)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-24">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-10 rounded-[24px] border border-[#EAEAEA] bg-white p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.28em] text-[#787774]">Panier</p>
                <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-[#111111]">Mon panier</h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-[#787774]">
                  Vérifie tes plats, ajuste les quantités et passe au checkout sans perdre le fil.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#787774]">Articles</p>
                  <p className="mt-1 text-lg font-semibold text-[#111111]">{articleCount}</p>
                </div>
                <div className="rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#787774]">Total</p>
                  <p className="mt-1 text-lg font-semibold text-[#111111]">{total} FCFA</p>
                </div>
                <div className="rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#787774]">Support</p>
                  <p className="mt-1 text-lg font-semibold text-[#111111]">Paiement rapide</p>
                </div>
              </div>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.dishId}
                    className="rounded-[20px] border border-[#EAEAEA] bg-white p-5 transition-shadow hover:shadow-[0_8px_24px_rgba(17,17,17,0.04)]"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <img
                          src={item.image || '/placeholder-image.webp'}
                          alt={item.name}
                          className="h-24 w-24 rounded-2xl border border-[#EAEAEA] object-cover"
                        />
                        <div className="space-y-2">
                          <div>
                            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#111111]">
                              {item.name}
                            </h2>
                            <p className="mt-1 text-sm text-[#787774]">
                              {item.categoryName || 'Cuisine maison'} · {item.price} FCFA l’unité
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs text-[#787774]">
                            {item.preparationTime ? (
                              <span className="inline-flex items-center gap-2 rounded-full border border-[#EAEAEA] bg-[#FBFBFA] px-3 py-1">
                                <FaClock className="h-3 w-3" />
                                {item.preparationTime} min
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-4 md:items-end">
                        <div className="flex items-center rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA] p-1">
                          <button
                            type="button"
                            onClick={() => sync(updateCartQuantity(item.dishId, item.quantity - 1))}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] transition-colors hover:bg-white"
                            aria-label={`Réduire la quantité de ${item.name}`}
                          >
                            <FaMinus className="h-3 w-3" />
                          </button>
                          <span className="min-w-12 px-3 text-center text-base font-semibold text-[#111111]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => sync(updateCartQuantity(item.dishId, item.quantity + 1))}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#111111] transition-colors hover:bg-white"
                            aria-label={`Augmenter la quantité de ${item.name}`}
                          >
                            <FaPlus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-lg font-semibold text-[#111111]">
                            {item.price * item.quantity} FCFA
                          </p>
                          <button
                            type="button"
                            onClick={() => setItemToRemove(item)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-200 text-red-600 transition-colors hover:bg-red-50"
                            aria-label={`Supprimer ${item.name}`}
                          >
                            <FaTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="h-fit rounded-[20px] border border-[#EAEAEA] bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FBFBFA] text-[#111111]">
                    <FaBagShopping className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#787774]">Récapitulatif</p>
                    <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#111111]">Commande</h2>
                  </div>
                </div>

                <div className="mt-6 space-y-4 rounded-[18px] border border-[#EAEAEA] bg-[#FBFBFA] p-4">
                  <div className="flex items-center justify-between text-sm text-[#787774]">
                    <span>Nombre d’articles</span>
                    <span className="font-medium text-[#111111]">{articleCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#787774]">
                    <span>Sous-total</span>
                    <span className="font-medium text-[#111111]">{total} FCFA</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#787774]">
                    <span>Préparation</span>
                    <span className="font-medium text-[#111111]">Selon le plat choisi</span>
                  </div>
                </div>

                <div className="mt-6 rounded-[18px] border border-[#EAEAEA] bg-white p-4">
                  <div className="flex items-start gap-3">
                    <FaShieldHeart className="mt-0.5 h-4 w-4 text-[#787774]" />
                    <p className="text-sm leading-6 text-[#787774]">
                      Tu peux encore modifier les quantités avant de valider le paiement.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#111111] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
                  >
                    Passer au paiement
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsClearingCart(true)}
                    className="inline-flex w-full items-center justify-center rounded-[14px] border border-red-200 bg-white px-6 py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Vider le panier
                  </button>
                  <Link
                    href="/menu"
                    className="inline-flex w-full items-center justify-center rounded-[14px] border border-[#EAEAEA] bg-white px-6 py-3.5 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#FBFBFA]"
                  >
                    Continuer mes achats
                  </Link>
                </div>
              </aside>
            </div>
          ) : (
            <div className="rounded-[24px] border border-[#EAEAEA] bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBFBFA] text-[#111111]">
                <FaBagShopping className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-[-0.02em] text-[#111111]">Votre panier est vide</h2>
              <p className="mx-auto mt-3 max-w-xl text-[#787774]">
                Ajoute des plats depuis le menu pour préparer ta commande et revenir ici à tout moment.
              </p>
              <Link
                href="/menu"
                className="mt-8 inline-flex items-center justify-center rounded-[14px] bg-[#111111] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
              >
                Voir le menu
              </Link>
            </div>
          )}
        </div>
      </div>
      <ConfirmationDialog
        isOpen={Boolean(itemToRemove)}
        title="Supprimer du panier"
        message={
          itemToRemove
            ? `Veux-tu vraiment retirer “${itemToRemove.name}” de ton panier ?`
            : ''
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmRemoval}
        onCancel={() => setItemToRemove(null)}
      />
      <ConfirmationDialog
        isOpen={isClearingCart}
        title="Vider le panier"
        message="Cette action supprimera tous les plats du panier. Veux-tu continuer ?"
        confirmText="Vider"
        cancelText="Annuler"
        onConfirm={confirmClearCart}
        onCancel={() => setIsClearingCart(false)}
      />
      <Footer />
    </>
  )
}
