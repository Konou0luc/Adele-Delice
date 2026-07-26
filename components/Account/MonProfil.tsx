'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa'
import InternationalPhoneField from '../InternationalPhoneField'
import Toast from '../ui/Toast'
import { getCurrentUser, updateCurrentUser } from '@/lib/auth'

type ProfileForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

const emptyProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

const inputFieldClass =
  'w-full rounded-lg border border-[#EAEAEA] bg-white px-4 py-3 text-[#111111] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#111111]/20'

function splitName(name?: string | null) {
  const cleaned = (name ?? '').trim()

  if (!cleaned) {
    return { firstName: '', lastName: '' }
  }

  const parts = cleaned.split(/\s+/)
  const firstName = parts.shift() ?? ''
  const lastName = parts.join(' ')

  return { firstName, lastName }
}

const MonProfil = () => {
  const { data: session, update } = useSession()
  const token = (session?.user as { token?: string } | undefined)?.token ?? undefined
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileForm>(emptyProfile)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null)

  useEffect(() => {
    let isMounted = true

    const sessionName = session?.user?.name ?? ''
    const { firstName: sessionFirstName, lastName: sessionLastName } = splitName(sessionName)
    const sessionProfile = {
      firstName: sessionFirstName,
      lastName: sessionLastName,
      email: session?.user?.email ?? '',
      phone: '',
    }

    setProfileData((current) => ({
      ...current,
      ...sessionProfile,
    }))

    const loadProfile = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const user = await getCurrentUser(token)

        if (!isMounted) {
          return
        }

        const nextProfile = {
          firstName: user.firstName || sessionFirstName || '',
          lastName: user.lastName || sessionLastName || '',
          email: user.email || session?.user?.email || '',
          phone: user.phone || '',
        }

        setProfileData(nextProfile)

        const needsCompletion = !nextProfile.firstName || !nextProfile.lastName || !nextProfile.phone
        setIsEditing(needsCompletion)
      } catch {
        if (isMounted) {
          setToast({
            message: 'Impossible de charger le profil.',
            type: 'error',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [session?.user?.email, token])

  const displayName = useMemo(() => {
    return [profileData.firstName, profileData.lastName].filter(Boolean).join(' ') || session?.user?.name || 'Utilisateur'
  }, [profileData.firstName, profileData.lastName, session?.user?.name])

  const initials = useMemo(() => {
    const parts = displayName.split(' ').filter(Boolean)
    return (parts[0]?.[0] ?? 'U') + (parts[1]?.[0] ?? '')
  }, [displayName])

  const isProfileComplete = Boolean(profileData.firstName && profileData.lastName && profileData.phone)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token) {
      setToast({
        message: 'Session introuvable, reconnecte-toi.',
        type: 'error',
      })
      return
    }

    setIsSaving(true)

    try {
      const phone = profileData.phone.trim()

      if (phone && !phone.startsWith('+228')) {
        setToast({
          message: 'Le numéro de téléphone doit être togolais (+228).',
          type: 'error',
        })
        return
      }

      const updated = await updateCurrentUser(
        {
          firstName: profileData.firstName.trim(),
          lastName: profileData.lastName.trim(),
          phone,
        },
        token
      )

      setProfileData({
        firstName: updated.firstName || '',
        lastName: updated.lastName || '',
        email: updated.email || profileData.email,
        phone: updated.phone || '',
      })

      await update({
        firstName: updated.firstName || '',
        lastName: updated.lastName || '',
        email: updated.email || profileData.email,
        name: [updated.firstName, updated.lastName].filter(Boolean).join(' ') || updated.email || profileData.email,
      })

      setIsEditing(false)
      setToast({
        message: isProfileComplete ? 'Profil mis à jour avec succès !' : 'Profil complété avec succès !',
        type: 'success',
      })
    } catch {
      setToast({
        message: 'Impossible de mettre à jour le profil.',
        type: 'error',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 font-montserrat">
        <h2 className="text-2xl font-bold text-[#111111]">Mon Profil</h2>
        <div className="rounded-xl border border-[#EAEAEA] bg-white p-8 text-[#787774]">
          Chargement du profil...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-montserrat">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#111111]">Mon Profil</h2>
          {!isProfileComplete && (
            <p className="mt-2 text-sm text-amber-700">
              Complète ton profil pour finaliser ton inscription Google.
            </p>
          )}
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-2 border border-[#EAEAEA] rounded-lg font-semibold text-[#111111] hover:bg-[#F7F6F3] transition-colors w-fit"
        >
          {isEditing ? 'Annuler' : isProfileComplete ? 'Modifier' : 'Compléter'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#EAEAEA] p-6 md:p-8">
        {!isProfileComplete && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Ton compte est connecté, mais il manque encore quelques infos pour terminer le profil.
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Prénom</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(event) => setProfileData({ ...profileData, firstName: event.target.value })}
                    className={`w-full pl-12 pr-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20 ${inputFieldClass}`}
                    style={{ color: '#111111', WebkitTextFillColor: '#111111' }}
                    placeholder="Prénom"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Nom</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(event) => setProfileData({ ...profileData, lastName: event.target.value })}
                    className={`w-full pl-12 pr-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20 ${inputFieldClass}`}
                    style={{ color: '#111111', WebkitTextFillColor: '#111111' }}
                    placeholder="Nom"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#EAEAEA] bg-[#F7F6F3] p-4">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-[#787774]" />
                <div>
                  <p className="text-sm font-semibold text-[#111111]">Email</p>
                  <p className="text-sm text-[#787774] break-words">{profileData.email || 'Adresse email liée au compte Google'}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Téléphone</label>
              <InternationalPhoneField
                value={profileData.phone}
                onChange={(value) => setProfileData({ ...profileData, phone: value })}
                defaultCountry="tg"
                placeholder="90000000"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full px-10 py-4 bg-[#111111] text-white text-lg font-semibold rounded-lg hover:bg-[#333333] transition-colors disabled:opacity-70"
            >
              {isSaving ? 'Enregistrement...' : isProfileComplete ? 'Enregistrer les modifications' : 'Compléter mon profil'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#111111] rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                {initials}
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#111111]">{displayName}</h3>
                <p className="text-[#787774]">{profileData.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#EAEAEA]">
              <div className="flex items-start gap-3">
                <FaUser className="w-5 h-5 text-[#787774] mt-1" />
                <div>
                  <p className="text-sm text-[#787774]">Prénom</p>
                  <p className="font-semibold text-[#111111] break-all">{profileData.firstName || 'À compléter'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaUser className="w-5 h-5 text-[#787774] mt-1" />
                <div>
                  <p className="text-sm text-[#787774]">Nom</p>
                  <p className="font-semibold text-[#111111] break-words">{profileData.lastName || 'À compléter'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="w-5 h-5 text-[#787774] mt-1" />
                <div>
                  <p className="text-sm text-[#787774]">Téléphone</p>
                  <p className="font-semibold text-[#111111] break-all">{profileData.phone || 'À compléter'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="w-5 h-5 text-[#787774] mt-1" />
                <div>
                  <p className="text-sm text-[#787774]">Email</p>
                  <p className="font-semibold text-[#111111] break-words">{profileData.email}</p>
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
