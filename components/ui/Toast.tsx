'use client'

import { useEffect } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type: ToastType
  isVisible: boolean
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }

  const typeIcons = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    info: FaInfoCircle,
    warning: FaExclamationCircle,
  }

  const Icon = typeIcons[type]

  return (
    <div className="fixed top-24 right-4 z-[100] font-montserrat">
      <div 
        className={`flex items-center gap-4 px-6 py-4 rounded-xl border shadow-lg animate-slide-in ${typeStyles[type]}`}
      >
        <Icon className="w-6 h-6 flex-shrink-0" />
        <p className="font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="hover:opacity-70 transition-opacity flex-shrink-0"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default Toast
