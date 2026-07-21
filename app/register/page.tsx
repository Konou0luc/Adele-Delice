'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { FaArrowRight, FaEnvelope, FaGoogle, FaLock, FaPhone, FaUser } from 'react-icons/fa';
import { toast } from 'sonner';
import { register } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/account');
    }
  }, [router, status]);

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/account' });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
      });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/account',
      });

      if (result?.error) {
        router.replace('/login');
        return;
      }

      toast.success('Compte créé avec succès');
      router.replace('/account');
    } catch (err) {
      setError('Impossible de créer le compte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] font-montserrat">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden bg-[#111111] lg:block">
          <img
            src="/Gallery/interior-shot-cafe-with-chairs-near-bar-with-wooden-tables.webp"
            alt="Adèle Délice"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <Link href="/" className="inline-flex w-fit items-center gap-3">
              <img src="/logo-small.webp" alt="Adèle Délice" className="h-14" />
            </Link>
            <div className="max-w-xl">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/80">Créer un compte</p>
              <h1 className="text-5xl font-bold leading-tight">
                Rejoins Adèle Délice et retrouve tout au même endroit.
              </h1>
              <p className="mt-6 text-lg text-white/80">
                Passe par Google ou par email pour enregistrer tes commandes et suivre ton espace client.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-xl">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="mb-5 inline-flex">
                <img src="/logo-small.webp" alt="Adèle Délice" className="h-14" />
              </Link>
              <h1 className="text-3xl font-bold text-[#111111]">Créer un compte</h1>
              <p className="mt-2 text-sm text-[#787774]">Google ou email, puis accès à ton espace client.</p>
            </div>

            <div className="rounded-3xl border border-[#EAEAEA] bg-white p-6 shadow-sm md:p-8">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3]"
                >
                  <FaGoogle className="text-[#DB4437]" />
                  Continuer avec Google
                </button>
              </div>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-[#EAEAEA]" />
                <span className="text-xs uppercase tracking-[0.25em] text-[#787774]">ou</span>
                <span className="h-px flex-1 bg-[#EAEAEA]" />
              </div>

              <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">Prénom</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      required
                      className="w-full rounded-xl border border-[#EAEAEA] bg-white px-12 py-3 text-[#111111] placeholder:text-[#A8A29E] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                      placeholder="Awa"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">Nom</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      required
                      className="w-full rounded-xl border border-[#EAEAEA] bg-white px-12 py-3 text-[#111111] placeholder:text-[#A8A29E] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                      placeholder="Diop"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="w-full rounded-xl border border-[#EAEAEA] bg-white px-12 py-3 text-[#111111] placeholder:text-[#A8A29E] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                      placeholder="ton@email.com"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">Téléphone</label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="w-full rounded-xl border border-[#EAEAEA] bg-white px-12 py-3 text-[#111111] placeholder:text-[#A8A29E] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                      placeholder="+221 77 000 00 00"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">Mot de passe</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="w-full rounded-xl border border-[#EAEAEA] bg-white px-12 py-3 text-[#111111] placeholder:text-[#A8A29E] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">Confirmation</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#787774]" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                      className="w-full rounded-xl border border-[#EAEAEA] bg-white px-12 py-3 text-[#111111] placeholder:text-[#A8A29E] focus:border-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="md:col-span-2 flex w-full items-center justify-center gap-3 rounded-xl bg-[#111111] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? 'Création...' : 'Créer mon compte'}
                  {!isLoading && <FaArrowRight />}
                </button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-3 text-sm text-[#787774]">
                <p>
                  Déjà inscrit ?{' '}
                  <Link href="/login" className="font-semibold text-[#111111] hover:underline">
                    Se connecter
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
