'use client';
import React, { useState, useEffect } from 'react';
import { getOrders } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/api';
import Link from 'next/link';
import { FaEye } from 'react-icons/fa';

const STATUS_LABELS: Record<keyof OrderStatus, string> = {
  PENDING: 'En attente',
  PAYMENT_CONFIRMED: 'Paiement confirmé',
  PREPARING: 'En préparation',
  READY: 'Prêt',
  DELIVERING: 'En livraison',
  DELIVERED: 'Livré',
  CANCELLED: 'Annulé'
};

const STATUS_COLORS: Record<keyof OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAYMENT_CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-purple-100 text-purple-700',
  READY: 'bg-green-100 text-green-700',
  DELIVERING: 'bg-orange-100 text-orange-700',
  DELIVERED: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-[#111111]">Commandes</h1>
        <p className="text-[#787774] mt-2">Gérez les commandes des clients</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F6F3]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Commande</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Client</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Statut</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#787774]">Date</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-[#787774]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F7F6F3] transition-colors">
                  <td className="px-6 py-4 font-medium text-[#111111]">#{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#111111]">{order.customerName}</div>
                    <div className="text-sm text-[#787774]">{order.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-[#111111]">{order.totalAmount} FCFA</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#787774]">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="p-2 text-[#787774] hover:text-[#111111] hover:bg-[#F7F6F3] rounded-lg transition-colors"
                    >
                      <FaEye />
                    </Link>
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
