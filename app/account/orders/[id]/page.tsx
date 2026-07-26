'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getOrder } from '@/lib/api'
import { getOrderHistoryItem, type OrderHistoryEntry } from '@/lib/user-flow'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  PAYMENT_CONFIRMED: 'Paiement confirmé',
  PREPARING: 'En préparation',
  READY: 'Prête',
  DELIVERING: 'En livraison',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
}

const ORDER_TYPE_LABELS: Record<string, string> = {
  delivery: 'Livraison',
  pickup: 'À emporter',
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  YAS_MONEY: 'Mixx by Yas',
  MOOV_MONEY: 'Flooz',
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const { data: session } = useSession()
  const token = (session?.user as { token?: string } | undefined)?.token
  const [order, setOrder] = useState<OrderHistoryEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    let isMounted = true

    const loadOrder = async () => {
      try {
        setLoading(true)
        const localOrder = getOrderHistoryItem(id)
        if (localOrder && isMounted) {
          setOrder(localOrder)
        }

        if (token) {
          const remoteOrder = await getOrder(id, token)
          if (!isMounted) return
          setOrder({
            id: remoteOrder.id,
            orderNumber: remoteOrder.orderNumber,
            customerName: remoteOrder.customerName,
            customerPhone: remoteOrder.customerPhone,
            orderType: remoteOrder.orderType,
            totalAmount: Number(remoteOrder.totalAmount),
            status: remoteOrder.status,
            deliveryAddress: remoteOrder.deliveryAddress ?? undefined,
            comment: remoteOrder.comment ?? undefined,
            createdAt: remoteOrder.createdAt,
            paymentMethod: remoteOrder.payment?.method,
            items: (remoteOrder.orderItems || []).map((item) => ({
              dishId: item.dishId,
              name: item.dish?.name || item.dishId,
              price: Number(item.unitPrice),
              quantity: item.quantity,
              image: item.dish?.images?.[0],
            })),
          })
        }
      } catch {
        if (isMounted && !getOrderHistoryItem(id)) {
          setOrder(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadOrder()

    return () => {
      isMounted = false
    }
  }, [id, token])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F6F3] pt-24">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center text-[#787774]">
            Chargement de la commande...
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F6F3] pt-24">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <div className="rounded-3xl border border-[#EAEAEA] bg-white p-12 text-center">
              <h1 className="text-3xl font-bold text-[#111111]">Commande introuvable</h1>
              <Link href="/account" className="mt-6 inline-flex rounded-xl bg-[#111111] px-6 py-3 font-semibold text-white hover:bg-[#333333]">
                Retour au compte
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
        <div className="mx-auto max-w-6xl px-4 py-10">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 rounded-full border border-[#EAEAEA] bg-white px-4 py-2 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#FBFBFA]"
          >
            Retour au compte
          </Link>

          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-[#787774]">Commande</p>
            <h1 className="mt-2 text-4xl font-bold text-[#111111]">#{order.orderNumber}</h1>
            <p className="mt-2 text-[#787774]">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-4 rounded-3xl border border-[#EAEAEA] bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#F7F6F3] px-3 py-1 text-xs font-semibold text-[#111111]">
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <span className="rounded-full bg-[#F7F6F3] px-3 py-1 text-xs font-semibold text-[#111111]">
                  {ORDER_TYPE_LABELS[order.orderType] || order.orderType}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-[#787774]">Client</p>
                  <p className="font-semibold text-[#111111]">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-[#787774]">Téléphone</p>
                  <p className="font-semibold text-[#111111]">{order.customerPhone}</p>
                </div>
                {order.deliveryAddress && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-[#787774]">Adresse de livraison</p>
                    <p className="font-semibold text-[#111111]">{order.deliveryAddress}</p>
                  </div>
                )}
                {order.comment && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-[#787774]">Commentaire</p>
                    <p className="font-semibold text-[#111111]">{order.comment}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t border-[#EAEAEA] pt-6">
                {order.items.map((item) => (
                  <div key={item.dishId} className="flex items-center justify-between gap-4 rounded-2xl border border-[#EAEAEA] p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || '/placeholder-image.webp'}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-[#111111]">{item.name}</h3>
                        <p className="text-sm text-[#787774]">x{item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-[#111111]">{item.quantity * item.price} FCFA</p>
                  </div>
                ))}
              </div>
            </section>

            <aside className="h-fit space-y-4 rounded-3xl border border-[#EAEAEA] bg-white p-8 shadow-sm">
              <div>
                <p className="text-sm text-[#787774]">Montant total</p>
                <p className="text-3xl font-bold text-[#111111]">{order.totalAmount} FCFA</p>
              </div>
              <div>
                <p className="text-sm text-[#787774]">Paiement</p>
                <p className="font-semibold text-[#111111]">
                  {order.paymentMethod ? PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod : 'Non initié'}
                </p>
              </div>
              {order.paymentUrl && (
                <a
                  href={order.paymentUrl}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-[#111111] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#333333]"
                >
                  Reprendre le paiement
                </a>
              )}
              <Link
                href="/account"
                className="inline-flex w-full items-center justify-center rounded-xl border border-[#EAEAEA] px-6 py-3 font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3]"
              >
                Retour au compte
              </Link>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
