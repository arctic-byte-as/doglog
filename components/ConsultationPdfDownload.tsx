'use client';

import { useId, useState } from 'react';

export default function ConsultationPdfDownload({ consultationId, locale = 'en', disabled = false, compact = false, versionId, hideDescription = false }: { consultationId: string; locale?: 'en' | 'nb'; disabled?: boolean; compact?: boolean; versionId?: string; hideDescription?: boolean }) {
  const id = useId();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const nb = locale === 'nb';

  async function download() {
    setDownloading(true);
    setError('');
    try {
      const response = await fetch(`/api/consultations/${encodeURIComponent(consultationId)}/pdf?lang=${locale}${versionId ? `&version=${encodeURIComponent(versionId)}` : ''}`, { cache: 'no-store' });
      if (!response.ok || !response.headers.get('Content-Type')?.includes('application/pdf')) {
        throw new Error('PDF download failed');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = response.headers.get('Content-Disposition')?.match(/filename="([A-Za-z0-9._-]+)"/);
      link.download = filename?.[1] || 'norsepaw-consultation.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      setError(nb ? 'Kunne ikke laste ned PDF-en. Prøv igjen, eller logg inn på nytt.' : 'Could not download the PDF. Please try again, or sign in again.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-w-0 space-y-2">
      <button type="button" onClick={download} disabled={disabled || downloading} aria-describedby={id} className={`min-h-11 rounded-lg px-4 py-3 font-medium disabled:opacity-50 ${compact ? 'border border-white bg-white text-brand-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white' : 'bg-brand-700 text-white'}`}>
        {downloading ? (nb ? 'Lager PDF…' : 'Preparing PDF…') : (nb ? 'Last ned PDF' : 'Download PDF')}
      </button>
      <p id={id} className={(compact && !disabled) || hideDescription ? 'sr-only' : 'max-w-sm text-sm leading-6 text-brand-700'}>
        {disabled ? (nb ? 'Lagre endringene før du laster ned.' : 'Save your changes before downloading.') : (nb ? 'Last ned den lagrede konsultasjonen med treningsplan, vurdering og bakgrunn.' : 'Download the saved consultation, including the training plan, assessment and background.')}
      </p>
      <p role="status" className={compact ? 'sr-only' : 'text-sm leading-6'}>{downloading ? (nb ? 'Vennligst vent mens PDF-en lages.' : 'Please wait while the PDF is prepared.') : ''}</p>
      {error ? <p role="alert" className="max-w-sm text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
