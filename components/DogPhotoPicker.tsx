'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cropGeometry, prepareProfilePhoto } from '@/lib/photo-crop';

const text = {
  en: { title: 'Change photo', choose: 'Choose a photo', camera: 'Take a photo', help: 'Choose a clear picture of your dog. You can adjust it before saving.', adjust: 'Drag the picture or use the controls to frame your dog.', zoom: 'Zoom', horizontal: 'Move left / right', vertical: 'Move up / down', save: 'Save photo', saving: 'Uploading and saving…', cancel: 'Cancel', different: 'Choose another photo', invalid: 'Could not open this photo. Try a JPG, PNG or screenshot.', large: 'Please choose a photo smaller than 20 MB.', error: 'Could not save the photo. Your existing picture is unchanged. Please try again.', preview: 'Circular profile photo preview', loading: 'Opening photo…' },
  nb: { title: 'Endre bilde', choose: 'Velg et bilde', camera: 'Ta et bilde', help: 'Velg et tydelig bilde av hunden din. Du kan justere det før du lagrer.', adjust: 'Dra bildet eller bruk kontrollene for å plassere hunden.', zoom: 'Zoom', horizontal: 'Flytt til venstre / høyre', vertical: 'Flytt opp / ned', save: 'Lagre bilde', saving: 'Laster opp og lagrer…', cancel: 'Avbryt', different: 'Velg et annet bilde', invalid: 'Kunne ikke åpne bildet. Prøv JPG, PNG eller et skjermbilde.', large: 'Velg et bilde som er mindre enn 20 MB.', error: 'Kunne ikke lagre bildet. Det gamle bildet er uendret. Prøv igjen.', preview: 'Forhåndsvisning av rundt profilbilde', loading: 'Åpner bildet…' },
};

export default function DogPhotoPicker({ locale = 'en', onSave, onClose }: { locale?: 'en' | 'nb'; onSave: (file: File) => Promise<void>; onClose: () => void }) {
  const t = text[locale];
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const library = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const image = useRef<HTMLImageElement | null>(null);
  const drag = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const [source, setSource] = useState<File | null>(null);
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const element = dialog.current;
    const focus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    element?.showModal(); document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = overflow; focus?.focus(); };
  }, []);
  useEffect(() => {
    if (!source) return;
    let cancelled = false;
    const url = URL.createObjectURL(source);
    const next = new Image();
    setReady(false);
    next.onload = () => { if (cancelled) return; if (!next.naturalWidth || next.naturalWidth * next.naturalHeight > 100_000_000) { setError(t.invalid); return; } image.current = next; setZoom(1); setX(0); setY(0); setReady(true); };
    next.onerror = () => { if (!cancelled) setError(t.invalid); };
    next.src = url;
    return () => { cancelled = true; URL.revokeObjectURL(url); };
  }, [source, t.invalid]);
  useEffect(() => {
    if (!ready || !canvas.current || !image.current) return;
    const context = canvas.current.getContext('2d');
    if (!context) return;
    const crop = cropGeometry(image.current.naturalWidth, image.current.naturalHeight, zoom, x, y);
    context.fillStyle = '#ffffff'; context.fillRect(0, 0, 256, 256);
    context.drawImage(image.current, crop.x, crop.y, crop.side, crop.side, 0, 0, 256, 256);
  }, [ready, zoom, x, y]);
  function choose(file?: File) {
    if (!file) return;
    setError('');
    if (file.size > 20 * 1024 * 1024) { setError(t.large); return; }
    if (!file.type.startsWith('image/') && !/\.(heic|heif|jpe?g|png|webp|gif)$/i.test(file.name)) { setError(t.invalid); return; }
    setSource(file);
  }
  async function save() {
    if (!ready || !image.current) return;
    setSaving(true); setError('');
    try { await onSave(await prepareProfilePhoto(image.current, zoom, x, y)); onClose(); }
    catch { setError(t.error); }
    finally { setSaving(false); }
  }
  return createPortal(<dialog ref={dialog} aria-labelledby={titleId} onCancel={(event) => { if (saving) event.preventDefault(); }} onClose={() => { if (dialog.current && !dialog.current.open) onClose(); }} className="fixed inset-0 m-auto max-h-[94dvh] w-[94vw] max-w-md overflow-y-auto rounded-3xl bg-white p-5 text-brand-950 backdrop:bg-black/50 sm:p-6">
    <h2 id={titleId} className="text-xl font-semibold">{t.title}</h2><p className="mt-3 text-sm leading-6">{source ? t.adjust : t.help}</p>
    <input ref={library} aria-label={t.choose} type="file" accept="image/*" className="hidden" disabled={saving} onChange={(event) => { choose(event.target.files?.[0]); event.target.value = ''; }} />
    <input ref={camera} aria-label={t.camera} type="file" accept="image/*" capture="environment" className="hidden" disabled={saving} onChange={(event) => { choose(event.target.files?.[0]); event.target.value = ''; }} />
    {!source ? <div className="mt-5 grid gap-3"><button type="button" onClick={() => library.current?.click()} className="rounded-xl bg-brand-800 px-4 py-3 font-semibold text-white">{t.choose}</button><button type="button" onClick={() => camera.current?.click()} className="rounded-xl border border-brand-200 px-4 py-3 font-semibold">{t.camera}</button></div> : <>
      {!ready ? <p role="status" className="mt-4 text-sm">{error || t.loading}</p> : <>
        <div className="relative mx-auto mt-5 aspect-square w-full max-w-64 overflow-hidden rounded-xl bg-brand-50" style={{ touchAction: 'none' }} onPointerDown={(event) => { if (saving) return; event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, y: event.clientY, startX: x, startY: y }; }} onPointerMove={(event) => { if (!drag.current || !image.current || saving) return; const crop = cropGeometry(image.current.naturalWidth, image.current.naturalHeight, zoom); const ratio = crop.side / event.currentTarget.getBoundingClientRect().width; const rangeX = (image.current.naturalWidth - crop.side) / 2, rangeY = (image.current.naturalHeight - crop.side) / 2; setX(rangeX ? Math.max(-1, Math.min(1, drag.current.startX + (event.clientX - drag.current.x) * ratio / rangeX)) : 0); setY(rangeY ? Math.max(-1, Math.min(1, drag.current.startY + (event.clientY - drag.current.y) * ratio / rangeY)) : 0); }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
          <canvas ref={canvas} width={256} height={256} role="img" aria-label={t.preview} className="block h-full w-full" /><div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full border-2 border-white shadow-[0_0_0_100px_rgba(0,0,0,0.4)]" />
        </div>
        <fieldset disabled={saving} className="mt-5 space-y-3">{[{label:t.zoom,value:zoom,min:1,max:3,set:setZoom},{label:t.horizontal,value:x,min:-1,max:1,set:setX},{label:t.vertical,value:y,min:-1,max:1,set:setY}].map((control) => <label key={control.label} className="block text-sm font-medium">{control.label}<input type="range" min={control.min} max={control.max} step="0.01" value={control.value} onChange={(event) => control.set(Number(event.target.value))} className="mt-1 block min-h-11 w-full accent-brand-800" /></label>)}</fieldset>
      </>}
      <button type="button" disabled={saving} onClick={() => library.current?.click()} className="mt-3 rounded-full border border-brand-200 px-4 py-2 text-sm disabled:opacity-50">{t.different}</button>
    </>}
    {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
    <div className="mt-5 flex flex-wrap justify-end gap-3"><button type="button" disabled={saving} onClick={onClose} className="rounded-full border border-brand-200 px-4 py-3 text-sm disabled:opacity-50">{t.cancel}</button>{ready ? <button type="button" disabled={saving} onClick={save} className="rounded-full bg-brand-800 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? t.saving : t.save}</button> : null}</div>
  </dialog>, document.body);
}
