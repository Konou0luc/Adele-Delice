'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from 'react-icons/fa'
import ConfirmationDialog from '@/components/ui/ConfirmationDialog'
import { getCartItems, getCartTotal, removeCartItem, updateCartQuantity, type CartItem } from '@/lib/user-flow'

const MonPanier = () => {
  const [items, setItems] = useState<CartItem[]>([])
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null)

  useEffect(() => {
    setItems(getCartItems())
  }, [])

  const total = useMemo(() => getCartTotal(items), [items])

  const sync = (nextItems: CartItem[]) => {
    setItems(nextItems)
  }

  const confirmRemoval = () => {
    if (!itemToRemove) {
      return
    }

    sync(removeCartItem(itemToRemove.dishId))
    setItemToRemove(null)
  }

  return (
    <div className="space-y-6 font-montserrat">
      <h2 className="text-2xl font-bold text-[#111111] mb-8">Mon Panier</h2>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.dishId} className="flex flex-col gap-4 rounded-xl border border-[#EAEAEA] bg-white p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={item.image || '/placeholder-image.webp'}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-[#111111]">{item.name}</h3>
                  <p className="text-sm text-[#787774]">{item.price} FCFA</p>
                  {item.categoryName && <p className="text-xs text-[#787774]">{item.categoryName}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => sync(updateCartQuantity(item.dishId, item.quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAEAEA] text-[#111111] hover:bg-[#F7F6F3]"
                >
                  <FaMinus className="h-3 w-3" />
                </button>
                <span className="min-w-8 text-center font-semibold text-[#111111]">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => sync(updateCartQuantity(item.dishId, item.quantity + 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#EAEAEA] text-[#111111] hover:bg-[#F7F6F3]"
                >
                  <FaPlus className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setItemToRemove(item)}
                  className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <FaTrash className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-4 rounded-xl border border-[#EAEAEA] bg-white p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#787774]">Total</p>
              <p className="text-2xl font-bold text-[#111111]">{total} FCFA</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded-lg border border-[#EAEAEA] px-6 py-3 font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3]"
              >
                Ouvrir le panier
              </Link>
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-lg bg-[#111111] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#333333]"
              >
                Passer au paiement
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#EAEAEA] p-8 md:p-12 text-center">
          <FaShoppingCart className="mx-auto mb-4 h-10 w-10 text-[#787774]" />
          <p className="text-[#111111] text-lg font-semibold mb-2">Votre panier est vide</p>
          <p className="text-[#787774] mb-6">
            Ajoute des plats depuis le menu pour commencer la commande.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-lg bg-[#111111] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#333333]"
          >
            Parcourir le menu
          </Link>
        </div>
      )}
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
    </div>
  )
}

export default MonPanier
