'use client';

import React, { useEffect, useState } from 'react';
import { deleteMenu, getDishes, getMenu, updateMenu } from '@/lib/api';
import type { Dish, Menu, MenuPayload } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import MenuForm, { getMenuFormValues, type MenuFormValues } from '@/components/admin/MenuForm';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';

export default function EditMenuPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [values, setValues] = useState<MenuFormValues>(getMenuFormValues());
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = (session?.user as any)?.token;
        const [menuData, dishesData] = await Promise.all([
          getMenu(id, token),
          getDishes(),
        ]);
        setMenu(menuData);
        setDishes(dishesData);
        setValues(getMenuFormValues(menuData));
      } catch (error) {
        notify.error(getErrorMessage(error, 'Erreur lors du chargement du menu.'));
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      void fetchData();
    }
  }, [id, session, status]);

  const handleSubmit = async (payload: MenuPayload) => {
    try {
      setIsSaving(true);
      const token = (session?.user as any)?.token;
      await updateMenu(id, payload, token);
      notify.success('Menu mis à jour avec succès.');
      router.push('/admin/menus');
    } catch (error) {
      notify.error(getErrorMessage(error, "Erreur lors de l'enregistrement du menu."));
      console.error('Error saving menu:', error);
    } finally {
      setIsSaving(false);
    }
  };

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
    <MenuForm
      title="Modifier le menu"
      description="Mettez à jour les informations et les plats du menu"
      backHref="/admin/menus"
      dishes={dishes}
      values={values}
      onChange={setValues}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      isSaving={isSaving}
      isDeleting={isDeleting}
    />
  );
}
