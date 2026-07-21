'use client';
import React, { useState } from 'react';
import { createCategory } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import ImageUpload from '@/components/admin/ImageUpload';

export default function NewCategoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', description: '', imageUrl: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = (session?.user as any)?.token;
      await createCategory({ ...formData, isActive: true, order: 0 }, token);
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#111111]">Ajouter une catégorie</h1>
          <p className="text-[#787774] mt-2">Créer une nouvelle catégorie de plats</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#111111] border-b pb-2">Informations</h3>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Nom</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                  placeholder="Entrez le nom de la catégorie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Description de la catégorie (optionnel)"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#111111] border-b pb-2">Image</h3>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                currentImage={formData.imageUrl}
                label="Image de la catégorie"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Link
              href="/admin/categories"
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
