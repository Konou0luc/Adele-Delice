'use client';
import React, { useState, useEffect } from 'react';
import { getOrder, updateOrder } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { notify } from '@/lib/toast';
import { getErrorMessage } from '@/lib/api-error';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

const STATUS_LABELS: Record<keyof OrderStatus, string> = {
  PENDING: 'En attente',
  PAYMENT_CONFIRMED: 'Paiement confirmé',
  PREPARING: 'En préparation',
  READY: 'Prêt',
  DELIVERING: 'En livraison',
  DELIVERED: 'Livré',
  CANCELLED: 'Annulé'
};

export default function OrderDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    fetchOrder();
  }, [id, session, status]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = (session?.user as any)?.token;
      const data = await getOrder(id, token);
      setOrder(data);
    } catch (error) {
      notify.error(getErrorMessage(error, 'Erreur lors du chargement de la commande.'));
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: keyof OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      const token = (session?.user as any)?.token;
      await updateOrder(id, { status: newStatus }, token);
      await fetchOrder();
      notify.success('Statut de la commande mis à jour.');
    } catch (error) {
      notify.error(getErrorMessage(error, 'Erreur lors de la mise à jour de la commande.'));
      console.error('Error updating order:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111111]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-[#787774]">Commande introuvable</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        backHref="/admin/orders"
        breadcrumb="Commandes"
        title={`Commande #${order.orderNumber}`}
        description={new Date(order.createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
        meta={[
          <span key="status" className="px-3 py-1 text-xs rounded-full bg-[#111111] text-white">
            {STATUS_LABELS[order.status]}
          </span>,
          <span key="total" className="px-3 py-1 text-xs rounded-full bg-[#F7F6F3] text-[#111111]">
            {order.totalAmount} FCFA
          </span>,
          <span key="items" className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
            {order.orderItems?.length || 0} article{order.orderItems && order.orderItems.length > 1 ? 's' : ''}
          </span>,
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#111111]">Informations client</h2>
          <div>
            <p className="text-sm text-[#787774]">Nom</p>
            <p className="font-medium text-[#111111]">{order.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-[#787774]">Téléphone</p>
            <p className="font-medium text-[#111111]">{order.customerPhone}</p>
          </div>
          {order.deliveryAddress && (
            <div>
              <p className="text-sm text-[#787774]">Adresse de livraison</p>
              <p className="font-medium text-[#111111]">{order.deliveryAddress}</p>
            </div>
          )}
          {order.comment && (
            <div>
              <p className="text-sm text-[#787774]">Commentaire</p>
              <p className="font-medium text-[#111111]">{order.comment}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[#111111]">Statut de la commande</h2>
          <div className="space-y-2">
            <p className="text-sm text-[#787774]">Statut actuel</p>
            <p className="font-medium text-[#111111]">{STATUS_LABELS[order.status]}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-[#787774]">Changer le statut</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(STATUS_LABELS).map((statusKey) => {
                const status = statusKey as keyof OrderStatus;
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updating}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      order.status === status
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-[#111111] border-gray-200 hover:border-[#111111]'
                    } disabled:opacity-50`}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-[#787774]">Total</p>
            <p className="text-2xl font-bold text-[#111111]">{order.totalAmount} FCFA</p>
          </div>
        </div>
      </div>

      {order.orderItems && order.orderItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#111111] mb-4">Articles</h2>
          <div className="space-y-3">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-[#F7F6F3] rounded-lg">
                <div>
                  <p className="font-medium text-[#111111]">{item.quantity}x {item.dish?.name || 'Plat'}</p>
                  <p className="text-sm text-[#787774]">{item.unitPrice} FCFA</p>
                </div>
                <p className="font-medium text-[#111111]">{item.quantity * item.unitPrice} FCFA</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
