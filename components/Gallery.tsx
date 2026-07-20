'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Gallery = () => {
  const galleryImages = [
    "/Gallery/sitting-table-with-chairs-yellow-sofa-restaurant-with-panoramic-view.webp",
    "/Gallery/fashionable-feminist-african-american-woman-wear-black-tshirt-shorts-posed-restaurant-eat-cheese-cake.webp",
    "/Gallery/interior-shot-cafe-with-chairs-near-bar-with-wooden-tables.webp",
    "/Gallery/stylish-african-woman-red-shirt-hat-posed-indoor-cafe-drinking-pineapple-lemonade.webp"
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
  };

  const closeLightbox = () => {
    setActiveIndex(null);
  };

  const nextImage = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (activeIndex !== null) {
      setActiveIndex((activeIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  // Prevent body scrolling when lightbox is open
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [activeIndex]);

  return (
    <>
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-widest text-[#787774] mb-4 block">Notre galerie</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#111111]">
              Découvrez notre univers
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, idx) => (
              <div 
                key={idx} 
                className="group overflow-hidden rounded-xl aspect-square cursor-pointer"
                onClick={() => openLightbox(idx)}
              >
                <img 
                  src={image} 
                  alt={`Galerie ${idx + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Link 
              href="/gallery"
              className="px-10 py-4 bg-[#111111] text-white text-lg font-semibold rounded-lg hover:bg-[#333333] transition-colors"
            >
              Voir toute la galerie
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition-colors z-10"
          >
            <FaTimes />
          </button>

          {/* Previous Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors z-10"
          >
            <FaChevronLeft />
          </button>

          {/* Next Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors z-10"
          >
            <FaChevronRight />
          </button>

          {/* Image */}
          <img 
            src={galleryImages[activeIndex]} 
            alt={`Galerie ${activeIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-lg">
            {activeIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;