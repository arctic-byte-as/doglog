'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import SignOutMenuButton from './SignOutMenuButton';

type Item = { href: string; label: string };

function MenuIcon({ href }: { href?: string }) {
  const path = href === '/calendar'
    ? 'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z'
    : href?.includes('services')
      ? 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z'
      : href?.includes('plan')
        ? 'm4 6 2 2 4-4m3 2h7M4 14l2 2 4-4m3 2h7M4 21h16'
        : href === '/dashboard'
          ? 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m8-7.87a4 4 0 0 1 0 7.75'
          : href ? 'm3 10 9-7 9 7v11h-6v-7H9v7H3Z' : 'M4 6h16M4 12h16M4 18h16';
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0"><path d={path} /></svg>;
}

export default function MobileNavigation({ items, customer = false, menuLabel = 'More', signOutLabel = 'Sign out' }: { items: Item[]; customer?: boolean; menuLabel?: string; signOutLabel?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const primary = items.filter((item) => (customer ? ['/customer', '/customer/services', '/customer/plan'] : ['/dashboard', '/calendar', '/services']).includes(item.href));
  const secondary = items.filter((item) => !primary.includes(item));
  const active = (href: string) => pathname === href || (href !== '/customer' && pathname.startsWith(href + '/'));
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    const triggerElement = trigger.current;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    const closeOnDesktop = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', closeOnDesktop);
    return () => { element?.close(); document.body.style.overflow = previousOverflow; window.removeEventListener('resize', closeOnDesktop); triggerElement?.focus(); };
  }, [open]);

  return (
    <>
      <nav aria-label="Mobile navigation" className="mobile-floating-nav fixed z-40 grid grid-cols-4 gap-1 rounded-2xl border border-brand-200 bg-white p-2 shadow-xl md:hidden">
        {primary.map((item) => <Link key={item.href} href={item.href} aria-current={active(item.href) ? 'page' : undefined} className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-center text-xs font-semibold ${active(item.href) ? 'bg-brand-100 text-brand-950' : 'text-brand-800 hover:bg-brand-50'}`}><MenuIcon href={item.href} /><span>{item.label}</span></Link>)}
        <button ref={trigger} type="button" aria-label={menuLabel} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold ${secondary.some((item) => active(item.href)) ? 'bg-brand-100 text-brand-950' : 'text-brand-800 hover:bg-brand-50'}`}><MenuIcon /><span>{menuLabel}</span></button>
      </nav>
      {open ? <dialog ref={dialog} aria-labelledby={titleId} onCancel={() => setOpen(false)} onClose={() => { if (dialog.current && !dialog.current.open) setOpen(false); }} onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }} className="mobile-menu-sheet fixed m-0 w-full max-w-none overflow-y-auto rounded-t-3xl border border-brand-200 bg-white p-5 text-brand-950 shadow-xl backdrop:bg-black/40">
        <div className="mb-4 flex items-center justify-between gap-4"><h2 id={titleId} className="text-lg font-semibold">{menuLabel}</h2><button type="button" autoFocus onClick={() => setOpen(false)} className="rounded-xl border border-brand-200 px-4 py-2 text-sm">Close</button></div>
        <nav aria-label={menuLabel} className="grid gap-2">{items.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active(item.href) ? 'page' : undefined} className={`rounded-xl px-4 py-3 text-sm font-medium ${active(item.href) ? 'bg-brand-100 text-brand-950' : 'text-brand-800 hover:bg-brand-50'}`}>{item.label}</Link>)}<SignOutMenuButton label={signOutLabel} className="mt-2 rounded-xl border border-brand-200 px-4 py-3 text-left text-sm text-brand-800" /></nav>
      </dialog> : null}
    </>
  );
}
