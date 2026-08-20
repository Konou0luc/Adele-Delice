'use client';
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 px-6 py-4 sm:flex-row">
      <div className="text-sm text-[#787774]">
        Page <span className="font-medium text-[#111111]">{currentPage}</span> sur{' '}
        <span className="font-medium text-[#111111]">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-[#111111] transition-colors hover:bg-[#F7F6F3] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Page précédente"
        >
          <FaChevronLeft className="text-sm" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...' || isLoading}
              className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-[#111111] text-white'
                  : page === '...'
                    ? 'cursor-default text-[#787774]'
                    : 'border border-gray-200 text-[#111111] hover:bg-[#F7F6F3] disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
              aria-label={typeof page === 'number' ? `Page ${page}` : undefined}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-[#111111] transition-colors hover:bg-[#F7F6F3] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Page suivante"
        >
          <FaChevronRight className="text-sm" />
        </button>
      </div>
    </div>
  );
}
