import type { Metadata } from 'next';
import '@/app/globals.css';
import { Providers } from '@/components/layout/providers';
import { ClientLayout } from '@/components/layout/client-layout';

export const metadata: Metadata = {
  title: 'RepoScout — Scout your next open-source contribution',
  description:
    'Discover GitHub repositories and issues that match your skills, experience, and interests. Deterministic match ranking for open-source contributors.',
  keywords: [
    'Open Source',
    'GitHub',
    'Good First Issue',
    'Developer Tool',
    'RepoScout',
    'Open Source Discovery',
  ],
  authors: [{ name: 'RepoScout Team' }],
  openGraph: {
    title: 'RepoScout — Open-Source Contribution Discovery',
    description: 'Discover repositories and issues that match your skills with our deterministic match engine.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth bg-white text-black" data-theme="light">
      <body className="bg-white text-black min-h-screen flex flex-col antialiased selection:bg-black selection:text-white">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
