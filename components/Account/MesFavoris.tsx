'use client'

import { FaHeart } from 'react-icons/fa'

const MesFavoris = () => {
  const favorites = [
    {
      id: 1,
      name: 'Poulet Yassa',
      description: 'Poulet mariné aux oignons et citron, servi avec du riz blanc',
      price: 2500,
      image: '/Plats/IMG_20260628_215543957_AE.webp'
    },
    {
      id: 2,
      name: 'Thieboudienne',
      description: 'Plat traditionnel sénégalais avec du poisson et du riz',
      price: 3000,
      image: '/Plats/IMG_20260602_155913180_AE.webp'
    },
    {
      id: 3,
      name: 'Tiramisu Maison',
      description: 'Dessert italien classique au café et mascarpone',
      price: 1000,
      image: '/Plats/IMG_20260628_185117968_AE.webp'
    }
  ]

  return (
    <div className="space-y-6 font-montserrat">
      <h2 className="text-2xl font-bold text-[#111111] mb-8">Mes Favoris</h2>
      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#EAEAEA] p-8 md:p-12 text-center">
          <p className="text-[#787774] text-lg mb-6">Vous n'avez pas de favoris</p>
          <a href="/menu" className="inline-block px-8 py-3 bg-[#111111] text-white font-semibold rounded-lg hover:bg-[#333333] transition-colors">
            Voir le menu
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {favorites.map((item) => (
            <div key={item.id} className="group bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 md:h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 w-9 h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-md hover:shadow-lg transition-shadow">
                  <FaHeart />
                </button>
              </div>
              <div className="p-4 md:p-6">
                <h3 className="text-lg font-bold text-[#111111] mb-2">{item.name}</h3>
                <p className="text-[#787774] text-sm mb-4">{item.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <span className="text-xl font-bold text-[#111111]">{item.price} FCFA</span>
                  <button className="w-full sm:w-auto px-4 py-2 bg-[#111111] text-white text-sm font-semibold rounded-lg hover:bg-[#333333] transition-colors">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MesFavoris
