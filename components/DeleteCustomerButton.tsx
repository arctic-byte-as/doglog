"use client";

import { useState } from 'react';

export default function DeleteCustomerButton({ customerId, customerName }: { customerId: string; customerName: string }) {
  const [deleting, setDeleting] = useState(false);

  async function deleteCustomer() {
    const confirmed = window.confirm(`Delete ${customerName}'s customer account and linked dog records? This cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Could not delete customer.');
      window.location.reload();
    } catch (error: any) {
      alert(error.message || 'Could not delete customer.');
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={deleteCustomer}
      disabled={deleting}
      className="rounded-full border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-60"
    >
      {deleting ? 'Deleting...' : 'Delete customer'}
    </button>
  );
}
