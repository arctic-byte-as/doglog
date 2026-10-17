'use client';

import Link from 'next/link';
import SignOutMenuButton from './SignOutMenuButton';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

type Item = { href: string; label: string };

function MenuIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-6 w-6"><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
}

export default function MobileNavigation({ items, menuLabel = 'Menu', signOutLabel = 'Log out' }: { items: Item[]; menuLabel?: string; signOutLabel?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const active = (href: string) => pathname === href || (href !== '/customer' && pathname.startsWith(href + '/'));
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    const triggerElement = trigger.current;
    element?.showModal();
    // Warm route shells while the user chooses; loading.tsx keeps this bounded.
    items.filter((item) => item.href !== pathname).forEach((item) => router.prefetch(item.href));
    document.body.style.overflow = 'hidden';
    const closeOnDesktop = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', closeOnDesktop);
    return () => { element?.close(); document.body.style.overflow = previousOverflow; window.removeEventListener('resize', closeOnDesktop); triggerElement?.focus(); };
  }, [open, pathname, router, items]);

  return (
    <>
      <nav aria-label="Mobile navigation" className="mobile-floating-nav fixed z-40 md:hidden">
        <button ref={trigger} type="button" aria-label={menuLabel} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? titleId + '-panel' : undefined} onClick={() => setOpen(true)} className="touch-manipulation flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/30 bg-brand-800 px-5 py-4 text-sm font-semibold text-white shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700"><MenuIcon /><span>{menuLabel}</span></button>
      </nav>
      {open ? <dialog ref={dialog} id={titleId + '-panel'} aria-labelledby={titleId} onCancel={() => setOpen(false)} onClose={() => { if (dialog.current && !dialog.current.open) setOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }} className="mobile-menu-sheet fixed m-0 w-full max-w-none overflow-y-auto rounded-3xl border border-brand-200 bg-white p-5 text-brand-950 shadow-xl backdrop:bg-black/40">
        <div className="mb-4 flex items-center justify-between gap-4"><h2 id={titleId} className="text-lg font-semibold">{menuLabel}</h2><button type="button" autoFocus onClick={() => setOpen(false)} className="rounded-xl border border-brand-200 px-4 py-2 text-sm">Close</button></div>
        <nav aria-label={menuLabel} className="grid gap-2">{items.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active(item.href) ? 'page' : undefined} className={`touch-manipulation min-h-11 rounded-xl px-4 py-3 text-sm font-medium ${active(item.href) ? 'bg-brand-100 text-brand-950' : 'text-brand-800 hover:bg-brand-50'}`}>{item.label}</Link>)}<SignOutMenuButton label={signOutLabel} className="mt-2 min-h-11 rounded-xl border border-brand-200 px-4 py-3 text-left text-sm font-semibold text-brand-800" /></nav>
      </dialog> : null}
    </>
  );
}
