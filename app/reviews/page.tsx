'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createReview } from '@/lib/api';
import { toast } from 'sonner';
import { FaStar, FaPaperPlane } from 'react-icons/fa6';

export default function LeaveReviewPage() {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      toast.error('Veuillez remplir votre nom et votre commentaire.');
      return;
    }

    try {
      setSubmitting(true);
      await createReview({
        name: name.trim(),
        rating,
        comment: comment.trim(),
      });
      toast.success('Merci ! Votre avis a été soumis avec succès et sera publié après validation.');
      setName('');
      setComment('');
      setRating(5);
    } catch {
      toast.error('Erreur lors de l\'envoi de votre avis. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-24 pb-16">
        <div className="mx-auto max-w-xl px-4 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#787774]">Avis Clients</span>
            <h1 className="text-4xl font-black text-[#111111] tracking-tight">
              Donnez votre avis
            </h1>
            <p className="text-base text-[#787774]">
              Votre expérience chez Adèle Délice compte énormément pour nous.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-[#EAEAEA] bg-white p-8 shadow-sm space-y-6">
            {/* Rating Stars */}
            <div className="text-center space-y-2">
              <label className="block text-xs font-semibold text-[#787774] uppercase tracking-wider">Note globale</label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <FaStar
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating) ? 'text-amber-500 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-[#111111]">{rating} / 5 étoiles</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-1">Votre Nom / Pseudo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Jean Dupont"
                className="w-full rounded-xl border border-[#EAEAEA] px-4 py-3 text-sm focus:border-[#CFCFCF] focus:outline-none"
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-1">Votre Commentaire</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Racontez-nous votre expérience ou ce que vous avez pensé de votre plat..."
                rows={5}
                className="w-full rounded-xl border border-[#EAEAEA] px-4 py-3 text-sm focus:border-[#CFCFCF] focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-6 py-4 font-semibold text-white transition-colors hover:bg-[#333333] disabled:opacity-50"
            >
              <FaPaperPlane className="h-4 w-4" />
              {submitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
