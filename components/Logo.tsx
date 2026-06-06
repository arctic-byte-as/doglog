import Image from 'next/image';
import React from 'react';

export function Logo({ className = '', subtitle = 'Trainer dashboard' }: { className?: string; subtitle?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image src="/norsepaw-symbol.png" alt="Norse Paw" width={40} height={40} className="h-10 w-10 object-contain" priority />
      <span className="hidden sm:inline-block">
        <span className="block text-sm uppercase tracking-[0.12em] text-brand-800">Norse Paw</span>
        <span className="block text-lg font-semibold text-brand-950">{subtitle}</span>
      </span>
    </div>
  );
}

export default Logo;
