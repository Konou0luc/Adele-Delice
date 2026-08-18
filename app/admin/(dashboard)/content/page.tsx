'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { getSiteContent, updateSiteContent } from '@/lib/api';
import { toast } from 'sonner';
import { FaFloppyDisk, FaGlobe, FaPhone, FaWhatsapp, FaLocationDot, FaClock } from 'react-icons/fa6';

export default function AdminContentPage() {
  const { data: session } = useSession();
  const token = (session?.user as { token?: string } | undefined)?.token;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [content, setContent] = useState({
    slogan: 'Mangez comme si vous êtes à la maison.',
    phone: '+228 90 00 00 00',
    whatsapp: '+228 90 00 00 00',
    address: 'Lomé, Togo',
    openingHours: 'Lundi - Dimanche : 08h00 - 23h00',
    googleMapsUrl: 'https://maps.google.com',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    tiktokUrl: 'https://tiktok.com',
    xUrl: 'https://x.com',
    aboutHistory: 'Fondé en 2026, Adèle Délice propose des plats authentiques préparés avec passion.',
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const data = await getSiteContent();
        if (data && Object.keys(data).length > 0) {
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch {
        // Fallback default values
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await updateSiteContent(content, token);
      toast.success('Contenu du site mis à jour avec succès');
    } catch {
      toast.error('Erreur lors de la mise à jour du contenu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gestion du Contenu du Site (CMS)"
        description="Modifiez les informations globales, horaires, coordonnées et réseaux sociaux."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <FaGlobe className="text-[#787774]" /> Identité & Slogan
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#111111]">Slogan du Restaurant</label>
              <input
                type="text"
                value={content.slogan}
                onChange={(e) => setContent({ ...content, slogan: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111111]">Histoire courte (À propos)</label>
              <input
                type="text"
                value={content.aboutHistory}
                onChange={(e) => setContent({ ...content, aboutHistory: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <FaPhone className="text-[#787774]" /> Coordonnées & Localisation
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-[#111111]">Téléphone principal</label>
              <input
                type="text"
                value={content.phone}
                onChange={(e) => setContent({ ...content, phone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111]">Numéro WhatsApp</label>
              <input
                type="text"
                value={content.whatsapp}
                onChange={(e) => setContent({ ...content, whatsapp: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111]">Horaires d'ouverture</label>
              <input
                type="text"
                value={content.openingHours}
                onChange={(e) => setContent({ ...content, openingHours: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-[#111111]">Adresse physique</label>
              <input
                type="text"
                value={content.address}
                onChange={(e) => setContent({ ...content, address: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111]">Lien Google Maps (Embed)</label>
              <input
                type="text"
                value={content.googleMapsUrl}
                onChange={(e) => setContent({ ...content, googleMapsUrl: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#111111] flex items-center gap-2">
            <FaGlobe className="text-[#787774]" /> Liens Réseaux Sociaux
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111]">Facebook URL</label>
              <input
                type="url"
                value={content.facebookUrl}
                onChange={(e) => setContent({ ...content, facebookUrl: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111111]">Instagram URL</label>
              <input
                type="url"
                value={content.instagramUrl}
                onChange={(e) => setContent({ ...content, instagramUrl: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111111]">TikTok URL</label>
              <input
                type="url"
                value={content.tiktokUrl}
                onChange={(e) => setContent({ ...content, tiktokUrl: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111111]">X (Twitter) URL</label>
              <input
                type="url"
                value={content.xUrl}
                onChange={(e) => setContent({ ...content, xUrl: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-6 py-3 font-semibold text-white hover:bg-[#333333] transition-colors disabled:opacity-50"
          >
            <FaFloppyDisk className="h-4 w-4" /> {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}
