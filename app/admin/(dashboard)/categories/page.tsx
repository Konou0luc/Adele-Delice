'use client';
import React, { useState, useEffect } from 'react';
import { getCategories, deleteCategory } from '@/lib/api';
import type { Category } from '@/lib/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';
import Pagination from '@/components/admin/Pagination';

const ITEMS_PER_PAGE = 10;

export default function CategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      notify.error('Erreur lors du chargement des catégories.');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    setIsDeleting(id);
    const toastId = notify.loading("Suppression de la catégorie...");
    try {
      const token = (session?.user as any)?.token;
      await deleteCategory(id, token);
      await fetchCategories();
      notify.success("Catégorie supprimée avec succès.");
      notify.dismiss(toastId);
    } catch (error) {
      notify.error(getErrorMessage(error));
      notify.dismiss(toastId);
      console.error('Error deleting category:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCategories = categories.slice(startIndex, endIndex);

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
          <h1 className="text-3xl font-bold text-[#111111]">Catégories</h1>
          <p className="text-[#787774] mt-2">Gérez les catégories de plats</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#111111] px-4 py-2 text-white transition-colors hover:bg-[#333333] sm:w-auto"
        >
          <FaPlus />
          Ajouter une catégorie
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F6F3]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Nom</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Description</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Statut</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-[#787774]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedCategories.map((category) => (
                <tr key={category.id} className="hover:bg-[#F7F6F3] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {category.imageUrl && (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <span className="font-medium text-[#111111]">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#787774]">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${category.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="p-2 text-[#787774] hover:text-[#111111] hover:bg-[#F7F6F3] rounded-lg transition-colors"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="p-2 text-[#787774] hover:text-[#111111] hover:bg-[#F7F6F3] rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting === category.id}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isDeleting === category.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
