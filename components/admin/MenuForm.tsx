'use client';

import React from 'react';
import Link from 'next/link';
import { FaPlus, FaTrash } from 'react-icons/fa';
import type { Dish, MenuPayload, MenuType } from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminPageHeader from './AdminPageHeader';

const WEEK_DAYS = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
];

export interface MenuFormValues {
  name: string;
  description: string;
  type: keyof MenuType;
  date: string;
  dayOfWeek: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  isActive: boolean;
  menuItems: {
    dishId: string;
    price: string;
    quantity: string;
  }[];
}

interface MenuFormProps {
  title: string;
  description: string;
  backHref: string;
  dishes: Dish[];
  values: MenuFormValues;
  isSaving: boolean;
  isDeleting?: boolean;
  onChange: (values: MenuFormValues) => void;
  onSubmit: (payload: MenuPayload) => Promise<void>;
  onDelete?: () => Promise<void>;
}

function buildPayload(values: MenuFormValues): MenuPayload {
  return {
    name: values.name,
    description: values.description || undefined,
    type: values.type,
    date: values.date || undefined,
    dayOfWeek: values.dayOfWeek === '' ? undefined : Number(values.dayOfWeek),
    startDate: values.startDate || undefined,
    endDate: values.endDate || undefined,
    imageUrl: values.imageUrl || undefined,
    isActive: values.isActive,
    menuItems: values.menuItems
      .filter((item) => item.dishId)
      .map((item) => ({
        dishId: item.dishId,
        price: item.price === '' ? undefined : Number(item.price),
        quantity: item.quantity === '' ? undefined : Number(item.quantity),
      })),
  };
}

export function createEmptyMenuFormValues(): MenuFormValues {
  return {
    name: '',
    description: '',
    type: 'DAILY',
    date: '',
    dayOfWeek: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    isActive: true,
    menuItems: [{ dishId: '', price: '', quantity: '' }],
  };
}

export function getMenuFormValues(menu?: {
  name?: string;
  description?: string;
  type?: keyof MenuType;
  date?: string;
  dayOfWeek?: number;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  isActive?: boolean;
  menuItems?: {
    dishId: string;
    price?: number | null;
    quantity?: number | null;
  }[];
}) {
  const initialValues = createEmptyMenuFormValues();

  if (!menu) {
    return initialValues;
  }

  return {
    ...initialValues,
    name: menu.name || '',
    description: menu.description || '',
    type: menu.type || 'DAILY',
    date: menu.date ? menu.date.slice(0, 10) : '',
    dayOfWeek: menu.dayOfWeek === undefined || menu.dayOfWeek === null ? '' : String(menu.dayOfWeek),
    startDate: menu.startDate ? menu.startDate.slice(0, 10) : '',
    endDate: menu.endDate ? menu.endDate.slice(0, 10) : '',
    imageUrl: menu.imageUrl || '',
    isActive: menu.isActive ?? true,
    menuItems:
      menu.menuItems && menu.menuItems.length > 0
        ? menu.menuItems.map((item) => ({
            dishId: item.dishId,
            price: item.price === undefined || item.price === null ? '' : String(item.price),
            quantity:
              item.quantity === undefined || item.quantity === null ? '' : String(item.quantity),
          }))
        : initialValues.menuItems,
  };
}

export default function MenuForm({
  title,
  description,
  backHref,
  dishes,
  values,
  isSaving,
  isDeleting = false,
  onChange,
  onSubmit,
  onDelete,
}: MenuFormProps) {
  const updateItem = (
    index: number,
    field: keyof MenuFormValues['menuItems'][number],
    value: string
  ) => {
    const nextItems = [...values.menuItems];
    nextItems[index] = { ...nextItems[index], [field]: value };
    onChange({ ...values, menuItems: nextItems });
  };

  const addItem = () => {
    onChange({
      ...values,
      menuItems: [...values.menuItems, { dishId: '', price: '', quantity: '' }],
    });
  };

  const removeItem = (index: number) => {
    const nextItems = values.menuItems.filter((_, itemIndex) => itemIndex !== index);
    onChange({
      ...values,
      menuItems: nextItems.length > 0 ? nextItems : [{ dishId: '', price: '', quantity: '' }],
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(buildPayload(values));
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={title}
        description={description}
        backHref={backHref}
        actions={
          onDelete ? (
            <button
              type="button"
              onClick={() => {
                void onDelete();
              }}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <FaTrash />
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
          ) : undefined
        }
      />

      <div className="bg-white rounded-xl shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#111111] border-b pb-2">
                Informations du menu
              </h3>

              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Nom</label>
                <input
                  type="text"
                  required
                  value={values.name}
                  onChange={(event) => onChange({ ...values, name: event.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                  placeholder="Ex: Menu du jour"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Description</label>
                <textarea
                  value={values.description}
                  onChange={(event) => onChange({ ...values, description: event.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Description du menu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111111] mb-2">Type</label>
                <select
                  value={values.type}
                  onChange={(event) =>
                    onChange({
                      ...values,
                      type: event.target.value as keyof MenuType,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                >
                  <option value="DAILY">Quotidien</option>
                  <option value="WEEKLY">Hebdomadaire</option>
                  <option value="SPECIAL">Spécial</option>
                </select>
              </div>

              {values.type === 'DAILY' ? (
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">Date</label>
                  <input
                    type="date"
                    value={values.date}
                    onChange={(event) => onChange({ ...values, date: event.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                  />
                </div>
              ) : null}

              {values.type === 'WEEKLY' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">Jour de la semaine</label>
                    <select
                      value={values.dayOfWeek}
                      onChange={(event) => onChange({ ...values, dayOfWeek: event.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Sélectionnez un jour</option>
                      {WEEK_DAYS.map((day, index) => (
                        <option key={day} value={String(index)}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Date de début
                      </label>
                      <input
                        type="date"
                        value={values.startDate}
                        onChange={(event) => onChange({ ...values, startDate: event.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111111] mb-2">
                        Date de fin
                      </label>
                      <input
                        type="date"
                        value={values.endDate}
                        onChange={(event) => onChange({ ...values, endDate: event.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </>
              ) : null}

              {values.type === 'SPECIAL' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={values.startDate}
                      onChange={(event) => onChange({ ...values, startDate: event.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={values.endDate}
                      onChange={(event) => onChange({ ...values, endDate: event.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              ) : null}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.isActive}
                  onChange={(event) => onChange({ ...values, isActive: event.target.checked })}
                  className="w-4 h-4 text-[#111111] rounded focus:ring-[#111111]"
                />
                <span className="text-sm text-[#111111]">Menu actif</span>
              </label>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#111111] border-b pb-2">Image</h3>
              <ImageUpload
                onImageUploaded={(url) => onChange({ ...values, imageUrl: url })}
                currentImage={values.imageUrl}
                label="Image du menu"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-[#111111]">Plats du menu</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-[#111111] text-white rounded-lg hover:bg-[#333333] transition-colors"
              >
                <FaPlus />
                Ajouter un plat
              </button>
            </div>

            <div className="space-y-4">
              {values.menuItems.map((item, index) => (
                <div
                  key={`${item.dishId}-${index}`}
                  className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr_1fr_auto] gap-4 items-end p-4 border border-gray-200 rounded-xl"
                >
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">Plat</label>
                    <select
                      value={item.dishId}
                      onChange={(event) => updateItem(index, 'dishId', event.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Sélectionnez un plat</option>
                      {dishes.map((dish) => (
                        <option key={dish.id} value={dish.id}>
                          {dish.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">Prix</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(event) => updateItem(index, 'price', event.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                      placeholder="Optionnel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-2">Quantité</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
                      placeholder="Optionnel"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="h-[50px] px-4 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Supprimer ce plat"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Link
              href={backHref}
              className="flex-1 px-4 py-3 border border-gray-200 text-[#111111] rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-[#111111] text-white rounded-lg hover:bg-[#333333] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
