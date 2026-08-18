'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FaUtensils, FaHeart, FaShieldHalved, FaUsers, FaArrowRight } from 'react-icons/fa6';

export default function AboutPage() {
  const values = [
    {
      icon: FaHeart,
      title: 'Passion & Générosité',
      description: 'Chaque plat est concocté avec amour et des ingrédients de première qualité pour éveiller vos papilles.',
    },
    {
      icon: FaShieldHalved,
      title: 'Qualité & Hygiène',
      description: 'Nous respectons les normes d\'hygiène les plus strictes pour garantir une expérience gustative saine et sereine.',
    },
    {
      icon: FaUsers,
      title: 'Convivialité',
      description: 'Comme l\'indique notre slogan "Mangez comme si vous êtes à la maison", notre accueil chaleureux vous fait vous sentir chez vous.',
    },
  ];

  const team = [
    { name: 'Adèle', role: 'Chef Fondatrice', image: '/Plats/Adèle Délice LOGO-02.png' },
    { name: 'Luc', role: 'Responsable Opérations', image: '/Plats/Adèle Délice LOGO-03.png' },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 space-y-16">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#787774]">À Propos de Nous</span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight">
              Bienvenue chez Adèle Délice
            </h1>
            <p className="text-lg text-[#2F3437] italic">
              "Mangez comme si vous êtes à la maison."
            </p>
            <p className="text-base text-[#787774] leading-relaxed">
              Adèle Délice est née d'une véritable passion pour la gastronomie africaine et internationale fait-maison. Notre mission est de vous offrir des plats savoureux, généreux et préparés à partir d'ingrédients frais.
            </p>
          </div>

          {/* History & Mission */}
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="overflow-hidden rounded-3xl border border-[#EAEAEA] bg-white p-2">
              <img
                src="/Plats/Adèle Délice LOGO-02.png"
                alt="Adèle Délice"
                className="h-[380px] w-full rounded-2xl object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#111111]">Notre Histoire & Vision</h2>
              <p className="text-[#2F3437] leading-relaxed">
                Créé pour offrir une alternative authentique et chaleureuse aux restaurants conventionnels, Adèle Délice met l'accent sur les recettes traditionnelles revisitées avec soin.
              </p>
              <p className="text-[#787774] leading-relaxed">
                Que vous soyez en famille, entre collègues ou chez vous en livraison, nous faisons en sorte que chaque repas soit un moment de plaisir gourmand sans égal.
              </p>
              <div className="pt-2">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#333333]"
                >
                  Découvrir notre carte <FaArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-[#111111]">Nos Valeurs</h2>
              <p className="text-[#787774]">Ce qui fait l'essence de notre restaurant au quotidien.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="rounded-3xl border border-[#EAEAEA] bg-white p-8 space-y-4 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] text-[#111111]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#111111]">{v.title}</h3>
                    <p className="text-sm text-[#787774] leading-relaxed">{v.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team */}
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-[#111111]">L'Équipe</h2>
              <p className="text-[#787774]">Des passionnés au service de vos papilles.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
              {team.map((member, idx) => (
                <div key={idx} className="overflow-hidden rounded-3xl border border-[#EAEAEA] bg-white p-6 text-center space-y-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-32 w-32 mx-auto rounded-full object-cover border-4 border-[#F7F6F3]"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-[#111111]">{member.name}</h3>
                    <p className="text-sm text-[#787774]">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
