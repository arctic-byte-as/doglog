import Link from 'next/link';

export default function BackToDashboardLink() {
  return (
    <Link href="/dashboard" className="inline-flex rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800">
      Back to dashboard
    </Link>
  );
}
