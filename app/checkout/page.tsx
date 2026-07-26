'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import InternationalPhoneField from '@/components/InternationalPhoneField'
import { createOrder, createPayment } from '@/lib/api'
import { ApiError } from '@/lib/api-error'
import { getCurrentUser } from '@/lib/auth'
import { addOrderHistory, clearCart, getCartItems, getCartTotal, type CartItem } from '@/lib/user-flow'
import { toast } from 'sonner'
import {
  FaArrowLeft,
  FaCartShopping,
  FaCheck,
  FaLocationDot,
  FaReceipt,
  FaUser,
} from 'react-icons/fa6'

type CheckoutForm = {
  customerName: string
  customerPhone: string
  deliveryAddress: string
  comment: string
  orderType: 'delivery' | 'pickup'
  paymentMethod: 'YAS_MONEY' | 'MOOV_MONEY'
}

const paymentOptions = [
  {
    value: 'YAS_MONEY' as const,
    title: 'Mixx by Yas',
    description: 'Paiement mobile rapide',
    image: '/logo Mixx by yas-pLAT.svg',
  },
  {
    value: 'MOOV_MONEY' as const,
    title: 'Flooz',
    description: 'Portefeuille mobile',
    image: '/flooz-Photoroom.png',
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { status, data: session } = useSession()
  const token = (session?.user as { token?: string } | undefined)?.token
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [form, setForm] = useState<CheckoutForm>({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    comment: '',
    orderType: 'delivery',
    paymentMethod: 'YAS_MONEY',
  })

  useEffect(() => {
    setItems(getCartItems())
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      if (status !== 'authenticated' || !token) {
        setLoading(false)
        return
      }

      try {
        const user = await getCurrentUser(token)
        if (!isMounted) {
          return
        }

        setForm((current) => ({
          ...current,
          customerName: user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || session?.user?.name || '',
          customerPhone: user.phone || '',
        }))
      } catch (error) {
        if (isMounted) {
          setForm((current) => ({
            ...current,
            customerName:
              current.customerName ||
              session?.user?.name ||
              [session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(' '),
          }))

          console.error(error)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [session?.user?.name, status, token])

  const total = useMemo(() => getCartTotal(items), [items])
  const articleCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  const validateForm = () => {
    const missingFields: string[] = []

    if (!form.customerName.trim()) {
      missingFields.push('le nom complet')
    }

    const phoneDigits = form.customerPhone.replace(/\D/g, '')
    if (phoneDigits.length <= 3) {
      missingFields.push('le numéro de téléphone')
    }

    if (form.orderType === 'delivery' && !form.deliveryAddress.trim()) {
      missingFields.push("l'adresse de livraison")
    }

    if (missingFields.length > 0) {
      const message =
        missingFields.length === 1
          ? `Veuillez remplir ${missingFields[0]}.`
          : `Veuillez remplir ${missingFields.slice(0, -1).join(', ')} et ${missingFields[missingFields.length - 1]}.`

      setValidationError(message)
      toast.error(message)
      return false
    }

    setValidationError('')
    return true
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (status !== 'authenticated' || !token) {
      toast.error('Connecte-toi pour finaliser la commande.')
      router.push('/login')
      return
    }

    if (items.length === 0) {
      toast.error('Le panier est vide.')
      return
    }

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const order = await createOrder({
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        deliveryAddress: form.orderType === 'delivery' ? form.deliveryAddress.trim() : undefined,
        comment: form.comment.trim() || undefined,
        orderType: form.orderType,
        totalAmount: total,
        orderItems: items.map((item) => ({
          dishId: item.dishId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      })

      const payment = await createPayment(
        {
          orderId: order.id,
          amount: order.totalAmount,
          method: form.paymentMethod,
        },
        token,
      )

      addOrderHistory({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        orderType: order.orderType,
        totalAmount: order.totalAmount,
        status: order.status,
        deliveryAddress: order.deliveryAddress,
        comment: order.comment,
        paymentMethod: form.paymentMethod,
        paymentUrl: payment.paymentUrl ?? undefined,
        createdAt: order.createdAt,
        items,
      })

      clearCart()

      if (payment.paymentUrl) {
        window.location.href = payment.paymentUrl
        return
      }

      toast.success('Commande enregistrée avec succès.')
      router.push(`/account/orders/${order.id}`)
    } catch (error) {
      console.error(error)
      const details =
        error instanceof ApiError && error.data && typeof error.data === 'object'
          ? (() => {
              const data = error.data as Record<string, unknown>
              if (typeof data.details === 'string') return data.details
              if (typeof data.erreur === 'string') return data.erreur
              if (typeof data.message === 'string') return data.message
              return ''
            })()
          : ''

      toast.error(details || 'Impossible de finaliser la commande.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F6F3] pt-24">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center text-[#787774]">
            Préparation du checkout...
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F6F3] pt-24">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <div className="rounded-[24px] border border-[#EAEAEA] bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FBFBFA] text-[#111111]">
                <FaCartShopping className="h-5 w-5" />
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-[-0.03em] text-[#111111]">Checkout vide</h1>
              <p className="mt-3 text-[#787774]">Ajoute des plats au panier avant de passer au paiement.</p>
              <Link
                href="/menu"
                className="mt-8 inline-flex rounded-[14px] bg-[#111111] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#333333]"
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
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="rounded-[24px] border border-[#EAEAEA] bg-white p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 rounded-full border border-[#EAEAEA] bg-[#FBFBFA] px-4 py-2 text-sm font-semibold text-[#111111] transition-colors hover:bg-white"
                >
                  <FaArrowLeft className="h-3.5 w-3.5" />
                  Retour au panier
                </Link>
                <p className="text-xs uppercase tracking-[0.28em] text-[#787774]">Paiement</p>
                <h1 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-[#111111]">Finaliser la commande</h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-[#787774]">
                  Vérifie tes coordonnées, choisis ton mode de paiement et confirme en toute simplicité.
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
                  <p className="text-xs uppercase tracking-[0.2em] text-[#787774]">Étape</p>
                  <p className="mt-1 text-lg font-semibold text-[#111111]">Dernière validation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-[24px] border border-[#EAEAEA] bg-white p-8">
              {validationError ? (
                <div className="rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {validationError}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">Nom complet</label>
                  <div className="relative">
                    <FaUser className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#787774]" />
                    <input
                      value={form.customerName}
                      onChange={(event) => {
                        setValidationError('')
                        setForm({ ...form, customerName: event.target.value })
                      }}
                      className="w-full rounded-[14px] border border-[#EAEAEA] bg-white py-3 pl-11 pr-4 text-[#111111] placeholder:text-[#A8A29E] focus:border-[#CFCFCF] focus:outline-none"
                      placeholder="Ton nom"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">Téléphone</label>
                  <InternationalPhoneField
                    value={form.customerPhone}
                    onChange={(value) => {
                      setValidationError('')
                      setForm({ ...form, customerPhone: value })
                    }}
                    defaultCountry="tg"
                    placeholder="90000000"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">Type de commande</label>
                  <select
                    value={form.orderType}
                    onChange={(event) => {
                      setValidationError('')
                      setForm({ ...form, orderType: event.target.value as CheckoutForm['orderType'] })
                    }}
                    className="w-full rounded-[14px] border border-[#EAEAEA] bg-white px-4 py-3 text-[#111111] focus:border-[#CFCFCF] focus:outline-none"
                  >
                    <option value="delivery">Livraison</option>
                    <option value="pickup">À emporter</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">Moyen de paiement</label>
                  <div className="grid gap-3">
                    {paymentOptions.map((option) => {
                      const selected = form.paymentMethod === option.value

                      return (
                    <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setValidationError('')
                            setForm({ ...form, paymentMethod: option.value })
                          }}
                          className={`flex items-center gap-4 rounded-[16px] border px-4 py-3 text-left transition-all ${
                            selected
                              ? 'border-[#111111] bg-[#111111] text-white'
                              : 'border-[#EAEAEA] bg-white text-[#111111] hover:bg-[#FBFBFA]'
                          }`}
                        >
                          <span
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
                              selected ? 'border-white/20 bg-white/10' : 'border-[#EAEAEA] bg-[#FBFBFA]'
                            }`}
                          >
                            <Image
                              src={option.image}
                              alt={option.title}
                              width={40}
                              height={40}
                              className="h-10 w-10 object-contain"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-3">
                              <span className="block font-semibold">{option.title}</span>
                              {selected ? <FaCheck className="h-4 w-4 shrink-0" /> : null}
                            </span>
                            <span className={`mt-1 block text-sm ${selected ? 'text-white/80' : 'text-[#787774]'}`}>
                              {option.description}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {form.orderType === 'delivery' && (
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-[#111111]">Adresse de livraison</label>
                    <div className="relative">
                      <FaLocationDot className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#787774]" />
                    <input
                        value={form.deliveryAddress}
                        onChange={(event) => {
                          setValidationError('')
                          setForm({ ...form, deliveryAddress: event.target.value })
                        }}
                        className="w-full rounded-[14px] border border-[#EAEAEA] bg-white py-3 pl-11 pr-4 text-[#111111] placeholder:text-[#A8A29E] focus:border-[#CFCFCF] focus:outline-none"
                        placeholder="Rue, quartier, ville"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">Commentaire</label>
                  <textarea
                    value={form.comment}
                    onChange={(event) => {
                      setValidationError('')
                      setForm({ ...form, comment: event.target.value })
                    }}
                    className="w-full rounded-[14px] border border-[#EAEAEA] bg-white px-4 py-3 text-[#111111] placeholder:text-[#A8A29E] focus:border-[#CFCFCF] focus:outline-none"
                    rows={4}
                    placeholder="Allergies, précision de livraison, note..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-[14px] bg-[#111111] px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-[#333333] disabled:opacity-60"
              >
                {submitting ? 'Traitement...' : 'Confirmer et payer'}
              </button>
            </form>

            <aside className="h-fit rounded-[24px] border border-[#EAEAEA] bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FBFBFA] text-[#111111]">
                  <FaReceipt className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#787774]">Récapitulatif</p>
                  <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#111111]">Ta commande</h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.dishId}
                    className="flex items-start justify-between gap-4 rounded-[18px] border border-[#EAEAEA] bg-[#FBFBFA] p-4"
                  >
                    <div>
                      <p className="font-semibold text-[#111111]">{item.name}</p>
                      <p className="mt-1 text-sm text-[#787774]">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#111111]">{item.quantity * item.price} FCFA</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[18px] border border-[#EAEAEA] bg-[#FBFBFA] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#787774]">Total</span>
                  <span className="text-2xl font-bold tracking-[-0.02em] text-[#111111]">{total} FCFA</span>
                </div>
              </div>

              <div className="mt-6 rounded-[18px] border border-[#EAEAEA] bg-white p-4">
                <p className="text-sm leading-6 text-[#787774]">
                  En validant, la commande est enregistrée et le paiement est déclenché selon le moyen choisi.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
