'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrders, type Order } from '@/lib/api';
import { toast } from 'sonner';
import { FaMagnifyingGlass, FaTruckFast, FaClock, FaCheck, FaUtensils, FaXmark } from 'react-icons/fa6';

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'En attente', bg: 'bg-amber-100', text: 'text-amber-800' },
  PAYMENT_CONFIRMED: { label: 'Paiement confirmé', bg: 'bg-blue-100', text: 'text-blue-800' },
  PREPARING: { label: 'En préparation en cuisine', bg: 'bg-purple-100', text: 'text-purple-800' },
  READY: { label: 'Commande prête', bg: 'bg-[#111111]', text: 'text-white' },
  DELIVERING: { label: 'En cours de livraison', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  DELIVERED: { label: 'Livrée avec succès', bg: 'bg-green-100', text: 'text-green-800' },
  CANCELLED: { label: 'Annulée', bg: 'bg-red-100', text: 'text-red-800' },
};

export default function TrackOrderPage() {
  const [orderNumberInput, setOrderNumberInput] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = orderNumberInput.trim();
    if (!query) {
      toast.error('Veuillez entrer un numéro de commande.');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const results = await getOrders({ orderNumber: query });
      if (results && results.length > 0) {
        setOrder(results[0]);
      } else {
        setOrder(null);
      }
    } catch {
      toast.error('Erreur lors de la recherche de la commande.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#787774]">Suivi de Commande</span>
            <h1 className="text-4xl font-black text-[#111111] tracking-tight">
              Où en est votre plat ?
            </h1>
            <p className="text-base text-[#787774]">
              Entrez votre numéro de commande pour consulter l'avancement en temps réel.
            </p>
          </div>

          <form onSubmit={handleSearch} className="rounded-3xl border border-[#EAEAEA] bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                placeholder="ex: CMD-172328..."
                className="flex-1 rounded-xl border border-[#EAEAEA] px-4 py-3 text-[#111111] placeholder:text-[#A8A29E] focus:border-[#CFCFCF] focus:outline-none uppercase font-mono font-bold"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#333333] disabled:opacity-50"
              >
                <FaMagnifyingGlass className="h-4 w-4" />
                {loading ? 'Recherche...' : 'Suivre'}
              </button>
            </div>
          </form>

          {/* Results Display */}
          {searched && (
            loading ? (
              <div className="py-12 text-center text-[#787774]">Recherche de votre commande...</div>
            ) : !order ? (
              <div className="rounded-3xl border border-[#EAEAEA] bg-white p-10 text-center space-y-2">
                <p className="text-xl font-bold text-[#111111]">Commande non trouvée</p>
                <p className="text-sm text-[#787774]">
                  Vérifiez le numéro de commande et réessayez. Si le problème persiste, contactez le restaurant.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-[#EAEAEA] bg-white p-8 space-y-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAEAEA] pb-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#787774]">Numéro de Commande</p>
                    <h2 className="text-2xl font-bold text-[#111111]">#{order.orderNumber}</h2>
                    <p className="text-xs text-[#787774] mt-1">
                      Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} à{' '}
                      {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      STATUS_LABELS[order.status]?.bg || 'bg-gray-100'
                    } ${STATUS_LABELS[order.status]?.text || 'text-gray-800'}`}
                  >
                    {STATUS_LABELS[order.status]?.label || order.status}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#F7F6F3] p-4">
                    <p className="text-xs text-[#787774]">Client</p>
                    <p className="font-semibold text-[#111111]">{order.customerName}</p>
                    <p className="text-xs text-[#787774] mt-1">{order.customerPhone}</p>
                  </div>
                  <div className="rounded-2xl bg-[#F7F6F3] p-4">
                    <p className="text-xs text-[#787774]">Type de commande</p>
                    <p className="font-semibold text-[#111111]">
                      {order.orderType === 'delivery' ? 'Livraison à domicile' : 'À emporter sur place'}
                    </p>
                    {order.deliveryAddress && (
                      <p className="text-xs text-[#787774] mt-1">{order.deliveryAddress}</p>
                    )}
                  </div>
                </div>

                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="space-y-3 border-t border-[#EAEAEA] pt-4">
                    <p className="text-xs uppercase font-bold text-[#787774]">Articles commandés</p>
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-[#111111]">
                          <span className="font-bold">{item.quantity}x</span> {item.dish?.name || 'Plat'}
                        </span>
                        <span className="font-semibold text-[#111111]">{item.quantity * item.unitPrice} FCFA</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between border-t border-[#EAEAEA] pt-3 text-base font-bold text-[#111111]">
                      <span>Total</span>
                      <span>{order.totalAmount} FCFA</span>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
