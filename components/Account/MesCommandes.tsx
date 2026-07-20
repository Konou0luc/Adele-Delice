'use client'

import { useState } from 'react'
import { FaClock, FaCheckCircle, FaShoppingBag, FaTrash } from 'react-icons/fa'
import Toast from '../ui/Toast'
import ConfirmationDialog from '../ui/ConfirmationDialog'

const MesCommandes = () => {
  const [orders, setOrders] = useState([
    {
      id: 'CMD-1234',
      date: '19 Juillet 2026',
      status: 'En cours',
      items: [
        { name: 'Poulet Yassa', quantity: 2, price: 2500 },
        { name: 'Riz Sauce Arachide', quantity: 1, price: 2000 }
      ],
      total: 7000
    },
    {
      id: 'CMD-1233',
      date: '18 Juillet 2026',
      status: 'Livré',
      items: [
        { name: 'Thieboudienne', quantity: 1, price: 3000 },
        { name: 'Jus de Bissap', quantity: 2, price: 500 }
      ],
      total: 4000
    }
  ])
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; orderId: string | null }>({
    isOpen: false,
    orderId: null,
  })

  const handleDeleteClick = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      orderId: id,
    })
  }

  const confirmDeleteOrder = () => {
    if (confirmDialog.orderId !== null) {
      setOrders(prev => prev.filter(order => order.id !== confirmDialog.orderId))
      setToast({
        message: `Commande ${confirmDialog.orderId} a été supprimée`,
        type: 'success',
      })
    }
    setConfirmDialog({ isOpen: false, orderId: null })
  }

  return (
    <div className="space-y-6 font-montserrat">
      <h2 className="text-2xl font-bold text-[#111111] mb-8">Mes Commandes</h2>
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-xl border border-[#EAEAEA] p-4 md:p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-[#EAEAEA]">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div>
                <div className="flex items-center gap-2">
                  <FaShoppingBag className="text-[#787774]" />
                  <span className="font-bold text-[#111111]">Commande {order.id}</span>
                </div>
                <p className="text-sm text-[#787774]">{order.date}</p>
              </div>
              <button
                onClick={() => handleDeleteClick(order.id)}
                className="text-red-500 hover:text-red-700 p-2 md:hidden"
              >
                <FaTrash className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold w-fit ${order.status === 'En cours' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {order.status === 'En cours' ? <FaClock /> : <FaCheckCircle />}
                {order.status}
              </span>
              <button
                onClick={() => handleDeleteClick(order.id)}
                className="text-red-500 hover:text-red-700 p-2 hidden md:flex items-center gap-1 text-sm font-semibold"
              >
                <FaTrash className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
          <div className="mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm py-1">
                <span className="text-[#787774]">{item.name} x{item.quantity}</span>
                <span className="font-bold text-[#111111]">{item.price * item.quantity} FCFA</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-xl pt-4 border-t border-[#EAEAEA]">
            <span className="text-[#111111]">Total</span>
            <span className="text-[#111111]">{order.total} FCFA</span>
          </div>
        </div>
      ))}
      
      {orders.length === 0 && (
        <div className="bg-white rounded-xl border border-[#EAEAEA] p-12 text-center">
          <p className="text-[#787774] text-lg mb-6">Vous n'avez pas de commandes</p>
        </div>
      )}
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
      
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title="Supprimer la commande"
        message="Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDeleteOrder}
        onCancel={() => setConfirmDialog({ isOpen: false, orderId: null })}
      />
    </div>
  )
}

export default MesCommandes
