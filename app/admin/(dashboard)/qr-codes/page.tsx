'use client';

import { useEffect, useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { getDishes, getCategories, type Dish, type Category } from '@/lib/api';
import { toast } from 'sonner';
import { FaQrcode, FaDownload, FaShareNodes, FaCopy } from 'react-icons/fa6';

export default function AdminQRCodesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [qrType, setQrType] = useState<'restaurant' | 'category' | 'dish'>('restaurant');
  const [selectedId, setSelectedId] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string>('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://adele-delice.vercel.app';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dishesData, categoriesData] = await Promise.all([
          getDishes(),
          getCategories(),
        ]);
        setDishes(dishesData || []);
        setCategories(categoriesData || []);
      } catch {
        toast.error('Erreur de chargement des données');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getTargetUrl = () => {
    if (qrType === 'restaurant') return `${baseUrl}/`;
    if (qrType === 'category' && selectedId) return `${baseUrl}/menu?category=${selectedId}`;
    if (qrType === 'dish' && selectedId) return `${baseUrl}/menu/${selectedId}`;
    return baseUrl;
  };

  const currentTargetUrl = getTargetUrl();
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    currentTargetUrl
  )}`;

  const handleDownload = async (format: 'png' | 'svg') => {
    try {
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&format=${format}&data=${encodeURIComponent(
        currentTargetUrl
      )}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `qrcode-adele-delice-${qrType}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success(`QR Code téléchargé en .${format.toUpperCase()}`);
    } catch {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentTargetUrl);
    toast.success('Lien copié dans le presse-papier !');
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(`Découvrez le menu Adèle Délice ici : ${currentTargetUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Générateur de QR Codes"
        description="Générez et téléchargez des QR Codes pour le restaurant, vos catégories ou vos plats."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#111111]">1. Choisissez le type de QR Code</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <button
              onClick={() => {
                setQrType('restaurant');
                setSelectedId('');
              }}
              className={`rounded-2xl border p-4 text-left transition-all ${
                qrType === 'restaurant'
                  ? 'border-[#111111] bg-[#111111] text-white'
                  : 'border-[#EAEAEA] bg-[#FBFBFA] text-[#111111] hover:bg-[#F7F6F3]'
              }`}
            >
              <FaQrcode className="h-6 w-6 mb-2" />
              <p className="font-bold">Le Restaurant</p>
              <p className="text-xs opacity-80 mt-1">Page d'accueil du site</p>
            </button>

            <button
              onClick={() => {
                setQrType('category');
                if (categories.length > 0) setSelectedId(categories[0].id);
              }}
              className={`rounded-2xl border p-4 text-left transition-all ${
                qrType === 'category'
                  ? 'border-[#111111] bg-[#111111] text-white'
                  : 'border-[#EAEAEA] bg-[#FBFBFA] text-[#111111] hover:bg-[#F7F6F3]'
              }`}
            >
              <FaQrcode className="h-6 w-6 mb-2" />
              <p className="font-bold">Une Catégorie</p>
              <p className="text-xs opacity-80 mt-1">Lien vers une catégorie</p>
            </button>

            <button
              onClick={() => {
                setQrType('dish');
                if (dishes.length > 0) setSelectedId(dishes[0].id);
              }}
              className={`rounded-2xl border p-4 text-left transition-all ${
                qrType === 'dish'
                  ? 'border-[#111111] bg-[#111111] text-white'
                  : 'border-[#EAEAEA] bg-[#FBFBFA] text-[#111111] hover:bg-[#F7F6F3]'
              }`}
            >
              <FaQrcode className="h-6 w-6 mb-2" />
              <p className="font-bold">Un Plat spécifique</p>
              <p className="text-xs opacity-80 mt-1">Fiche détaillée du plat</p>
            </button>
          </div>

          {qrType === 'category' && (
            <div>
              <label className="block text-xs font-semibold text-[#111111]">Sélectionnez la catégorie</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {qrType === 'dish' && (
            <div>
              <label className="block text-xs font-semibold text-[#111111]">Sélectionnez le plat</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:outline-none"
              >
                {dishes.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.price} FCFA)</option>
                ))}
              </select>
            </div>
          )}

          <div className="rounded-xl border border-[#EAEAEA] bg-[#FBFBFA] p-4">
            <p className="text-xs font-semibold text-[#787774]">URL ciblée :</p>
            <p className="text-sm font-bold text-[#111111] break-all">{currentTargetUrl}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#787774]">Aperçu du QR Code</p>

          <div className="rounded-2xl border border-[#EAEAEA] p-4 bg-white shadow-md">
            <img
              src={qrImageUrl}
              alt="QR Code"
              className="h-56 w-56 object-contain"
            />
          </div>

          <div className="w-full space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDownload('png')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#333333]"
              >
                <FaDownload className="h-3.5 w-3.5" /> Télécharger PNG
              </button>
              <button
                onClick={() => handleDownload('svg')}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-xs font-semibold text-[#111111] hover:bg-[#F7F6F3]"
              >
                <FaDownload className="h-3.5 w-3.5" /> Télécharger SVG
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-xs font-semibold text-[#111111] hover:bg-[#F7F6F3]"
              >
                <FaCopy className="h-3.5 w-3.5" /> Copier le lien
              </button>
              <button
                onClick={handleShareWhatsapp}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-green-700"
              >
                <FaShareNodes className="h-3.5 w-3.5" /> Partager WA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
