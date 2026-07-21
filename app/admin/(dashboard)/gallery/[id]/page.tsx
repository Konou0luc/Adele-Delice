'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { deleteGalleryItem, getGalleryItem } from '@/lib/api';
import type { GalleryItem } from '@/lib/api';
import { useSession } from 'next-auth/react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';

export default function GalleryDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getGalleryItem(id);
        setItem(data);
      } catch (error) {
        notify.error(getErrorMessage(error, 'Erreur lors du chargement de l’image.'));
        console.error('Error fetching gallery item detail:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

    try {
      setIsDeleting(true);
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

  if (!item) {
    return (
      <div className="text-center py-12">
        <p className="text-[#787774]">Image introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        backHref="/admin/gallery"
        breadcrumb="Galerie"
        title={item.title || 'Image de galerie'}
        description={item.category || 'Détail de l’image'}
        meta={[
          <span
            key="status"
            className={`px-3 py-1 text-xs rounded-full ${
              item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {item.isActive ? 'Active' : 'Inactive'}
          </span>,
          <span key="order" className="px-3 py-1 text-xs rounded-full bg-[#F7F6F3] text-[#111111]">
            Ordre {item.order ?? 0}
          </span>,
        ]}
        actions={
          <>
            <Link
              href={`/admin/gallery/${item.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white rounded-lg hover:bg-[#333333] transition-colors"
            >
              <FaEdit />
              Modifier
            </Link>
            <button
              type="button"
              onClick={() => {
                void handleDelete();
              }}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <FaTrash />
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <img src={item.imageUrl} alt={item.title || 'Galerie'} className="w-full h-[28rem] object-cover" />
        </div>

        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
            <div>
              <p className="text-sm text-[#787774]">Catégorie</p>
              <p className="font-medium text-[#111111]">{item.category || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-[#787774]">Activée</p>
              <p className="font-medium text-[#111111]">{item.isActive ? 'Oui' : 'Non'}</p>
            </div>
            <div>
              <p className="text-sm text-[#787774]">Ordre</p>
              <p className="font-medium text-[#111111]">{item.order ?? 0}</p>
            </div>
            <div>
              <p className="text-sm text-[#787774]">Créée le</p>
              <p className="font-medium text-[#111111]">
                {new Date(item.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center text-[#787774]">
            <FaImage className="mx-auto text-2xl mb-2" />
            {item.title || 'Aucun titre'}
          </div>
        </div>
      </div>
    </div>
  );
}
