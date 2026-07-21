'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import Toast from '../ui/Toast'

const MonProfil = () => {
  const [isEditing, setIsEditing] = useState(false)
  const { data: session } = useSession()
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '+221 12 345 6789',
    address: '123 Rue des Délices, Dakar, Sénégal'
  })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null)

  useEffect(() => {
    setProfileData((current) => ({
      ...current,
      name: session?.user?.name || current.name || 'Utilisateur',
      email: session?.user?.email || current.email || '',
    }))
  }, [session?.user?.email, session?.user?.name])

  const initials = (profileData.name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
    || 'U'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    setToast({
      message: 'Profil mis à jour avec succès !',
      type: 'success',
    })
  }

  return (
    <div className="space-y-6 font-montserrat">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-[#111111]">Mon Profil</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-2 border border-[#EAEAEA] rounded-lg font-semibold text-[#111111] hover:bg-[#F7F6F3] transition-colors w-fit"
        >
          {isEditing ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#EAEAEA] p-6 md:p-8">
        {!session?.user && (
          <div className="mb-6 rounded-xl border border-dashed border-[#EAEAEA] bg-[#F7F6F3] p-4 text-sm text-[#787774]">
            Connecte-toi pour afficher et modifier ton profil.
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Nom complet</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Téléphone</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Adresse</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-4 text-[#787774]" />
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  rows={4}
                  className="w-full pl-12 pr-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20 resize-vertical"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-10 py-4 bg-[#111111] text-white text-lg font-semibold rounded-lg hover:bg-[#333333] transition-colors"
            >
              Enregistrer les modifications
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#111111] rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                {initials}
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#111111]">{profileData.name}</h3>
                <p className="text-[#787774]">{profileData.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#EAEAEA]">
              <div className="flex items-start gap-3">
                <FaPhone className="w-5 h-5 text-[#787774] mt-1" />
                <div>
                  <p className="text-sm text-[#787774]">Téléphone</p>
                  <p className="font-semibold text-[#111111] break-all">{profileData.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="w-5 h-5 text-[#787774] mt-1" />
                <div>
                  <p className="text-sm text-[#787774]">Adresse</p>
                  <p className="font-semibold text-[#111111] break-words">{profileData.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default MonProfil
