'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaEdit, FaTrash, FaClipboardList } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { deleteMenu, getMenu } from '@/lib/api';
import type { Menu } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';

const TYPE_LABELS = {
  DAILY: 'Quotidien',
  WEEKLY: 'Hebdomadaire',
  SPECIAL: 'Spécial',
} as const;

export default function MenuDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = (session?.user as any)?.token;
        const data = await getMenu(id, token);
        setMenu(data);
      } catch (error) {
        notify.error(getErrorMessage(error, 'Erreur lors du chargement du menu.'));
        console.error('Error fetching menu detail:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      void fetchData();
    }
  }, [id, session]);

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce menu ?')) return;

    try {
      setIsDeleting(true);
      const token = (session?.user as any)?.token;
      await deleteMenu(id, token);
      notify.success('Menu supprimé avec succès.');
      router.push('/admin/menus');
    } catch (error) {
      notify.error(getErrorMessage(error, 'Erreur lors de la suppression du menu.'));
      console.error('Error deleting menu:', error);
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

  if (!menu) {
    return (
      <div className="text-center py-12">
        <p className="text-[#787774]">Menu introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        backHref="/admin/menus"
        breadcrumb="Menus"
        title={menu.name}
        description={menu.description || 'Détail du menu'}
        meta={[
          <span key="type" className="px-3 py-1 text-xs rounded-full bg-[#111111] text-white">
            {TYPE_LABELS[menu.type]}
          </span>,
          <span
            key="status"
            className={`px-3 py-1 text-xs rounded-full ${
              menu.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {menu.isActive ? 'Actif' : 'Inactif'}
          </span>,
          <span key="items" className="px-3 py-1 text-xs rounded-full bg-[#F7F6F3] text-[#111111]">
            {menu.menuItems?.length || 0} plat{menu.menuItems && menu.menuItems.length > 1 ? 's' : ''}
          </span>,
        ]}
        actions={
          <>
            <Link
              href={`/admin/menus/${menu.id}/edit`}
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
          {menu.imageUrl ? (
            <img src={menu.imageUrl} alt={menu.name} className="w-full h-72 object-cover" />
          ) : (
            <div className="h-72 bg-[#F7F6F3] flex items-center justify-center text-[#787774]">
              <FaClipboardList className="text-3xl" />
            </div>
          )}
          <div className="p-6 space-y-3">
            <div>
              <p className="text-sm text-[#787774]">Période</p>
              <p className="font-medium text-[#111111]">
                {menu.date ? new Date(menu.date).toLocaleDateString('fr-FR') : '—'}
              </p>
            </div>
            {menu.startDate || menu.endDate ? (
              <div>
                <p className="text-sm text-[#787774]">Plage</p>
                <p className="font-medium text-[#111111]">
                  {menu.startDate ? new Date(menu.startDate).toLocaleDateString('fr-FR') : '—'} -{' '}
                  {menu.endDate ? new Date(menu.endDate).toLocaleDateString('fr-FR') : '—'}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#111111]">Plats du menu</h2>
            <span className="text-sm text-[#787774]">{menu.menuItems?.length || 0} plat{menu.menuItems && menu.menuItems.length > 1 ? 's' : ''}</span>
          </div>

          {menu.menuItems && menu.menuItems.length > 0 ? (
            <div className="space-y-4">
              {menu.menuItems.map((item) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#111111]">{item.dish?.name || 'Plat'}</p>
                      <p className="text-sm text-[#787774]">{item.dish?.description || 'Sans description'}</p>
                    </div>
                    <Link
                      href={`/admin/dishes/${item.dishId}`}
                      className="text-sm text-[#111111] hover:underline"
                    >
                      Voir le plat
                    </Link>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-[#F7F6F3] rounded-lg p-3">
                      <p className="text-[#787774]">Prix</p>
                      <p className="font-medium text-[#111111]">
                        {item.price ? `${item.price} FCFA` : '—'}
                      </p>
                    </div>
                    <div className="bg-[#F7F6F3] rounded-lg p-3">
                      <p className="text-[#787774]">Quantité</p>
                      <p className="font-medium text-[#111111]">{item.quantity ?? '—'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-10 text-center text-[#787774]">
              Aucun plat associé
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
