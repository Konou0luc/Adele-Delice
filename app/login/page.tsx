'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { FaArrowRight, FaEnvelope, FaGoogle, FaLock } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/account');
    }
  }, [router, status]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/account',
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
        return;
      }

      router.replace('/account');
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/account' });
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] font-montserrat">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src="/Gallery/interior-shot-cafe-with-chairs-near-bar-with-wooden-tables.webp"
            alt="Adèle Délice"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <Link href="/" className="inline-flex w-fit items-center gap-3">
              <img src="/logo-small.webp" alt="Adèle Délice" className="h-14" />
            </Link>
            <div className="max-w-xl">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/80">Connexion client</p>
              <h1 className="text-5xl font-bold leading-tight">
                Accédez à vos commandes, favoris et informations personnelles.
              </h1>
              <p className="mt-6 text-lg text-white/80">
                Choisissez la connexion Google ou votre adresse email pour retrouver votre compte.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="mb-5 inline-flex">
                <img src="/logo-small.webp" alt="Adèle Délice" className="h-14" />
              </Link>
              <h1 className="text-3xl font-bold text-[#111111]">Connexion client</h1>
              <p className="mt-2 text-sm text-[#787774]">Google ou email, selon ce qui t’arrange.</p>
            </div>

            <div className="rounded-3xl border border-[#EAEAEA] bg-white p-6 shadow-sm md:p-8">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#EAEAEA] bg-white px-4 py-3 font-semibold text-[#111111] transition-colors hover:bg-[#F7F6F3] disabled:cursor-not-allowed disabled:opacity-60"
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

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
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

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#111111] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                  {!isLoading && <FaArrowRight />}
                </button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-3 text-sm text-[#787774]">
                <p>
                  Pas encore de compte ?{' '}
                  <Link href="/register" className="font-semibold text-[#111111] hover:underline">
                    Créer un compte
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
