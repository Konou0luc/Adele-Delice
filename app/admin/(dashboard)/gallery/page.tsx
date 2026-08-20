'use client';
import React, { useState, useEffect } from 'react';
import { getGalleryItems, deleteGalleryItem } from '@/lib/api';
import type { GalleryItem } from '@/lib/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';
import Pagination from '@/components/admin/Pagination';

const ITEMS_PER_PAGE = 12;

export default function GalleryPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const data = await getGalleryItems();
      setItems(data.sort((a, b) => (b.order || 0) - (a.order || 0)));
    } catch (error) {
      notify.error('Erreur lors du chargement de la galerie.');
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;
    setIsDeleting(id);
    try {
      const token = (session?.user as any)?.token;
      await deleteGalleryItem(id, token);
      await fetchGalleryItems();
      notify.success('Image supprimée avec succès.');
    } catch (error) {
      notify.error(getErrorMessage(error, "Erreur lors de la suppression de l'image."));
      console.error('Error deleting gallery item:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111111]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111111]">Galerie</h1>
          <p className="text-[#787774] mt-2">Gérez les images de la galerie</p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#111111] px-4 py-2 text-white transition-colors hover:bg-[#333333] sm:w-auto"
        >
          <FaPlus />
          Ajouter une image
        </Link>
      </div>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div className="relative aspect-square">
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Galerie'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link
                    href={`/admin/gallery/${item.id}`}
                    className="p-2 bg-white text-[#111111] rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    href={`/admin/gallery/${item.id}/edit`}
                    className="p-2 bg-white text-[#111111] rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting === item.id}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isDeleting === item.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4">
                {item.title && <p className="font-medium text-[#111111]">{item.title}</p>}
                {item.category && <p className="text-sm text-[#787774]">{item.category}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-white shadow-sm">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}
