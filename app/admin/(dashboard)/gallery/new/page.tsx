'use client';
import React, { useState } from 'react';
import { createGalleryItem } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import ImageUpload from '@/components/admin/ImageUpload';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';

export default function NewGalleryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    category: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = (session?.user as any)?.token;
      await createGalleryItem({ ...formData, isActive: true, order: 0 }, token);
      notify.success('Image ajoutée avec succès.');
      router.push('/admin/gallery');
    } catch (error) {
      notify.error(getErrorMessage(error, "Erreur lors de l'enregistrement de l'image."));
      console.error('Error saving gallery item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/gallery" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#111111]">Ajouter une image</h1>
          <p className="text-[#787774] mt-2">Ajouter une nouvelle image à la galerie</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#111111] border-b pb-2">Image</h3>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                currentImage={formData.imageUrl}
                label="Image pour la galerie"
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#111111] border-b pb-2">Informations</h3>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                  placeholder="Titre de l'image (optionnel)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Catégorie</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                  placeholder="Catégorie (optionnel)"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Link
              href="/admin/gallery"
              className="flex-1 px-4 py-3 border border-gray-200 text-[#111111] rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-[#111111] text-white rounded-lg hover:bg-[#333333] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
