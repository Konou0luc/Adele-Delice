'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrders, getTrackedOrder, type Order, type OrderStatus } from '@/lib/api';
import { getOrderHistory, updateOrderHistoryStatus, type OrderHistoryEntry } from '@/lib/user-flow';
import { toast } from 'sonner';
import {
  FaMagnifyingGlass,
  FaTruckFast,
  FaClock,
  FaCheck,
  FaUtensils,
  FaXmark,
  FaArrowRight,
  FaCopy,
} from 'react-icons/fa6';

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'En attente', bg: 'bg-amber-100', text: 'text-amber-800' },
  PAYMENT_CONFIRMED: { label: 'Paiement confirmé', bg: 'bg-blue-100', text: 'text-blue-800' },
  PREPARING: { label: 'En préparation', bg: 'bg-purple-100', text: 'text-purple-800' },
  READY: { label: 'Commande prête', bg: 'bg-[#111111]', text: 'text-white' },
  DELIVERING: { label: 'En cours de livraison', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  DELIVERED: { label: 'Livrée avec succès', bg: 'bg-green-100', text: 'text-green-800' },
  CANCELLED: { label: 'Annulée', bg: 'bg-red-100', text: 'text-red-800' },
};

const STEP_ORDER: (keyof OrderStatus)[] = [
  'PENDING',
  'PAYMENT_CONFIRMED',
  'PREPARING',
  'READY',
  'DELIVERING',
  'DELIVERED',
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const token = (session?.user as { token?: string } | undefined)?.token;

  const [orderNumberInput, setOrderNumberInput] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentOrders, setRecentOrders] = useState<OrderHistoryEntry[]>([]);

  // Ref to track previous status for toast alerts when status changes live
  const prevStatusRef = useRef<string | null>(null);

  useEffect(() => {
    // Load local order history for quick selection
    const history = getOrderHistory();
    setRecentOrders(history);

    // Read URL param code or orderNumber if present
    const urlCode = searchParams.get('code') || searchParams.get('orderNumber');
    if (urlCode) {
      executeSearch(urlCode);
    }
  }, [searchParams]);

  // Quiet polling to update status live without showing loading spinner
  const pollLatestOrderStatus = async (queryCode: string) => {
    const cleanQuery = queryCode.trim().toUpperCase();
    if (!cleanQuery) return;

    try {
      // Try server proxy API first (works for all users)
      const remoteOrder = await getTrackedOrder(cleanQuery);
      if (remoteOrder) {
        // Notify if status changed
        if (prevStatusRef.current && prevStatusRef.current !== remoteOrder.status) {
          const newLabel = STATUS_LABELS[remoteOrder.status]?.label || remoteOrder.status;
          toast.info(`Nouveau statut : ${newLabel}`);
        }
        prevStatusRef.current = remoteOrder.status;

        setOrder(remoteOrder);
        const updatedHistory = updateOrderHistoryStatus(remoteOrder.orderNumber, remoteOrder.status);
        setRecentOrders(updatedHistory);
        return;
      }
    } catch {
      // Ignored during background polling
    }

    // Fallback: check local storage if updated
    const localHistory = getOrderHistory();
    const localMatch = localHistory.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleanQuery ||
        o.id.toUpperCase() === cleanQuery
    );

    if (localMatch) {
      if (prevStatusRef.current && prevStatusRef.current !== localMatch.status) {
        const newLabel = STATUS_LABELS[localMatch.status]?.label || localMatch.status;
        toast.info(`Nouveau statut : ${newLabel}`);
      }
      prevStatusRef.current = localMatch.status;

      setOrder((prev) => (prev ? { ...prev, status: localMatch.status as keyof OrderStatus } : prev));
      setRecentOrders(localHistory);
    }
  };

  // Set up live polling interval (every 5 seconds) if order is active
  useEffect(() => {
    if (!order || order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      return;
    }

    prevStatusRef.current = order.status;

    const intervalId = setInterval(() => {
      pollLatestOrderStatus(order.orderNumber);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [order?.orderNumber, order?.status, token]);

  const executeSearch = async (query: string) => {
    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) {
      toast.error('Veuillez entrer un numéro de commande.');
      return;
    }

    setOrderNumberInput(cleanQuery);
    setLoading(true);
    setSearched(true);

    let foundOrder: Order | null = null;

    // 1. Try fetching from Server Proxy API
    try {
      foundOrder = await getTrackedOrder(cleanQuery);
    } catch {
      // Fallback below if API server is offline or not found
    }

    // 2. Fallback: Local Storage Order History
    if (!foundOrder) {
      const localHistory = getOrderHistory();
      const localMatch = localHistory.find(
        (o) =>
          o.orderNumber.toUpperCase() === cleanQuery ||
          o.id.toUpperCase() === cleanQuery
      );

      if (localMatch) {
        foundOrder = {
          id: localMatch.id,
          orderNumber: localMatch.orderNumber,
          customerName: localMatch.customerName,
          customerPhone: localMatch.customerPhone,
          deliveryAddress: localMatch.deliveryAddress,
          comment: localMatch.comment,
          orderType: localMatch.orderType,
          totalAmount: localMatch.totalAmount,
          status: localMatch.status as keyof OrderStatus,
          createdAt: localMatch.createdAt,
          updatedAt: localMatch.createdAt,
          orderItems: localMatch.items.map((item) => ({
            id: item.dishId,
            orderId: localMatch.id,
            dishId: item.dishId,
            quantity: item.quantity,
            unitPrice: item.price,
            dish: {
              id: item.dishId,
              name: item.name,
              price: item.price,
              images: item.image ? [item.image] : [],
            } as any,
          })),
        };
      }
    }

    if (foundOrder) {
      prevStatusRef.current = foundOrder.status;
    }
    setOrder(foundOrder);
    setLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(orderNumberInput);
  };

  const copyOrderCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Numéro de commande copié !');
  };

  const getCurrentStepIndex = (status: keyof OrderStatus) => {
    if (status === 'CANCELLED') return -1;
    const idx = STEP_ORDER.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = order ? getCurrentStepIndex(order.status) : 0;
  const isLiveActive = order && order.status !== 'DELIVERED' && order.status !== 'CANCELLED';

  return (
    <div className="mx-auto max-w-3xl px-4 space-y-8 font-montserrat">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#787774]">
          Suivi de Commande
        </span>
        <h1 className="text-4xl font-black text-[#111111] tracking-tight">
          Où en est votre plat ?
        </h1>
        <p className="text-base text-[#787774]">
          Consultez l'avancement de votre commande en temps réel en 1 clic.
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearchSubmit} className="rounded-3xl border border-[#EAEAEA] bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value)}
            placeholder="ex: CMD-172328..."
            className="flex-1 rounded-xl border border-[#EAEAEA] px-4 py-3 text-[#111111] placeholder:text-[#A8A29E] focus:border-[#CFCFCF] focus:outline-none uppercase font-mono font-bold"
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

      {/* Quick Select: Recent Local Orders */}
      {recentOrders.length > 0 && (
        <div className="rounded-3xl border border-[#EAEAEA] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2">
              <FaClock className="text-[#787774] h-4 w-4" />
              Vos commandes récentes
            </h3>
            <span className="text-xs text-[#787774]">{recentOrders.length} enregistrée(s)</span>
          </div>

          <div className="space-y-3">
            {recentOrders.map((ro) => {
              const isSelected = order?.orderNumber === ro.orderNumber;
              return (
                <button
                  key={ro.id}
                  type="button"
                  onClick={() => executeSearch(ro.orderNumber)}
                  className={`w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 md:p-5 text-left transition-all hover:border-[#111111] hover:shadow-md ${
                    isSelected
                      ? 'border-[#111111] bg-[#FBFBFA] ring-2 ring-[#111111]/10'
                      : 'border-[#EAEAEA] bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-1 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-[#111111]">
                        #{ro.orderNumber}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#111111] text-white px-2 py-0.5 rounded-md">
                          En cours
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#787774]">
                      {new Date(ro.createdAt).toLocaleDateString('fr-FR')} •{' '}
                      <span className="font-semibold text-[#111111]">
                        {ro.totalAmount.toLocaleString('fr-FR')} FCFA
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center sm:justify-center flex-1">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                        STATUS_LABELS[ro.status]?.bg || 'bg-gray-100'
                      } ${STATUS_LABELS[ro.status]?.text || 'text-gray-800'}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                      {STATUS_LABELS[ro.status]?.label || ro.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-end">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#333333]">
                      Suivre en direct
                      <FaArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results Display */}
      {searched && (
        loading ? (
          <div className="py-12 text-center text-[#787774]">Recherche de votre commande...</div>
        ) : !order ? (
          <div className="rounded-3xl border border-[#EAEAEA] bg-white p-10 text-center space-y-3 shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <FaXmark className="h-6 w-6" />
            </div>
            <p className="text-xl font-bold text-[#111111]">Commande non trouvée</p>
            <p className="text-sm text-[#787774] max-w-md mx-auto">
              Vérifiez le numéro saisi. Si vous venez d'effectuer votre commande, celle-ci apparaît dans vos commandes récentes ci-dessus.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-[#EAEAEA] bg-white p-8 space-y-8 shadow-sm">
            {/* Header Result */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAEAEA] pb-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#787774]">Commande n°</p>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-2xl font-bold text-[#111111]">#{order.orderNumber}</h2>
                  <button
                    type="button"
                    onClick={() => copyOrderCode(order.orderNumber)}
                    className="p-1.5 rounded-lg text-[#787774] hover:bg-[#F7F6F3] hover:text-[#111111] transition-colors"
                    title="Copier le numéro"
                  >
                    <FaCopy className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-[#787774] mt-1">
                  Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} à{' '}
                  {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    STATUS_LABELS[order.status]?.bg || 'bg-gray-100'
                  } ${STATUS_LABELS[order.status]?.text || 'text-gray-800'}`}
                >
                  {STATUS_LABELS[order.status]?.label || order.status}
                </span>

                {isLiveActive && (
                  <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    Mise à jour en direct
                  </span>
                )}
              </div>
            </div>

            {/* Visual Timeline Bar */}
            {order.status === 'CANCELLED' ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-sm font-semibold text-red-700">
                Cette commande a été annulée. Contactez le restaurant pour plus d'informations.
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs uppercase font-bold tracking-wider text-[#787774]">Avancement de la préparation</p>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { title: 'Reçue', icon: FaClock, step: 0 },
                    { title: 'Payée', icon: FaCheck, step: 1 },
                    { title: 'Cuisine', icon: FaUtensils, step: 2 },
                    { title: 'Prête', icon: FaCheck, step: 3 },
                    { title: 'Livraison', icon: FaTruckFast, step: 4 },
                  ].map((stepItem) => {
                    const isDone = currentStepIdx >= stepItem.step;
                    const isCurrent = currentStepIdx === stepItem.step;
                    const Icon = stepItem.icon;

                    return (
                      <div key={stepItem.step} className="flex flex-col items-center text-center space-y-2">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                            isCurrent
                              ? 'bg-[#111111] text-white ring-4 ring-[#111111]/20 scale-110'
                              : isDone
                              ? 'bg-green-500 text-white'
                              : 'bg-[#F7F6F3] text-[#A8A29E]'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            isCurrent ? 'text-[#111111] font-bold' : isDone ? 'text-green-700' : 'text-[#A8A29E]'
                          }`}
                        >
                          {stepItem.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Details Grid */}
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

            {/* Items */}
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
  );
}

export default function TrackOrderPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-24 pb-16">
        <Suspense fallback={<div className="py-24 text-center text-[#787774]">Chargement...</div>}>
          <TrackOrderContent />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
