'use client';
import React, { useState, useEffect } from 'react';
import { getGalleryItem, updateGalleryItem, deleteGalleryItem } from '@/lib/api';
import type { GalleryItem } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import ImageUpload from '@/components/admin/ImageUpload';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

export default function EditGalleryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    category: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const data = await getGalleryItem(id);
      setItem(data);
      setFormData({
        imageUrl: data.imageUrl,
        title: data.title || '',
        category: data.category || ''
      });
    } catch (error) {
      notify.error(getErrorMessage(error, "Erreur lors du chargement de l'image."));
      console.error('Error fetching gallery item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = (session?.user as any)?.token;
      await updateGalleryItem(id, formData, token);
      notify.success('Image mise à jour avec succès.');
      router.push('/admin/gallery');
    } catch (error) {
      notify.error(getErrorMessage(error, "Erreur lors de l'enregistrement de l'image."));
      console.error('Error saving gallery item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    setIsDeleting(true);
    try {
      const token = (session?.user as any)?.token;
      await deleteGalleryItem(id, token);
      notify.success('Image supprimée avec succès.');
      router.push('/admin/gallery');
    } catch (error) {
      notify.error(getErrorMessage(error, "Erreur lors de la suppression de l'image."));
      console.error('Error deleting gallery item:', error);
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
        backHref="/admin/gallery"
        breadcrumb="Galerie"
        title="Modifier l'image"
        description="Modifier les informations de l'image"
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
              <h3 className="text-lg font-semibold text-[#111111] border-b pb-2">Image</h3>
              <ImageUpload
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
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
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Catégorie</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
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
