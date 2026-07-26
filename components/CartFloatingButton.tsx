'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaCartShopping } from 'react-icons/fa6'
import { cartUpdatedEventName, getCartItems } from '@/lib/user-flow'

export default function CartFloatingButton() {
  const pathname = usePathname()
  const [count, setCount] = useState(0)

  useEffect(() => {
    const sync = () => {
      const items = getCartItems()
      setCount(items.reduce((total, item) => total + item.quantity, 0))
    }

    sync()

    window.addEventListener('storage', sync)
    window.addEventListener(cartUpdatedEventName, sync)

    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(cartUpdatedEventName, sync)
    }
  }, [])

  const hidden = useMemo(() => {
    return (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register')
    )
  }, [pathname])

  if (hidden) {
    return null
  }

  return (
    <Link
      href="/cart"
      aria-label="Ouvrir le panier"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-[#EAEAEA] bg-white px-4 py-3 text-[#111111] shadow-[0_10px_30px_rgba(17,17,17,0.08)] transition-transform duration-200 hover:scale-[0.98]"
    >
      <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white">
        <FaCartShopping className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border border-white bg-[#FDEBEC] px-1 text-[11px] font-semibold text-[#9F2F2D]">
          {count}
        </span>
      </span>

      <span className="hidden pr-1 sm:block">
        <span className="block text-xs uppercase tracking-[0.22em] text-[#787774]">Panier</span>
        <span className="block text-sm font-semibold text-[#111111]">
          {count > 0 ? `${count} article${count > 1 ? 's' : ''}` : 'Vide'}
        </span>
      </span>
    </Link>
  )
}
