import React from 'react';

export function Logo({ className = '', subtitle = 'Trainer dashboard' }: { className?: string; subtitle?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src="/norsepaw-symbol.png" alt="Norse Paw" className="w-10 h-10 object-contain" />
      <span className="hidden sm:inline-block">
        <span className="block text-sm uppercase tracking-[0.12em] text-brand-600">Norse Paw</span>
        <span className="block text-lg font-semibold text-brand-950">{subtitle}</span>
      </span>
    </div>
  );
}

export default Logo;
