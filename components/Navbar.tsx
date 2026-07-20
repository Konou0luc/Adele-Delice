'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "À propos", href: isHome ? "#about" : "/#about" },
    { name: "Menu", href: "/menu" },
    { name: "Galerie", href: "/gallery" },
    { name: "Réservation", href: isHome ? "#reservation" : "/#reservation" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${(!isHome || scrolled) ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center z-[61]">
            <img 
              src="/logo-small.webp" 
              alt="Adèle Délice" 
              className="h-12"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`font-medium transition-colors ${(!isHome || scrolled) ? 'text-[#111111] hover:text-gray-600' : 'text-white hover:text-white/80'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/account"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${(!isHome || scrolled) ? 'bg-[#F7F6F3] text-[#111111] hover:bg-gray-200' : 'bg-white/20 text-white hover:bg-white/30'}`}
            >
              <FaUser />
            </Link>
            <Link 
              href={isHome ? "#reservation" : "/#reservation"} 
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${(!isHome || scrolled) ? 'bg-[#111111] text-white hover:bg-[#333333]' : 'bg-white text-[#111111] hover:bg-gray-100'}`}
            >
              Commander
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden z-[61] p-2 cursor-pointer ${(!isHome || scrolled) ? 'text-[#111111]' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 py-4 bg-white rounded-xl shadow-lg z-[60]">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="block px-4 py-3 text-[#111111] font-medium hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/account"
              className="flex items-center gap-3 px-4 py-3 text-[#111111] font-medium hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUser />
              Mon Compte
            </Link>
            <Link 
              href={isHome ? "#reservation" : "/#reservation"} 
              className="block mx-4 mt-2 px-4 py-3 bg-[#111111] text-white text-center font-semibold rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Commander
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;