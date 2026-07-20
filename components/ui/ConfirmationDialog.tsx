'use client'

import { FaExclamationTriangle } from 'react-icons/fa'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-montserrat">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <FaExclamationTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#111111] mb-2">{title}</h3>
            <p className="text-[#787774]">{message}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-[#EAEAEA] rounded-xl font-semibold text-[#111111] hover:bg-[#F7F6F3] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog
