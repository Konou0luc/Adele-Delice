'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaUtensils } from 'react-icons/fa';
import { deleteDish, getCategory, getDish } from '@/lib/api';
import type { Category, Dish } from '@/lib/api';
import { useSession } from 'next-auth/react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';

export default function DishDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [dish, setDish] = useState<Dish | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const dishData = await getDish(id);
        setDish(dishData);
        const categoryData = await getCategory(dishData.categoryId);
        setCategory(categoryData);
      } catch (error) {
        notify.error(getErrorMessage(error, 'Erreur lors du chargement du plat.'));
        console.error('Error fetching dish detail:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) return;

    try {
      setIsDeleting(true);
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

  if (!dish) {
    return (
      <div className="text-center py-12">
        <p className="text-[#787774]">Plat introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        backHref="/admin/dishes"
        breadcrumb="Plats"
        title={dish.name}
        description={dish.description || 'Détail du plat'}
        meta={[
          <span
            key="status"
            className={`px-3 py-1 text-xs rounded-full ${
              dish.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {dish.isAvailable ? 'Disponible' : 'Indisponible'}
          </span>,
          <span key="images" className="px-3 py-1 text-xs rounded-full bg-[#F7F6F3] text-[#111111]">
            {dish.images.length} image{dish.images.length > 1 ? 's' : ''}
          </span>,
          <span key="category" className="px-3 py-1 text-xs rounded-full bg-[#111111] text-white">
            {category?.name || 'Catégorie'}
          </span>,
        ]}
        actions={
          <>
            <Link
              href={`/admin/dishes/${dish.id}/edit`}
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
        <div className="xl:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
          {dish.images.length > 0 ? (
            <div className="grid gap-2 p-4">
              <img src={dish.images[0]} alt={dish.name} className="w-full h-72 object-cover rounded-xl" />
              {dish.images.length > 1 ? (
                <div className="grid grid-cols-3 gap-2">
                  {dish.images.slice(1, 4).map((image) => (
                    <img key={image} src={image} alt={dish.name} className="h-24 w-full object-cover rounded-lg" />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="h-72 bg-[#F7F6F3] flex items-center justify-center text-[#787774]">
              <FaUtensils className="text-3xl" />
            </div>
          )}
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {dish.isPromoted ? (
                <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Promu</span>
              ) : null}
              {dish.isNew ? (
                <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Nouveau</span>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#F7F6F3] p-4">
                <p className="text-sm text-[#787774]">Prix</p>
                <p className="text-2xl font-bold text-[#111111]">{dish.price} FCFA</p>
              </div>
              <div className="rounded-xl bg-[#F7F6F3] p-4">
                <p className="text-sm text-[#787774]">Catégorie</p>
                <p className="font-semibold text-[#111111]">{category?.name || 'Non définie'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#787774]">Temps de préparation</p>
                <p className="font-medium text-[#111111]">{dish.preparationTime || '-'} min</p>
              </div>
              <div>
                <p className="text-sm text-[#787774]">Niveau de piquant</p>
                <p className="font-medium text-[#111111]">{dish.spiceLevel || '-'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-[#787774]">Allergènes</p>
              <p className="font-medium text-[#111111]">{dish.allergens.length > 0 ? dish.allergens.join(', ') : '-'}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-[#787774] mb-2">Description</p>
            <p className="text-[#111111] leading-7">{dish.description || 'Aucune description'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
