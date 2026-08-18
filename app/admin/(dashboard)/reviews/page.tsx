'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { getReviews, updateReview, deleteReview, type Review } from '@/lib/api';
import { toast } from 'sonner';
import { FaStar, FaCheck, FaEyeSlash, FaTrash } from 'react-icons/fa6';

export default function AdminReviewsPage() {
  const { data: session } = useSession();
  const token = (session?.user as { token?: string } | undefined)?.token;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(undefined, token);
      setReviews(data || []);
    } catch {
      toast.error('Erreur lors du chargement des avis clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApprove = async (review: Review) => {
    try {
      await updateReview(review.id, { isApproved: !review.isApproved }, token);
      toast.success(review.isApproved ? 'Avis masqué' : 'Avis approuvé et publié');
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, isApproved: !r.isApproved } : r))
      );
    } catch {
      toast.error('Erreur lors de la modification de l\'état de l\'avis');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteReview(deleteTargetId, token);
      toast.success('Avis supprimé');
      setReviews((prev) => prev.filter((r) => r.id !== deleteTargetId));
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Modération des Avis Clients"
        description="Validez, masquez ou modérez les avis laissés par vos clients."
      />

      <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-[#787774]">Chargement des avis...</div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-[#787774]">Aucun avis client pour le moment.</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#111111]">{review.name}</span>
                    <div className="flex items-center gap-1 text-amber-500 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? 'fill-current' : 'text-gray-300'}
                        />
                      ))}
                      <span className="ml-1 text-xs font-bold text-[#111111]">{review.rating}/5</span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        review.isApproved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {review.isApproved ? 'Publié' : 'En attente'}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-[#2F3437] italic">"{review.comment}"</p>
                  )}
                  <p className="text-xs text-[#787774]">
                    Déposé le {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApprove(review)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                      review.isApproved
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        : 'bg-green-700 text-white hover:bg-green-800'
                    }`}
                  >
                    {review.isApproved ? (
                      <>
                        <FaEyeSlash className="h-3.5 w-3.5" /> Masquer
                      </>
                    ) : (
                      <>
                        <FaCheck className="h-3.5 w-3.5" /> Approuver
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(review.id)}
                    className="rounded-xl border border-[#EAEAEA] bg-white p-2 text-red-600 hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        title="Supprimer l'avis"
        message="Êtes-vous sûr de vouloir supprimer cet avis client ?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
