'use client';
import React, { useState, useEffect } from 'react';
import { getReservations, updateReservation } from '@/lib/api';
import type { Reservation, ReservationStatus } from '@/lib/api';
import { useSession } from 'next-auth/react';

const STATUS_LABELS: Record<keyof ReservationStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  RESCHEDULED: 'Reprogrammée',
  CANCELLED: 'Annulée'
};

const STATUS_COLORS: Record<keyof ReservationStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  RESCHEDULED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700'
};

export default function ReservationsPage() {
  const { data: session } = useSession();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await getReservations();
      setReservations(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservation: Reservation, newStatus: keyof ReservationStatus) => {
    setUpdating(reservation.id);
    try {
      const token = (session?.user as any)?.token;
      await updateReservation(reservation.id, { status: newStatus }, token);
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
    } finally {
      setUpdating(null);
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
      <div>
        <h1 className="text-3xl font-bold text-[#111111]">Réservations</h1>
        <p className="text-[#787774] mt-2">Gérez les réservations des clients</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F6F3]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Client</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Date & Heure</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Personnes</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-[#F7F6F3] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#111111]">{reservation.customerName}</div>
                    <div className="text-sm text-[#787774]">{reservation.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-[#111111]">
                    {new Date(reservation.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 text-[#111111]">
                    {reservation.numberOfPeople} {reservation.numberOfPeople > 1 ? 'personnes' : 'personne'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${STATUS_COLORS[reservation.status]}`}>
                      {STATUS_LABELS[reservation.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(STATUS_LABELS).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(reservation, status as keyof ReservationStatus)}
                          disabled={updating === reservation.id}
                          className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                            reservation.status === status
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : 'bg-white text-[#111111] border-gray-200 hover:border-[#111111]'
                          } disabled:opacity-50`}
                        >
                          {STATUS_LABELS[status as keyof ReservationStatus]}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
