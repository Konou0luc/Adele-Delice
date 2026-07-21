'use client';

import Link from 'next/link';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  backHref: string;
  breadcrumb?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  backHref,
  breadcrumb,
  meta,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-3 text-sm text-[#787774]">
          <Link href={backHref} className="inline-flex items-center gap-2 hover:text-[#111111] transition-colors">
            <FaArrowLeft />
            Retour
          </Link>
          {breadcrumb ? <span>/ {breadcrumb}</span> : null}
        </div>
        <h1 className="text-3xl font-bold text-[#111111]">{title}</h1>
        {description ? <p className="text-[#787774]">{description}</p> : null}
        {meta ? <div className="flex flex-wrap gap-2 pt-1">{meta}</div> : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
