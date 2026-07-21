'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome,
  FaUtensils,
  FaClipboardList,
  FaCalendarAlt,
  FaImages,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { signOut } from 'next-auth/react';

const AdminSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Tableau de bord', href: '/admin', icon: FaHome },
    { name: 'Catégories', href: '/admin/categories', icon: FaUtensils },
    { name: 'Plats', href: '/admin/dishes', icon: FaUtensils },
    { name: 'Menus', href: '/admin/menus', icon: FaClipboardList },
    { name: 'Commandes', href: '/admin/orders', icon: FaClipboardList },
    { name: 'Réservations', href: '/admin/reservations', icon: FaCalendarAlt },
    { name: 'Galerie', href: '/admin/gallery', icon: FaImages },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-[#111111] text-white rounded-lg lg:hidden"
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#111111] text-white transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-small.webp" alt="Adèle Délice" className="h-10" />
          <h1 className="text-xl font-bold">Adèle Délice</h1>
        </div>

        <nav className="mt-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-6 py-4 transition-colors ${
                  isActive ? 'bg-white/10 border-l-4 border-white' : 'hover:bg-white/5'
                }`}
              >
                <Icon />
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span className="font-medium">Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
