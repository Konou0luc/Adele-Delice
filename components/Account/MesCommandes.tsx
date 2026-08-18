'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaArrowRight, FaShoppingBag } from 'react-icons/fa'
import { getOrderHistory, type OrderHistoryEntry } from '@/lib/user-flow'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  PAYMENT_CONFIRMED: 'Paiement confirmé',
  PREPARING: 'En préparation',
  READY: 'Prête',
  DELIVERING: 'En livraison',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  PAYMENT_CONFIRMED: 'bg-blue-50 text-blue-700',
  PREPARING: 'bg-orange-50 text-orange-700',
  READY: 'bg-green-50 text-green-700',
  DELIVERING: 'bg-purple-50 text-purple-700',
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-red-50 text-red-700',
}

const MesCommandes = () => {
  const [orders, setOrders] = useState<OrderHistoryEntry[]>([])

  useEffect(() => {
    setOrders(getOrderHistory())
  }, [])

  return (
    <div className="space-y-6 font-montserrat">
      <h2 className="text-2xl font-bold text-[#111111] mb-8">Mes Commandes</h2>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-[#EAEAEA] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-[#111111]">#{order.orderNumber}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-[#F7F6F3] text-[#111111]'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#787774]">
                    {order.customerName} - {order.items.length} article{order.items.length > 1 ? 's' : ''} - {order.totalAmount} FCFA
                  </p>
                  <p className="mt-1 text-sm text-[#787774]">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/track-order?code=${order.orderNumber}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
                  >
                    Suivre en direct
                  </Link>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#EAEAEA] px-5 py-3 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3]"
                  >
                    Voir le détail
                    <FaArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div className="bg-white rounded-xl border border-[#EAEAEA] p-8 md:p-12 text-center">
        <FaShoppingBag className="mx-auto mb-4 h-10 w-10 text-[#787774]" />
        <p className="text-[#111111] text-lg font-semibold mb-2">Aucune commande pour le moment</p>
        <p className="text-[#787774] mb-6">
          Les commandes réalisées via le checkout apparaîtront ici.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center justify-center rounded-lg bg-[#111111] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#333333]"
        >
          Voir le menu
        </Link>
      </div>
      )}
    </div>
  )
}

export default MesCommandes
