'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { deleteMenu, getMenus } from '@/lib/api';
import type { Menu, MenuType } from '@/lib/api';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';

const TYPE_LABELS: Record<keyof MenuType, string> = {
  DAILY: 'Quotidien',
  WEEKLY: 'Hebdomadaire',
  SPECIAL: 'Spécial',
};

const TYPE_COLORS: Record<keyof MenuType, string> = {
  DAILY: 'bg-blue-100 text-blue-700',
  WEEKLY: 'bg-amber-100 text-amber-700',
  SPECIAL: 'bg-purple-100 text-purple-700',
};

function getMenuPeriod(menu: Menu) {
  if (menu.type === 'DAILY' && menu.date) {
    return new Date(menu.date).toLocaleDateString('fr-FR');
  }

  if (menu.type === 'WEEKLY') {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    if (menu.dayOfWeek !== undefined && menu.dayOfWeek !== null) {
      return days[menu.dayOfWeek] || 'Hebdomadaire';
    }
  }

  if (menu.startDate || menu.endDate) {
    const start = menu.startDate ? new Date(menu.startDate).toLocaleDateString('fr-FR') : '...';
    const end = menu.endDate ? new Date(menu.endDate).toLocaleDateString('fr-FR') : '...';
    return `${start} - ${end}`;
  }

  return 'Sans période';
}

export default function MenusPage() {
  const { data: session, status } = useSession();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    void fetchMenus();
  }, [session, status]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const token = (session?.user as any)?.token;
      const data = await getMenus({ includeInactive: true }, token);
      setMenus(data);
    } catch (error) {
      notify.error(getErrorMessage(error, 'Erreur lors du chargement des menus.'));
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce menu ?')) return;

    try {
      setIsDeleting(id);
      const token = (session?.user as any)?.token;
      await deleteMenu(id, token);
      await fetchMenus();
      notify.success('Menu supprimé avec succès.');
    } catch (error) {
      notify.error(getErrorMessage(error, 'Erreur lors de la suppression du menu.'));
      console.error('Error deleting menu:', error);
    } finally {
      setIsDeleting(null);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111111]">Menus</h1>
          <p className="text-[#787774] mt-2">Gérez les menus quotidiens, hebdomadaires et spéciaux</p>
        </div>
        <Link
          href="/admin/menus/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white rounded-lg hover:bg-[#333333] transition-colors"
        >
          <FaPlus />
          Ajouter un menu
        </Link>
      </div>

      {menus.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <h2 className="text-xl font-semibold text-[#111111]">Aucun menu pour le moment</h2>
          <p className="text-[#787774] mt-2 mb-6">Créez votre premier menu pour l’afficher ici.</p>
          <Link
            href="/admin/menus/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111] text-white rounded-lg hover:bg-[#333333] transition-colors"
          >
            <FaPlus />
            Créer un menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              {menu.imageUrl ? (
                <img src={menu.imageUrl} alt={menu.name} className="w-full h-48 object-cover" />
              ) : null}

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-semibold text-[#111111]">{menu.name}</h2>
                      <span className={`px-2.5 py-1 text-xs rounded-full ${TYPE_COLORS[menu.type]}`}>
                        {TYPE_LABELS[menu.type]}
                      </span>
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full ${
                          menu.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {menu.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <p className="text-[#787774] mt-2">{menu.description || 'Aucune description'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/menus/${menu.id}`}
                      className="p-2 text-[#787774] hover:text-[#111111] hover:bg-[#F7F6F3] rounded-lg transition-colors"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      href={`/admin/menus/${menu.id}/edit`}
                      className="p-2 text-[#787774] hover:text-[#111111] hover:bg-[#F7F6F3] rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        void handleDelete(menu.id);
                      }}
                      disabled={isDeleting === menu.id}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isDeleting === menu.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-[#F7F6F3] rounded-lg p-4">
                    <p className="text-[#787774]">Période</p>
                    <p className="font-medium text-[#111111] mt-1">{getMenuPeriod(menu)}</p>
                  </div>
                  <div className="bg-[#F7F6F3] rounded-lg p-4">
                    <p className="text-[#787774]">Nombre de plats</p>
                    <p className="font-medium text-[#111111] mt-1">{menu.menuItems?.length || 0}</p>
                  </div>
                </div>

                {menu.menuItems && menu.menuItems.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[#111111]">Plats inclus</p>
                    <div className="flex flex-wrap gap-2">
                      {menu.menuItems.map((item) => (
                        <span
                          key={item.id}
                          className="px-3 py-1.5 bg-[#F7F6F3] text-[#111111] text-sm rounded-full"
                        >
                          {item.dish?.name || 'Plat'}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
