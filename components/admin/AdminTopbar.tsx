'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { FaUserCircle, FaBell } from 'react-icons/fa';

const AdminTopbar = () => {
  const { data: session } = useSession();

  return (
    <header className="flex min-w-0 items-center justify-between gap-3 bg-white p-4 pl-20 shadow-sm lg:p-6">
      <div className="min-w-0">
        <h2 className="truncate text-base font-semibold text-[#111111] sm:text-xl">
          Bonjour, {session?.user?.name || 'Admin'} 👋
        </h2>
        <p className="mt-1 truncate text-xs text-[#787774] sm:text-sm">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button aria-label="Voir les notifications" className="p-2 text-[#787774] transition-colors hover:text-[#111111]">
          <FaBell className="text-xl" />
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#111111] text-white sm:h-10 sm:w-10">
            <FaUserCircle className="text-2xl" />
          </div>
          <div className="hidden md:block">
            <p className="font-medium text-[#111111]">{session?.user?.email}</p>
            <p className="text-xs text-[#787774]">Administrateur</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
