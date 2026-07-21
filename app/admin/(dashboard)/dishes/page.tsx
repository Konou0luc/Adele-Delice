'use client';
import React, { useState, useEffect } from 'react';
import { getDishes, getCategories, deleteDish } from '@/lib/api';
import type { Dish, Category } from '@/lib/api';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function DishesPage() {
  const { data: session } = useSession();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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
      fetchData();
    } catch (error) {
      console.error('Error deleting dish:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || '-';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111111]">Plats</h1>
          <p className="text-[#787774] mt-2">Gérez les plats du menu</p>
        </div>
        <Link
          href="/admin/dishes/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white rounded-lg hover:bg-[#333333] transition-colors"
        >
          <FaPlus />
          Ajouter un plat
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
              {dishes.map((dish) => (
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
      </div>
    </div>
  );
}
