'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { getUsers, updateUser, deleteUser, type User } from '@/lib/api';
import { toast } from 'sonner';
import { FaUserShield, FaUserCheck, FaUserMinus, FaTrash, FaPlus } from 'react-icons/fa6';

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const token = (session?.user as { token?: string } | undefined)?.token;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers(token);
      setUsers(data || []);
    } catch {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token]);

  const handleToggleStatus = async (user: User) => {
    try {
      await updateUser(user.id, { isActive: !user.isActive }, token);
      toast.success(`Statut de ${user.email} mis à jour`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch {
      toast.error('Impossible de modifier le statut');
    }
  };

  const handleChangeRole = async (user: User, newRole: 'ADMIN' | 'MANAGER' | 'EMPLOYEE') => {
    try {
      await updateUser(user.id, { role: newRole as any }, token);
      toast.success(`Rôle de ${user.email} mis à jour vers ${newRole}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: { ...u.role, name: newRole } } : u))
      );
    } catch {
      toast.error('Impossible de modifier le rôle');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteUser(deleteTargetId, token);
      toast.success('Utilisateur supprimé avec succès');
      setUsers((prev) => prev.filter((u) => u.id !== deleteTargetId));
    } catch {
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gestion des Utilisateurs"
        description="Gérez les comptes du personnel, attribuez les rôles et permissions."
      />

      <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-[#787774]">Chargement des utilisateurs...</div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-[#787774]">Aucun utilisateur trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#EAEAEA] bg-[#FBFBFA] text-[#787774]">
                  <th className="px-4 py-3 font-semibold">Nom / Email</th>
                  <th className="px-4 py-3 font-semibold">Rôle</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Date d'inscription</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {users.map((user) => {
                  const roleName = (typeof user.role === 'string' ? user.role : user.role?.name) || 'EMPLOYEE';
                  return (
                    <tr key={user.id} className="hover:bg-[#FBFBFA] transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-[#111111]">
                          {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || 'Utilisateur'}
                        </p>
                        <p className="text-xs text-[#787774]">{user.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={roleName}
                          onChange={(e) =>
                            handleChangeRole(user, e.target.value as 'ADMIN' | 'MANAGER' | 'EMPLOYEE')
                          }
                          className="rounded-lg border border-[#EAEAEA] bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] focus:outline-none"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="EMPLOYEE">EMPLOYEE</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            user.isActive
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#787774]">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                              user.isActive
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {user.isActive ? 'Désactiver' : 'Activer'}
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(user.id)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                            title="Supprimer"
                          >
                            <FaTrash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
