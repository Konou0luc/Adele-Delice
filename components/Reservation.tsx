'use client';

import { useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const Reservation = () => {
  const [guestCount, setGuestCount] = useState(1);

  const increment = () => {
    if (guestCount < 10) setGuestCount(guestCount + 1);
  };

  const decrement = () => {
    if (guestCount > 1) setGuestCount(guestCount - 1);
  };

  return (
    <section id="reservation" className="py-24 bg-[#F7F6F3]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm uppercase tracking-widest text-[#787774] mb-4 block">Réservation</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#111111]">
            Réservez votre table
          </h2>
          <p className="text-lg text-[#2F3437] mt-4">
            Venez profiter d'une expérience culinaire unique dans notre restaurant.
          </p>
        </div>
        <form className="bg-white p-8 rounded-xl border border-[#EAEAEA] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Nom complet</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Numéro de téléphone</label>
              <input 
                type="tel" 
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
                placeholder="+221 XX XXX XX XX"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Heure</label>
              <input 
                type="time" 
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111111] mb-2">Nombre de personnes</label>
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={decrement}
                  className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={guestCount <= 1}
                >
                  <FaMinus />
                </button>
                <span className="text-2xl font-bold text-[#111111] min-w-[80px] text-center">
                  {guestCount} personne{guestCount > 1 ? 's' : ''}
                </span>
                <button 
                  type="button"
                  onClick={increment}
                  className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={guestCount >= 10}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111111] mb-2">Commentaire (optionnel)</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
                placeholder="Allergies, préférences, occasions spéciales..."
              ></textarea>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full py-4 bg-[#111111] text-white text-lg font-semibold rounded-lg hover:bg-[#333333] transition-colors"
          >
            Confirmer la réservation
          </button>
        </form>
      </div>
    </section>
  );
};

export default Reservation;