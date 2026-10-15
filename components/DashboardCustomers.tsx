'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomerServicesEditor from './CustomerServicesEditor';
import CustomerCardPhoto from './CustomerCardPhoto';
import { customerServiceOptions } from '@/lib/service-options';

type DashboardCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dogs: { id: string; name: string; breed: string; profileImageUrl: string | null }[];
  services: string[];
  serviceKeys: string[];
};

export default function DashboardCustomers({ customers, contrastPreview = false }: { customers: DashboardCustomer[]; contrastPreview?: boolean }) {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<DashboardCustomer | null>(null);
  const [savedServices, setSavedServices] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState('');
  const router = useRouter();
  useEffect(() => { setSavedServices({}); }, [customers]);
  const currentCustomers = customers.map((customer) => {
    const keys = savedServices[customer.id];
    return keys ? { ...customer, serviceKeys: keys, services: keys.map((key) => customerServiceOptions.find((service) => service.key === key)?.title || key) } : customer;
  });
  const searchId = useId();
  const query = search.trim().toLocaleLowerCase();
  const visible = currentCustomers.filter((customer) =>
    [customer.name, customer.email, customer.phone || '', ...customer.dogs.flatMap((dog) => [dog.name, dog.breed]), ...customer.services]
      .join(' ').toLocaleLowerCase().includes(query),
  );

  return (
    <section id="dashboard-customers" aria-labelledby="dashboard-customers-title" className={`space-y-5 ${contrastPreview ? 'dashboard-colour-preview' : ''}`}>
      <div className="dashboard-intro flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 id="dashboard-customers-title" className="text-2xl font-semibold text-brand-950 sm:text-3xl">Customers</h1>
          <p className="dashboard-intro-copy mt-2 text-sm text-brand-700">Choose a customer to open their dogs and continue your work.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/accounts#add-customer" className="customer-add-action inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800"><span aria-hidden="true">+</span> Add customer</Link>
          <Link href="/admin/customers" className="customer-manage-action rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50">Manage customers</Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-brand-700">{contrastPreview ? 'Colour concept: Forest & lime — deeper greens, clearer contrast.' : 'Try a richer green palette for this dashboard.'}</p>
        <Link href={contrastPreview ? '/dashboard' : '/dashboard?palette=contrast'} className="font-semibold text-brand-800 underline underline-offset-4">{contrastPreview ? 'Back to current colours' : 'Preview Forest & lime'}</Link>
      </div>
      {message ? <p role="status" className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">{message}</p> : null}
      {editing ? <CustomerServicesEditor customer={editing} onClose={() => setEditing(null)} onSaved={(keys) => { setSavedServices((current) => ({ ...current, [editing.id]: keys })); setMessage(`Services and courses updated for ${editing.name}.`); setEditing(null); router.refresh(); }} /> : null}
      {customers.length ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full sm:max-w-lg">
              <label htmlFor={searchId} className="text-sm font-medium text-brand-800">Find a customer</label>
              <input id={searchId} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by customer, dog or service…" className="mt-2 w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm" />
            </div>
            <p role="status" className="text-sm text-brand-700">{visible.length} {visible.length === 1 ? 'customer' : 'customers'}{query ? ` of ${customers.length}` : ''}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((customer) => (
              <article key={customer.id} className="customer-tile group flex min-w-0 flex-col rounded-2xl border border-brand-200 bg-white p-5 shadow-sm transition hover:border-brand-500 hover:shadow-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700 sm:p-6">
                <Link href={`/dogs?customer=${encodeURIComponent(customer.id)}`} aria-label={`Open ${customer.name}'s dogs`} className="flex flex-1 flex-col rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700">
                  <CustomerCardPhoto dogs={customer.dogs} />
                  <div className="flex items-start gap-3">
                    <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-100 font-semibold text-brand-800">{customer.name.trim().split(/\s+/).slice(0, 2).map((name) => name[0]).join('').toUpperCase()}</span>
                    <div className="min-w-0">
                      <h2 className="break-words text-lg font-semibold text-brand-950">{customer.name}</h2>
                      <p className="mt-1 break-all text-sm text-brand-700">{customer.email}</p>
                      {customer.phone ? <p className="mt-1 text-sm text-brand-700">{customer.phone}</p> : null}
                    </div>
                  </div>
                  <div className="mt-5 border-t border-brand-100 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{customer.dogs.length === 1 ? 'Dog' : 'Dogs'}</p>
                    <ul className="mt-2 space-y-1 text-sm text-brand-800">{customer.dogs.map((dog) => <li key={dog.id}><span className="font-semibold">{dog.name}</span>{dog.breed ? ` · ${dog.breed}` : ''}</li>)}</ul>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {customer.services.length ? customer.services.map((service) => <span key={service} className="customer-service-badge rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800">{service}</span>) : <p className="text-xs text-brand-600">No services assigned</p>}
                  </div>
                  <span className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm font-semibold text-brand-800"><span>View {customer.dogs.length === 1 ? 'dog profile' : 'dog profiles'}</span><span aria-hidden="true" className="transition group-hover:translate-x-1">→</span></span>
                </Link>
                <button type="button" onClick={() => { setMessage(''); setEditing(customer); }} aria-haspopup="dialog" aria-label={`Edit services and courses for ${customer.name}`} className="customer-services-action mt-4 w-full rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 hover:bg-brand-100">Services &amp; courses</button>
              </article>
            ))}
          </div>
          {!visible.length ? <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-6"><p className="font-medium text-brand-950">No customers match your search.</p><p className="mt-2 text-sm text-brand-700">Try a customer name, dog name or assigned service.</p><button type="button" onClick={() => setSearch('')} className="mt-4 text-sm font-semibold text-brand-800 underline">Clear search</button></div> : null}
        </>
      ) : <div className="rounded-2xl border border-dashed border-brand-200 bg-white p-6"><h2 className="font-semibold text-brand-950">Your customers will appear here</h2><p className="mt-2 text-sm text-brand-700">Customers appear when one of their dogs is assigned to you. Add a customer or check the trainer assignment on their dog profile.</p><Link href="/admin/accounts#add-customer" className="mt-4 inline-flex rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white">Add customer</Link></div>}
    </section>
  );
}
