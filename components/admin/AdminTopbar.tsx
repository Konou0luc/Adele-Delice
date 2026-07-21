'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { FaUserCircle, FaBell } from 'react-icons/fa';

const AdminTopbar = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm p-4 lg:p-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-[#111111]">
          Bonjour, {session?.user?.name || 'Admin'} 👋
        </h2>
        <p className="text-[#787774] text-sm mt-1">
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-[#787774] hover:text-[#111111] transition-colors">
          <FaBell className="text-xl" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white">
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
