'use client'

import Link from 'next/link'
import { FaHeart } from 'react-icons/fa'

const MesFavoris = () => {
  return (
    <div className="space-y-6 font-montserrat">
      <h2 className="text-2xl font-bold text-[#111111] mb-8">Mes Favoris</h2>

      <div className="bg-white rounded-xl border border-[#EAEAEA] p-8 md:p-12 text-center">
        <FaHeart className="mx-auto mb-4 h-10 w-10 text-[#787774]" />
        <p className="text-[#111111] text-lg font-semibold mb-2">Aucun favori enregistré</p>
        <p className="text-[#787774] mb-6">
          Nous brancherons les vrais favoris quand l’API utilisateur sera prête.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center justify-center rounded-lg bg-[#111111] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#333333]"
        >
          Découvrir le menu
        </Link>
      </div>
    </div>
  )
}

export default MesFavoris
