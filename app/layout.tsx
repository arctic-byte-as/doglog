import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'doglog • Trainer dashboard',
  description: 'Prototype for dog behaviour logging and consultation management.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
