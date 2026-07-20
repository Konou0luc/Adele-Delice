'use client'

import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/Gallery/interior-shot-cafe-with-chairs-near-bar-with-wooden-tables.webp"
          alt="Mon Compte Adèle Délice"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white font-montserrat">
        <div className="flex items-center justify-center gap-2 text-sm mb-6">
          <Link href="/" className="hover:text-[#F7F6F3] transition-colors">Accueil</Link>
          <span>›</span>
          <span className="text-[#F7F6F3]">Mon Compte</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">Mon Compte</h1>
        <p className="text-lg md:text-xl text-gray-200">
          Gérez vos commandes, votre panier et vos informations personnelles
        </p>
      </div>
    </section>
  )
}

export default HeroSection
