"use client";

import { useState } from 'react';
import { customerServiceOptions } from '@/lib/service-options';

export default function CustomerServiceAccessForm({
  customerId,
  enabledServices,
}: {
  customerId: string;
  enabledServices: string[];
}) {
  const [selected, setSelected] = useState(new Set(enabledServices));
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function toggle(serviceKey: string) {
    const next = new Set(selected);
    if (next.has(serviceKey)) next.delete(serviceKey);
    else next.add(serviceKey);

    setSelected(next);
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(`/api/admin/customers/${customerId}/services`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: Array.from(next) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Could not update services.');
      setMessage('Services updated');
    } catch (error: any) {
      setSelected(new Set(enabledServices));
      setMessage(error.message || 'Could not update services.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase text-brand-600">Customer services</p>
      <div className="flex flex-wrap gap-2">
        {customerServiceOptions.map((service) => (
          <label key={service.key} className="flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-800">
            <input
              type="checkbox"
              checked={selected.has(service.key)}
              disabled={saving}
              onChange={() => toggle(service.key)}
            />
            <span className="font-medium">{service.title}</span>
          </label>
        ))}
      </div>
      {message ? <p className="text-sm text-brand-700">{message}</p> : null}
    </div>
  );
}
