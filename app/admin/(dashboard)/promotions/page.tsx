'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { getPromotions, createPromotion, updatePromotion, deletePromotion, getDishes, type Promotion, type Dish } from '@/lib/api';
import { toast } from 'sonner';
import { FaPlus, FaTrash, FaPen, FaPercent } from 'react-icons/fa6';

export default function AdminPromotionsPage() {
  const { data: session } = useSession();
  const token = (session?.user as { token?: string } | undefined)?.token;

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    percentage: '',
    fixedAmount: '',
    startDate: '',
    endDate: '',
    dishId: '',
    isActive: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [promosData, dishesData] = await Promise.all([
        getPromotions(token),
        getDishes(),
      ]);
      setPromotions(promosData || []);
      setDishes(dishesData || []);
    } catch {
      toast.error('Erreur lors du chargement des promotions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingPromo(null);
    const today = new Date().toISOString().split('T')[0];
    setForm({
      name: '',
      description: '',
      percentage: '10',
      fixedAmount: '',
      startDate: today,
      endDate: today,
      dishId: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setForm({
      name: promo.name,
      description: promo.description || '',
      percentage: promo.percentage ? String(promo.percentage) : '',
      fixedAmount: promo.fixedAmount ? String(promo.fixedAmount) : '',
      startDate: promo.startDate ? promo.startDate.split('T')[0] : '',
      endDate: promo.endDate ? promo.endDate.split('T')[0] : '',
      dishId: promo.dishId || '',
      isActive: promo.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Veuillez renseigner le nom de la promotion');
      return;
    }

    const payload: Partial<Promotion> = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      percentage: form.percentage ? Number(form.percentage) : undefined,
      fixedAmount: form.fixedAmount ? Number(form.fixedAmount) : undefined,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      dishId: form.dishId || undefined,
      isActive: form.isActive,
    };

    try {
      if (editingPromo) {
        await updatePromotion(editingPromo.id, payload, token);
        toast.success('Promotion mise à jour');
      } else {
        await createPromotion(payload, token);
        toast.success('Promotion créée avec succès');
      }
      setShowModal(false);
      loadData();
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deletePromotion(deleteTargetId, token);
      toast.success('Promotion supprimée');
      setPromotions((prev) => prev.filter((p) => p.id !== deleteTargetId));
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AdminPageHeader
          title="Gestion des Promotions"
          description="Créez et gérez des réductions en pourcentage ou montants fixes."
        />
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white hover:bg-[#333333] transition-colors"
        >
          <FaPlus className="h-4 w-4" /> Nouvelle Promotion
        </button>
      </div>

      <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-[#787774]">Chargement...</div>
        ) : promotions.length === 0 ? (
          <div className="py-12 text-center text-[#787774]">Aucune promotion active pour le moment.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {promotions.map((promo) => {
              const linkedDish = dishes.find((d) => d.id === promo.dishId);
              return (
                <div key={promo.id} className="flex flex-col justify-between rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA] p-5">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-[#111111]">{promo.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          promo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p className="text-2xl font-black text-[#111111]">
                      {promo.percentage ? `-${promo.percentage}%` : promo.fixedAmount ? `-${promo.fixedAmount} FCFA` : 'Offre spéciale'}
                    </p>

                    {promo.description && (
                      <p className="text-xs text-[#787774]">{promo.description}</p>
                    )}

                    {linkedDish && (
                      <p className="text-xs font-semibold text-[#111111]">
                        Plat concerné : <span className="text-[#787774]">{linkedDish.name}</span>
                      </p>
                    )}

                    <div className="text-xs text-[#787774] border-t border-[#EAEAEA] pt-2">
                      Du {new Date(promo.startDate).toLocaleDateString('fr-FR')} au {new Date(promo.endDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#EAEAEA] pt-3">
                    <button
                      onClick={() => handleOpenEdit(promo)}
                      className="rounded-lg border border-[#EAEAEA] bg-white p-2 text-[#111111] hover:bg-[#F7F6F3]"
                      title="Modifier"
                    >
                      <FaPen className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(promo.id)}
                      className="rounded-lg border border-[#EAEAEA] bg-white p-2 text-red-600 hover:bg-red-50"
                      title="Supprimer"
                    >
                      <FaTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-[#111111]">
              {editingPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111]">Titre de la promo</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-3 py-2 text-sm focus:outline-none"
                  placeholder="ex: Réduction de Printemps"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111]">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-3 py-2 text-sm focus:outline-none"
                  rows={2}
                  placeholder="Détails de l'offre..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111]">Réduction (%)</label>
                  <input
                    type="number"
                    value={form.percentage}
                    onChange={(e) => setForm({ ...form, percentage: e.target.value, fixedAmount: '' })}
                    className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-3 py-2 text-sm focus:outline-none"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111]">Réduction fixe (FCFA)</label>
                  <input
                    type="number"
                    value={form.fixedAmount}
                    onChange={(e) => setForm({ ...form, fixedAmount: e.target.value, percentage: '' })}
                    className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-3 py-2 text-sm focus:outline-none"
                    placeholder="500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111]">Plat ciblé (Optionnel)</label>
                <select
                  value={form.dishId}
                  onChange={(e) => setForm({ ...form, dishId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Tous les plats / Promotion globale</option>
                  {dishes.map((dish) => (
                    <option key={dish.id} value={dish.id}>{dish.name} ({dish.price} FCFA)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111111]">Date de début</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#111111]">Date de fin</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-3 py-2 text-sm focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-[#111111]">Promotion active</label>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#EAEAEA] pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#EAEAEA] px-4 py-2 text-sm font-semibold text-[#787774] hover:bg-[#F7F6F3]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#111111] px-5 py-2 text-sm font-semibold text-white hover:bg-[#333333]"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        title="Supprimer la promotion"
        message="Êtes-vous sûr de vouloir supprimer cette promotion ?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
