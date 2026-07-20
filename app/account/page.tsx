'use client'

import { useState } from 'react'
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
          {/* Tabs */}
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

          {/* Content */}
          <div>
            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
