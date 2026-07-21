'use client';
import React, { useState, useEffect } from 'react';
import { getCategories, getDish, updateDish, deleteDish } from '@/lib/api';
import type { Dish, Category } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import MultiImageUpload from '@/components/admin/MultiImageUpload';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function EditDishPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [dish, setDish] = useState<Dish | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    images: [] as string[],
    isAvailable: true,
    isPromoted: false,
    isNew: false,
    preparationTime: '',
    spiceLevel: '',
    allergens: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dishData, categoriesData] = await Promise.all([
        getDish(id),
        getCategories()
      ]);
      setDish(dishData);
      setCategories(categoriesData);
      setFormData({
        name: dishData.name,
        description: dishData.description || '',
        price: dishData.price.toString(),
        categoryId: dishData.categoryId,
        images: dishData.images,
        isAvailable: dishData.isAvailable,
        isPromoted: dishData.isPromoted,
        isNew: dishData.isNew,
        preparationTime: dishData.preparationTime?.toString() || '',
        spiceLevel: dishData.spiceLevel?.toString() || '',
        allergens: dishData.allergens.join(', ')
      });
    } catch (error) {
      notify.error('Erreur lors du chargement du plat.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagesUploaded = (urls: string[]) => {
    setFormData(prev => ({ ...prev, images: urls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = (session?.user as any)?.token;
      const dishData = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined,
        spiceLevel: formData.spiceLevel ? parseInt(formData.spiceLevel) : undefined,
        allergens: formData.allergens.split(',').map(a => a.trim()).filter(a => a)
      };
      await updateDish(id, dishData, token);
      notify.success('Plat mis à jour avec succès.');
      router.push('/admin/dishes');
    } catch (error) {
      notify.error(getErrorMessage(error, "Erreur lors de l'enregistrement du plat."));
      console.error('Error saving dish:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return;
    setIsDeleting(true);
    try {
      const token = (session?.user as any)?.token;
      await deleteDish(id, token);
      notify.success('Plat supprimé avec succès.');
      router.push('/admin/dishes');
    } catch (error) {
      notify.error(getErrorMessage(error, 'Erreur lors de la suppression du plat.'));
      console.error('Error deleting dish:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111111]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        backHref="/admin/dishes"
        breadcrumb="Plats"
        title="Modifier le plat"
        description="Modifier les informations du plat"
        actions={
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {isDeleting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
          ) : (
            <FaTrash />
          )}
          Supprimer
        </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#111111] border-b pb-2">Informations générales</h3>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Nom</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Prix (FCFA)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Catégorie</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#111111] border-b pb-2">Images et détails</h3>
              <MultiImageUpload
                onImagesUploaded={handleImagesUploaded}
                currentImages={formData.images}
                label="Images du plat"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">Temps de préparation (min)</label>
                  <input
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">Niveau de piquant (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.spiceLevel}
                    onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">
                  Allergènes (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-3">Statut</label>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="w-4 h-4 text-[#111111] rounded focus:ring-[#111111]"
                    />
                    <span className="text-sm text-[#111111]">Disponible</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPromoted}
                      onChange={(e) => setFormData({ ...formData, isPromoted: e.target.checked })}
                      className="w-4 h-4 text-[#111111] rounded focus:ring-[#111111]"
                    />
                    <span className="text-sm text-[#111111]">Promu</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 text-[#111111] rounded focus:ring-[#111111]"
                    />
                    <span className="text-sm text-[#111111]">Nouveau</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <Link
              href="/admin/dishes"
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
