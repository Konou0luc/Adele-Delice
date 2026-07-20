'use client'

import { useState } from 'react'
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa'
import Toast from '../ui/Toast'
import ConfirmationDialog from '../ui/ConfirmationDialog'

const MonPanier = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Poulet Yassa',
      price: 2500,
      quantity: 2,
      image: '/Plats/IMG_20260628_215543957_AE.webp'
    },
    {
      id: 2,
      name: 'Jus de Bissap',
      price: 500,
      quantity: 3,
      image: '/Gallery/stylish-african-woman-red-shirt-hat-posed-indoor-cafe-drinking-pineapple-lemonade.webp'
    }
  ])
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; itemId: number | null; itemName: string }>({
    isOpen: false,
    itemId: null,
    itemName: '',
  })

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const handleRemoveClick = (id: number, name: string) => {
    setConfirmDialog({
      isOpen: true,
      itemId: id,
      itemName: name,
    })
  }

  const confirmRemoveItem = () => {
    if (confirmDialog.itemId !== null) {
      setCartItems(prev => prev.filter(item => item.id !== confirmDialog.itemId))
      setToast({
        message: `${confirmDialog.itemName} a été retiré du panier`,
        type: 'success',
      })
    }
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' })
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="space-y-6 font-montserrat">
      <h2 className="text-2xl font-bold text-[#111111] mb-8">Mon Panier</h2>
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#EAEAEA] p-12 text-center">
          <p className="text-[#787774] text-lg mb-6">Votre panier est vide</p>
          <a href="/menu" className="inline-block px-8 py-3 bg-[#111111] text-white font-semibold rounded-lg hover:bg-[#333333] transition-colors">
            Commander maintenant
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-[#EAEAEA] p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#111111]">{item.name}</h3>
                    <p className="text-[#787774] mb-3">{item.price} FCFA / unité</p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 rounded-full border border-[#EAEAEA] flex items-center justify-center hover:bg-[#F7F6F3] transition-colors"
                        >
                          <FaMinus className="text-[#787774]" />
                        </button>
                        <span className="w-10 text-center font-bold text-[#111111]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 rounded-full border border-[#EAEAEA] flex items-center justify-center hover:bg-[#F7F6F3] transition-colors"
                        >
                          <FaPlus className="text-[#787774]" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-xl font-bold text-[#111111]">{item.price * item.quantity} FCFA</p>
                        <button
                          onClick={() => handleRemoveClick(item.id, item.name)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1"
                        >
                          <FaTrash className="w-3" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-[#EAEAEA] p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-[#111111]">Total</span>
              <span className="text-2xl font-bold text-[#111111]">{total} FCFA</span>
            </div>
            <button className="w-full px-8 py-4 bg-[#111111] text-white text-lg font-semibold rounded-lg hover:bg-[#333333] transition-colors">
              Valider la commande
            </button>
          </div>
        </>
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
        title="Supprimer l'article"
        message={`Êtes-vous sûr de vouloir supprimer "${confirmDialog.itemName}" du panier ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmRemoveItem}
        onCancel={() => setConfirmDialog({ isOpen: false, itemId: null, itemName: '' })}
      />
    </div>
  )
}

export default MonPanier
