'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaEdit, FaUtensils } from 'react-icons/fa';
import { getCategory, getDishes } from '@/lib/api';
import type { Category, Dish } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { getErrorMessage } from '@/lib/api-error';
import { notify } from '@/lib/toast';

export default function CategoryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [categoryData, dishesData] = await Promise.all([
          getCategory(id),
          getDishes({ categoryId: id }),
        ]);
        setCategory(categoryData);
        setDishes(dishesData);
      } catch (error) {
        notify.error(getErrorMessage(error, 'Erreur lors du chargement de la catégorie.'));
        console.error('Error fetching category detail:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111111]"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-[#787774]">Catégorie introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        backHref="/admin/categories"
        breadcrumb="Catégories"
        title={category.name}
        description={category.description || 'Détail de la catégorie'}
        meta={[
          <span key="dishes" className="px-3 py-1 text-xs rounded-full bg-[#111111] text-white">
            {dishes.length} plat{dishes.length > 1 ? 's' : ''}
          </span>,
          <span
            key="status"
            className={`px-3 py-1 text-xs rounded-full ${
              category.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {category.isActive ? 'Active' : 'Inactive'}
          </span>,
          <span key="order" className="px-3 py-1 text-xs rounded-full bg-[#F7F6F3] text-[#111111]">
            Ordre {category.order ?? 0}
          </span>,
        ]}
        actions={
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white rounded-lg hover:bg-[#333333] transition-colors"
          >
            <FaEdit />
            Modifier
          </Link>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
          {category.imageUrl ? (
            <img src={category.imageUrl} alt={category.name} className="w-full h-72 object-cover" />
          ) : (
            <div className="h-72 bg-[#F7F6F3] flex items-center justify-center text-[#787774]">
              Aucune image
            </div>
          )}
          <div className="p-6 space-y-3">
            <div>
              <p className="text-sm text-[#787774]">Créée le</p>
              <p className="font-medium text-[#111111]">
                {new Date(category.createdAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#787774]">Dernière mise à jour</p>
              <p className="font-medium text-[#111111]">
                {new Date(category.updatedAt).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#111111]">Plats de cette catégorie</h2>
            <span className="text-sm text-[#787774]">{dishes.length} plat{dishes.length > 1 ? 's' : ''}</span>
          </div>

          {dishes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dishes.map((dish) => (
                <Link
                  key={dish.id}
                  href={`/admin/dishes/${dish.id}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#111111] transition-colors"
                >
                  {dish.images[0] ? (
                    <img src={dish.images[0]} alt={dish.name} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-[#F7F6F3] flex items-center justify-center text-[#787774]">
                      <FaUtensils />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-[#111111] truncate">{dish.name}</p>
                    <p className="text-sm text-[#787774] truncate">{dish.description || 'Sans description'}</p>
                    <p className="text-sm font-medium text-[#111111] mt-1">{dish.price} FCFA</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-[#787774]">
              Aucun plat dans cette catégorie
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
