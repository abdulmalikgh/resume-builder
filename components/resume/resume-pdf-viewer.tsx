'use client';

import { useEffect, useState, memo } from 'react';

type Props = {
  blob: Blob | null;
  scale?: number;
};

export const ResumePDFViewer = memo(function ResumePDFViewer({ blob, scale = 1 }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (blob) {
      // Revoke previous URL to avoid memory leaks
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      // Create new object URL
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      // Cleanup on unmount
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [blob]);

  if (!blob || !pdfUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100">
        <div className="text-slate-500 text-center">
          <p>Generating PDF preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-slate-200">
      <div className="w-full h-full flex items-start justify-center p-4">
        <div
          className="bg-white shadow-2xl"
          style={{
            width: `${21 * scale}cm`,
            minHeight: `${29.7 * scale}cm`,
          }}
        >
          <iframe
            src={`${pdfUrl}#view=FitH`}
            className="w-full h-full border-0"
            style={{
              minHeight: `${29.7 * scale}cm`,
            }}
            title="Resume PDF Preview"
          />
        </div>
      </div>
    </div>
  );
});
