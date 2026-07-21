'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroSection from '@/components/Account/HeroSection'
import MesCommandes from '@/components/Account/MesCommandes'
import MonPanier from '@/components/Account/MonPanier'
import MesFavoris from '@/components/Account/MesFavoris'
import MonProfil from '@/components/Account/MonProfil'
import { FaShoppingBag, FaShoppingCart, FaHeart, FaUser } from 'react-icons/fa'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('commandes')
  const { status, data: session } = useSession()
  const isAuthenticated = status === 'authenticated'

  const tabs = [
    { id: 'commandes', name: 'Mes Commandes', icon: FaShoppingBag },
    { id: 'panier', name: 'Mon Panier', icon: FaShoppingCart },
    { id: 'favoris', name: 'Mes Favoris', icon: FaHeart },
    { id: 'profil', name: 'Mon Profil', icon: FaUser }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'commandes':
        return <MesCommandes />
      case 'panier':
        return <MonPanier />
      case 'favoris':
        return <MesFavoris />
      case 'profil':
        return <MonProfil />
      default:
        return <MesCommandes />
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-20">
        <HeroSection />
        
        <div className="max-w-7xl mx-auto px-4 py-12 font-montserrat">
          {!isAuthenticated && status !== 'loading' && (
            <div className="mb-8 rounded-3xl border border-[#EAEAEA] bg-white p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-[#787774]">Espace client</p>
              <h2 className="mt-3 text-3xl font-bold text-[#111111]">Connecte-toi pour retrouver ton espace personnel.</h2>
              <p className="mt-3 max-w-2xl text-[#787774]">
                Accède à tes commandes, ton profil et tes favoris après connexion.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-[#111111] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#333333]"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-[#EAEAEA] bg-white px-6 py-3 font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3]"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          )}

          {isAuthenticated && (
            <div className="mb-8 rounded-3xl border border-[#EAEAEA] bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#787774]">Bonjour</p>
                  <h2 className="mt-2 text-3xl font-bold text-[#111111]">
                    {session?.user?.name || 'Client'} 👋
                  </h2>
                  <p className="mt-2 text-[#787774]">{session?.user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center justify-center rounded-xl border border-[#EAEAEA] bg-white px-6 py-3 font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3]"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          )}

          {status === 'loading' && (
            <div className="mb-8 rounded-3xl border border-[#EAEAEA] bg-white p-8 shadow-sm text-[#787774]">
              Chargement de votre session...
            </div>
          )}

          {isAuthenticated && (
            <>
              <div className="bg-white rounded-xl border border-[#EAEAEA] mb-8 overflow-x-auto">
                <div className="flex min-w-max">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-8 py-4 font-semibold transition-all border-b-2 ${
                          activeTab === tab.id
                            ? 'text-[#111111] border-[#111111] bg-[#F7F6F3]/50'
                            : 'text-[#787774] border-transparent hover:text-[#111111] hover:bg-[#F7F6F3]/30'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>{renderContent()}</div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
