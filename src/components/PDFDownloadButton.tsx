'use client';

import React from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import GuidebookDocument from './GuidebookPDF';
import type { Guidebook } from '@/types';
import { FiDownload } from 'react-icons/fi';

interface PDFDownloadButtonProps {
  guidebook: Guidebook;
}

export default function PDFDownloadButton({ guidebook }: PDFDownloadButtonProps) {
  return (
    <BlobProvider document={<GuidebookDocument guidebook={guidebook} />}>
      {({ blob, url, loading }) => (
        <a
          href={url || '#'}
          download={`${guidebook.title.toLowerCase().replace(/\s+/g, '-')}-guide.pdf`}
          className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all flex items-center space-x-2"
          onClick={(e) => !url && e.preventDefault()}
        >
          <FiDownload className="w-4 h-4" />
          <span>{loading ? 'Generating PDF...' : 'Download PDF'}</span>
        </a>
      )}
    </BlobProvider>
  );
} 