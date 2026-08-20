'use client';
import React, { useState, useEffect } from 'react';
import { getDishes, getCategories, deleteDish } from '@/lib/api';
import type { Dish, Category } from '@/lib/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';
import Pagination from '@/components/admin/Pagination';

const ITEMS_PER_PAGE = 10;

export default function DishesPage() {
  const { data: session } = useSession();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dishesData, categoriesData] = await Promise.all([
        getDishes(),
        getCategories()
      ]);
      setDishes(dishesData);
      setCategories(categoriesData);
    } catch (error) {
      notify.error('Erreur lors du chargement des plats.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return;
    setIsDeleting(id);
    try {
      const token = (session?.user as any)?.token;
      await deleteDish(id, token);
      await fetchData();
      notify.success('Plat supprimé avec succès.');
    } catch (error) {
      notify.error(getErrorMessage(error, 'Erreur lors de la suppression du plat.'));
      console.error('Error deleting dish:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || '-';
  };

  // Pagination logic
  const totalPages = Math.ceil(dishes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDishes = dishes.slice(startIndex, endIndex);

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
          <h1 className="text-3xl font-bold text-[#111111]">Plats</h1>
          <p className="text-[#787774] mt-2">Gérez les plats du menu</p>
        </div>
        <Link
          href="/admin/dishes/new"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#111111] px-4 py-2 text-white transition-colors hover:bg-[#333333] sm:w-auto"
        >
          <FaPlus />
          Ajouter un plat
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="divide-y divide-gray-100 md:hidden">
          {paginatedDishes.map((dish) => (
            <article key={dish.id} className="space-y-4 p-5">
              <div className="flex items-start gap-4">
                {dish.images[0] ? (
                  <img
                    src={dish.images[0]}
                    alt={dish.name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-xl bg-[#F7F6F3]" />
                )}
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold leading-6 text-[#111111]">{dish.name}</h2>
                  <p className="mt-1 text-sm leading-5 text-[#787774]">{dish.description || 'Aucune description'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#9a9995]">Catégorie</p>
                  <p className="mt-1 text-[#787774]">{getCategoryName(dish.categoryId)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#9a9995]">Prix</p>
                  <p className="mt-1 font-semibold text-[#111111]">{dish.price} FCFA</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                <div className="flex flex-wrap gap-2">
                  {dish.isAvailable && <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">Disponible</span>}
                  {dish.isPromoted && <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-700">Promu</span>}
                  {dish.isNew && <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">Nouveau</span>}
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/dishes/${dish.id}`}
                    aria-label={`Voir ${dish.name}`}
                    className="rounded-lg p-2 text-[#787774] transition-colors hover:bg-[#F7F6F3] hover:text-[#111111]"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    href={`/admin/dishes/${dish.id}/edit`}
                    aria-label={`Modifier ${dish.name}`}
                    className="rounded-lg p-2 text-[#787774] transition-colors hover:bg-[#F7F6F3] hover:text-[#111111]"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    type="button"
                    aria-label={`Supprimer ${dish.name}`}
                    onClick={() => handleDelete(dish.id)}
                    disabled={isDeleting === dish.id}
                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  >
                    {isDeleting === dish.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-red-500" />
                    ) : (
                      <FaTrash />
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead className="bg-[#F7F6F3]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Plat</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Catégorie</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Prix</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Statut</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-[#787774]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedDishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-[#F7F6F3] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {dish.images[0] && (
                        <img
                          src={dish.images[0]}
                          alt={dish.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium text-[#111111]">{dish.name}</div>
                        <div className="text-sm text-[#787774]">{dish.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#787774]">
                    {getCategoryName(dish.categoryId)}
                  </td>
                  <td className="px-6 py-4 font-medium text-[#111111]">
                    {dish.price} FCFA
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {dish.isAvailable && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Disponible</span>
                      )}
                      {dish.isPromoted && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Promu</span>
                      )}
                      {dish.isNew && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Nouveau</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/dishes/${dish.id}`}
                        className="p-2 text-[#787774] hover:text-[#111111] hover:bg-[#F7F6F3] rounded-lg transition-colors"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        href={`/admin/dishes/${dish.id}/edit`}
                        className="p-2 text-[#787774] hover:text-[#111111] hover:bg-[#F7F6F3] rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(dish.id)}
                        disabled={isDeleting === dish.id}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isDeleting === dish.id ? (
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
