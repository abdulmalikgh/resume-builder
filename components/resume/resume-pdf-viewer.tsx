'use client';

import { useEffect, useState, memo, useRef, useCallback } from 'react';
import { DoubleBufferedPDF } from './double-buffered-pdf';

type Props = {
  blob: Blob | null;
  scale?: number;
};

function PDFIframe({
  pdfUrl,
  scale,
  onLoad,
  'data-ready': dataReady
}: {
  pdfUrl: string;
  scale: number;
  onLoad: () => void;
  'data-ready'?: string;
}) {
  const isReady = dataReady === 'true';
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Trigger onLoad after a brief delay if iframe is already loaded
    const timer = setTimeout(() => {
      if (iframeRef.current && !isReady) {
        console.log('PDF iframe loaded, triggering onLoad');
        onLoad();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pdfUrl, onLoad, isReady]);

  // Force reload on window resize
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setRefreshKey(prev => prev + 1);
      }, 300); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div
      style={{
        position: isReady ? 'relative' : 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        opacity: isReady ? 1 : 0,
        pointerEvents: isReady ? 'auto' : 'none',
        zIndex: isReady ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
      }}
      className="flex items-start justify-center p-4 overflow-auto"
    >
      <div
        className="bg-white shadow-2xl"
        style={{
          width: `${21 * scale}cm`,
          maxWidth: '100%',
          minHeight: `${29.7 * scale}cm`,
        }}
      >
        <iframe
          key={refreshKey}
          ref={iframeRef}
          src={`${pdfUrl}#view=FitH`}
          className="w-full h-full border-0"
          style={{
            minHeight: `${29.7 * scale}cm`,
          }}
          title="Resume PDF Preview"
          onLoad={() => {
            console.log('iframe onLoad fired for:', pdfUrl);
            onLoad();
          }}
        />
      </div>
    </div>
  );
}

export const ResumePDFViewer = memo(function ResumePDFViewer({ blob, scale = 1 }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (blob) {
      // Revoke previous URL to avoid memory leaks
      if (previousUrlRef.current && previousUrlRef.current !== pdfUrl) {
        URL.revokeObjectURL(previousUrlRef.current);
      }

      // Create new object URL
      const url = URL.createObjectURL(blob);
      previousUrlRef.current = url;
      setPdfUrl(url);
    }
  }, [blob]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  const render = useCallback(
    (onSuccess: () => void) =>
      pdfUrl ? (
        <PDFIframe
          pdfUrl={pdfUrl}
          scale={scale}
          onLoad={onSuccess}
        />
      ) : null,
    [pdfUrl, scale]
  );

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
      <DoubleBufferedPDF render={render} />
    </div>
  );
});
