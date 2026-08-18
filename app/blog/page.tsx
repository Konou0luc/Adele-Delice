'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getBlogPosts, type BlogPost } from '@/lib/api';
import { FaCalendar, FaArrowRight } from 'react-icons/fa6';

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await getBlogPosts({ isPublished: true });
        setPosts(data || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#787774]">Blog & Actualités</span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight">
              Les Nouvelles d'Adèle Délice
            </h1>
            <p className="text-base text-[#787774]">
              Découvrez nos nouveaux plats, nos coulisses et les événements à venir.
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-[#787774]">Chargement des articles...</div>
          ) : posts.length === 0 ? (
            <div className="rounded-3xl border border-[#EAEAEA] bg-white p-12 text-center text-[#787774]">
              Aucun article publié pour le moment. Revenez bientôt !
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-[#EAEAEA] bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="overflow-hidden h-48 bg-[#FBFBFA]">
                    <img
                      src={post.imageUrl || '/placeholder-image.webp'}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#787774]">
                        <FaCalendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      <h2 className="text-xl font-bold text-[#111111] line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-[#787774] line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#EAEAEA]">
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#111111] hover:gap-3 transition-all"
                      >
                        Lire la suite <FaArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
