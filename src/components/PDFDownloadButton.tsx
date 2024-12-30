'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import GuidebookDocument from './GuidebookPDF';
import type { Guidebook } from '@/types';
import type { BlobProvider } from '@react-pdf/renderer';

type RenderProps = Parameters<BlobProvider['props']['children']>[0];

export default function PDFDownloadButton({ guidebook }: { guidebook: Guidebook }) {
  return (
    <PDFDownloadLink
      document={<GuidebookDocument guidebook={guidebook} />}
      fileName={`${guidebook.title.toLowerCase().replace(/\s+/g, '-')}-guide.pdf`}
    >
      {(renderProps: RenderProps) => (
        <button 
          className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all flex items-center space-x-2"
          disabled={renderProps.loading}
        >
          {renderProps.loading ? (
            <>
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <DocumentArrowDownIcon className="w-5 h-5" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
} 