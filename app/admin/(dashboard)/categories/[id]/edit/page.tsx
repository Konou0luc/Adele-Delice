'use client';
import React, { useState, useEffect } from 'react';
import { getCategory, updateCategory, deleteCategory } from '@/lib/api';
import type { Category } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import ImageUpload from '@/components/admin/ImageUpload';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function EditCategoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const data = await getCategory(id);
      setCategory(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        imageUrl: data.imageUrl || ''
      });
    } catch (error) {
      notify.error(getErrorMessage(error, 'Erreur lors du chargement de la catégorie.'));
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = (session?.user as any)?.token;
      await updateCategory(id, formData, token);
      notify.success('Catégorie mise à jour avec succès.');
      router.push('/admin/categories');
    } catch (error) {
      notify.error(getErrorMessage(error, "Erreur lors de l'enregistrement de la catégorie."));
      console.error('Error saving category:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    setIsDeleting(true);
    try {
      const token = (session?.user as any)?.token;
      await deleteCategory(id, token);
      notify.success('Catégorie supprimée avec succès.');
      router.push('/admin/categories');
    } catch (error) {
      notify.error(getErrorMessage(error, 'Erreur lors de la suppression de la catégorie.'));
      console.error('Error deleting category:', error);
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
        backHref="/admin/categories"
        breadcrumb="Catégories"
        title="Modifier la catégorie"
        description="Modifier les informations de la catégorie"
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
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
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
