'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumePDFDocument } from '@/components/resume/resume-pdf-document';
import { useResumeStore } from '@/store/resume-store';

// Debounced queue for PDF rendering
function createDebouncedQueue<T>(
  callback: (items: Array<T>) => Promise<void>,
  delay = 500
) {
  let items: Array<T> = [];
  let timeoutId: NodeJS.Timeout | null = null;
  let isProcessing = false;

  function push(item: T) {
    items.push(item);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      if (isProcessing) return;

      isProcessing = true;
      const chunk = [...items];
      items = [];

      await callback(chunk);
      isProcessing = false;

      // Process remaining items if any were added during processing
      if (items.length > 0) {
        push(items[0]);
        items = items.slice(1);
      }
    }, delay);
  }

  return { push };
}

export function useResumePDF() {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { resumeData, settings } = useResumeStore();
  const settingsRef = useRef(settings);

  // Update settings ref when settings change
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const queueRef = useRef(
    createDebouncedQueue(async (updates: Array<typeof resumeData>) => {
      const lastUpdate = updates[updates.length - 1];

      if (!lastUpdate) {
        setBlob(null);
        setIsGenerating(false);
        return;
      }

      try {
        setIsGenerating(true);
        const themeColors = {
          primary: settingsRef.current.theme.colors.primary,
          secondary: settingsRef.current.theme.colors.secondary,
          text: settingsRef.current.theme.colors.text,
          accent: settingsRef.current.theme.colors.accent,
          background: settingsRef.current.theme.colors.background,
        };

        const newBlob = await pdf(
          <ResumePDFDocument resumeData={lastUpdate} themeColors={themeColors} />
        ).toBlob();

        setBlob(newBlob);
      } catch (e) {
        console.error('Cannot create PDF:', e);
        setBlob(null);
      } finally {
        setIsGenerating(false);
      }
    }, 300)
  );

  useEffect(() => {
    queueRef.current.push(resumeData);
  }, [resumeData, settings.theme.colors]);

  const downloadPDF = useCallback(async () => {
    if (!blob) return;

    const fileName = resumeData.personalInfo.fullName
      ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      : 'Resume.pdf';

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [blob, resumeData.personalInfo.fullName]);

  return { blob, isGenerating, downloadPDF };
}
