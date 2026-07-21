'use client';

import React, { useEffect, useState } from 'react';
import { createMenu, getDishes } from '@/lib/api';
import type { Dish, MenuPayload } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MenuForm, { createEmptyMenuFormValues, type MenuFormValues } from '@/components/admin/MenuForm';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';

export default function NewMenuPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [values, setValues] = useState<MenuFormValues>(createEmptyMenuFormValues());
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchDishes() {
      try {
        setLoading(true);
        const data = await getDishes();
        setDishes(data);
      } catch (error) {
        notify.error('Erreur lors du chargement des plats.');
        console.error('Error fetching dishes:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchDishes();
  }, []);

  const handleSubmit = async (payload: MenuPayload) => {
    try {
      setIsSaving(true);
      const token = (session?.user as any)?.token;
      await createMenu(payload, token);
      notify.success('Menu créé avec succès.');
      router.push('/admin/menus');
    } catch (error) {
      notify.error(getErrorMessage(error, "Erreur lors de l'enregistrement du menu."));
      console.error('Error saving menu:', error);
    } finally {
      setIsSaving(false);
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
    <MenuForm
      title="Ajouter un menu"
      description="Créez un menu quotidien, hebdomadaire ou spécial"
      backHref="/admin/menus"
      dishes={dishes}
      values={values}
      onChange={setValues}
      onSubmit={handleSubmit}
      isSaving={isSaving}
    />
  );
}
