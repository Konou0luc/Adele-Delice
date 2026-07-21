'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { deleteReservation, getReservation, updateReservation } from '@/lib/api';
import type { Reservation, ReservationStatus } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';

const STATUS_LABELS: Record<keyof ReservationStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  RESCHEDULED: 'Reprogrammée',
  CANCELLED: 'Annulée',
};

export default function ReservationDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = (session?.user as any)?.token;
        const data = await getReservation(id, token);
        setReservation(data);
      } catch (error) {
        notify.error(getErrorMessage(error, 'Erreur lors du chargement de la réservation.'));
        console.error('Error fetching reservation detail:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      void fetchData();
    }
  }, [id, session]);

  const handleStatusChange = async (status: keyof ReservationStatus) => {
    if (!reservation) return;

    try {
      setUpdating(true);
      const token = (session?.user as any)?.token;
      await updateReservation(reservation.id, { status }, token);
      setReservation({ ...reservation, status });
      notify.success('Statut de la réservation mis à jour.');
    } catch (error) {
      notify.error(getErrorMessage(error, 'Erreur lors de la mise à jour de la réservation.'));
      console.error('Error updating reservation detail:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!reservation || !confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;

    try {
      setDeleting(true);
      const token = (session?.user as any)?.token;
      await deleteReservation(reservation.id, token);
      notify.success('Réservation supprimée avec succès.');
      router.push('/admin/reservations');
    } catch (error) {
      notify.error(getErrorMessage(error, 'Erreur lors de la suppression de la réservation.'));
      console.error('Error deleting reservation:', error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111111]"></div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="text-center py-12">
        <p className="text-[#787774]">Réservation introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        backHref="/admin/reservations"
        breadcrumb="Réservations"
        title={reservation.customerName}
        description={`${reservation.customerPhone} · ${new Date(reservation.date).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`}
        meta={[
          <span key="people" className="px-3 py-1 text-xs rounded-full bg-[#111111] text-white">
            {reservation.numberOfPeople} personne{reservation.numberOfPeople > 1 ? 's' : ''}
          </span>,
          <span key="status" className="px-3 py-1 text-xs rounded-full bg-[#F7F6F3] text-[#111111]">
            {STATUS_LABELS[reservation.status]}
          </span>,
        ]}
        actions={
          <button
            type="button"
            onClick={() => {
              void handleDelete();
            }}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <FaTrash />
            {deleting ? 'Suppression...' : 'Supprimer'}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#111111]">Informations</h2>
          <div>
            <p className="text-sm text-[#787774]">Nombre de personnes</p>
            <p className="font-medium text-[#111111]">{reservation.numberOfPeople}</p>
          </div>
          <div>
            <p className="text-sm text-[#787774]">Statut actuel</p>
            <p className="font-medium text-[#111111]">{STATUS_LABELS[reservation.status]}</p>
          </div>
          <div>
            <p className="text-sm text-[#787774]">Commentaire</p>
            <p className="font-medium text-[#111111]">{reservation.comment || '-'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#111111]">Changer le statut</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(STATUS_LABELS).map((status) => {
              const key = status as keyof ReservationStatus;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    void handleStatusChange(key);
                  }}
                  disabled={updating}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    reservation.status === key
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#111111] border-gray-200 hover:border-[#111111]'
                  } disabled:opacity-50`}
                >
                  {STATUS_LABELS[key]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
