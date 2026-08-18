'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getBlogPost, type BlogPost } from '@/lib/api';
import { FaArrowLeft, FaCalendar } from 'react-icons/fa6';

export default function BlogPostDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const loadPost = async () => {
      try {
        setLoading(true);
        const data = await getBlogPost(id);
        setPost(data);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F6F3] pt-24 pb-16">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center text-[#787774]">
            Chargement de l'article...
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F6F3] pt-24 pb-16">
          <div className="mx-auto max-w-4xl px-4 py-16">
            <div className="rounded-3xl border border-[#EAEAEA] bg-white p-12 text-center space-y-4">
              <h1 className="text-3xl font-bold text-[#111111]">Article introuvable</h1>
              <p className="text-[#787774]">Cet article n'existe pas ou a été retiré.</p>
              <Link
                href="/blog"
                className="inline-flex rounded-xl bg-[#111111] px-6 py-3 font-semibold text-white hover:bg-[#333333]"
              >
                Retour au blog
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F6F3] pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 space-y-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#787774] hover:text-[#111111]"
          >
            <FaArrowLeft className="h-4 w-4" /> Retour aux articles
          </Link>

          <article className="overflow-hidden rounded-3xl border border-[#EAEAEA] bg-white p-8 sm:p-12 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#787774]">
                <FaCalendar className="h-3.5 w-3.5" />
                {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#111111] leading-tight">
                {post.title}
              </h1>
            </div>

            {post.imageUrl && (
              <div className="overflow-hidden rounded-2xl border border-[#EAEAEA]">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="max-h-[450px] w-full object-cover"
                />
              </div>
            )}

            <div className="prose max-w-none text-[#2F3437] leading-relaxed whitespace-pre-line text-base">
              {post.content}
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </>
  );
}
