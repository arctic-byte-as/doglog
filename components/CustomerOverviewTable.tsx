"use client";

import { useMemo, useState } from 'react';

type CustomerOverviewRow = {
  name: string;
  email: string;
  phone: string;
  dogs: string;
  breeds: string;
  services: string;
};

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'dogs', label: 'Dog name(s)' },
  { key: 'breeds', label: 'Dog breed(s)' },
  { key: 'services', label: 'Services' },
] as const;

function toTsv(rows: CustomerOverviewRow[]) {
  const header = columns.map((column) => column.label).join('\t');
  const body = rows.map((row) => columns.map((column) => row[column.key].replace(/\s+/g, ' ').trim()).join('\t'));
  return [header, ...body].join('\n');
}

export default function CustomerOverviewTable({ rows }: { rows: CustomerOverviewRow[] }) {
  const [message, setMessage] = useState('');
  const tableText = useMemo(() => toTsv(rows), [rows]);

  async function copyRows(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(successMessage);
    } catch {
      setMessage('Could not copy automatically. Please select the table and copy manually.');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-brand-700">{rows.length} customers</p>
        <button
          type="button"
          onClick={() => copyRows(tableText, 'Copied customer overview.')}
          className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
        >
          Copy table
        </button>
      </div>

      {message ? <p className="rounded-lg border border-brand-200 bg-white px-4 py-3 text-sm text-brand-700">{message}</p> : null}

      <div className="overflow-x-auto rounded-lg border border-brand-200 bg-white">
        <table className="min-w-[850px] w-full border-collapse text-left text-sm">
          <thead className="bg-brand-50 text-xs uppercase text-brand-600">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="border-b border-brand-200 px-4 py-3 font-semibold">
                  {column.label}
                </th>
              ))}
              <th className="border-b border-brand-200 px-4 py-3 font-semibold">Copy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {rows.map((row) => (
              <tr key={row.email} className="align-top">
                {columns.map((column) => (
                  <td key={column.key} className="max-w-[260px] px-4 py-3 text-brand-800">
                    {row[column.key] || '-'}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => copyRows(toTsv([row]), `Copied ${row.name}.`)}
                    className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
                  >
                    Copy row
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
