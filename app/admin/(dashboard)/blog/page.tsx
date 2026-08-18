'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import ImageUpload from '@/components/admin/ImageUpload';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, type BlogPost } from '@/lib/api';
import { toast } from 'sonner';
import { FaPlus, FaPen, FaTrash, FaNewspaper, FaEye } from 'react-icons/fa6';

export default function AdminBlogPage() {
  const { data: session } = useSession();
  const token = (session?.user as { token?: string } | undefined)?.token;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    content: '',
    imageUrl: '',
    isPublished: true,
  });

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts();
      setPosts(data || []);
    } catch {
      toast.error('Erreur lors du chargement des articles de blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setForm({
      title: '',
      content: '',
      imageUrl: '',
      isPublished: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl || '',
      isPublished: post.isPublished,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Le titre et le contenu sont requis.');
      return;
    }

    try {
      if (editingPost) {
        await updateBlogPost(editingPost.id, form, token);
        toast.success('Article mis à jour');
      } else {
        await createBlogPost(form, token);
        toast.success('Article créé avec succès');
      }
      setShowModal(false);
      loadPosts();
    } catch {
      toast.error('Erreur lors de l\'enregistrement de l\'article');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteBlogPost(deleteTargetId, token);
      toast.success('Article supprimé');
      setPosts((prev) => prev.filter((p) => p.id !== deleteTargetId));
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AdminPageHeader
          title="Gestion du Blog & Actualités"
          description="Publiez des actualités, nouveautés et annonces pour vos clients."
        />
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-white hover:bg-[#333333] transition-colors"
        >
          <FaPlus className="h-4 w-4" /> Nouvel Article
        </button>
      </div>

      <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-[#787774]">Chargement...</div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-[#787774]">Aucun article publié pour le moment.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EAEAEA] bg-[#FBFBFA]">
                <div>
                  <img
                    src={post.imageUrl || '/placeholder-image.webp'}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          post.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {post.isPublished ? 'Publié' : 'Brouillon'}
                      </span>
                      <span className="text-xs text-[#787774]">
                        {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#111111] line-clamp-2">{post.title}</h3>
                    <p className="text-xs text-[#787774] line-clamp-3">{post.content}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#EAEAEA] p-3 bg-white">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="rounded-lg border border-[#EAEAEA] p-2 text-[#111111] hover:bg-[#F7F6F3]"
                    title="Modifier"
                  >
                    <FaPen className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(post.id)}
                    className="rounded-lg border border-[#EAEAEA] p-2 text-red-600 hover:bg-red-50"
                    title="Supprimer"
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#111111]">
              {editingPost ? 'Modifier l\'article' : 'Rédiger un nouvel article'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111]">Titre de l'article</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-3 py-2 text-sm focus:outline-none"
                  placeholder="ex: Ouverture de notre terrasse d'été !"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111]">Image de l'article</label>
                <div className="mt-1">
                  <ImageUpload
                    value={form.imageUrl}
                    onChange={(url) => setForm({ ...form, imageUrl: url })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111111]">Contenu de l'article</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-3 py-2 text-sm focus:outline-none"
                  rows={6}
                  placeholder="Écrivez le contenu ici..."
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isPublished" className="text-xs font-semibold text-[#111111]">Publier immédiatement</label>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#EAEAEA] pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#EAEAEA] px-4 py-2 text-sm font-semibold text-[#787774] hover:bg-[#F7F6F3]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#111111] px-5 py-2 text-sm font-semibold text-white hover:bg-[#333333]"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        title="Supprimer l'article"
        message="Êtes-vous sûr de vouloir supprimer cet article de blog ?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
