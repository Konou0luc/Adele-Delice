'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/admin',
      }) as any;

      if (result?.error) {
        setError('Identifiants incorrects');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] font-montserrat">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#111111] relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
            alt="Restaurant"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            <Link href="/" className="inline-block">
              <img src="/logo-small.webp" alt="Adèle Délice" className="h-32" />
            </Link>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block lg:hidden mb-6">
                <img src="/logo-small.webp" alt="Adèle Délice" className="h-16 mx-auto" />
              </Link>
              <h1 className="text-3xl font-bold text-[#111111]">Connexion Admin</h1>
              <p className="text-[#787774] mt-2">Accédez au backoffice d'Adèle Délice</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#111111] mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all text-[#111111] placeholder-gray-400 bg-white"
                  placeholder="admin@adeledelice.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#111111] mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all text-[#111111] placeholder-gray-400 bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#787774] hover:text-[#111111]"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#111111] text-white font-semibold rounded-lg hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-[#787774] hover:text-[#111111] text-sm">
                ← Retour au site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
