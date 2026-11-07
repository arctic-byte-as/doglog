'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function TrainingPlanCustomerSelect({ customers, selectedCustomerId }: { customers: { id: string; name: string }[]; selectedCustomerId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <div className="space-y-2" aria-busy={pending}>
    <label className="block text-sm font-semibold">Customer
      <select value={selectedCustomerId} disabled={pending} onChange={(event) => {
        const id = event.target.value;
        startTransition(() => router.push(id ? `/services/tailored-training-plan?customerId=${encodeURIComponent(id)}` : '/services/tailored-training-plan'));
      }} className="mt-1 block min-h-11 w-full rounded-xl border border-brand-200 bg-white px-3 py-2 disabled:opacity-60">
        <option value="">Select a customer to create or manage their plan</option>
        {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
      </select>
    </label>
    <p className="text-sm text-brand-700" role="status">{pending ? 'Loading the selected customer’s plan…' : 'Selecting a customer opens their plan automatically.'}</p>
  </div>;
}
