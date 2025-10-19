'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumePDFDocument } from '@/components/resume/resume-pdf-document';
import { useResumeStore } from '@/store/resume-store';

export function useResumePDF() {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { resumeData, settings } = useResumeStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel any pending generation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timeoutId = setTimeout(async () => {
      if (controller.signal.aborted) return;

      try {
        setIsGenerating(true);

        const themeColors = {
          primary: settings.theme.colors.primary,
          secondary: settings.theme.colors.secondary,
          text: settings.theme.colors.text,
          accent: settings.theme.colors.accent,
          background: settings.theme.colors.background,
        };

        const pdfSettings = {
          fontSize: settings.fontSize,
          lineHeight: settings.lineHeight,
          margins: settings.margins,
        };

        if (controller.signal.aborted) return;

        const newBlob = await pdf(
          <ResumePDFDocument
            resumeData={resumeData}
            themeColors={themeColors}
            settings={pdfSettings}
          />
        ).toBlob();

        if (!controller.signal.aborted) {
          setBlob(newBlob);
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error('Cannot create PDF:', e);
          setBlob(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsGenerating(false);
        }
      }
    }, 2000); // 2 second debounce - only update after user stops typing

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [
    resumeData,
    settings.theme.colors.primary,
    settings.theme.colors.secondary,
    settings.theme.colors.text,
    settings.theme.colors.accent,
    settings.theme.colors.background,
    settings.fontSize,
    settings.lineHeight,
    settings.margins,
  ]);

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
