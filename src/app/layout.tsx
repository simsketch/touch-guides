import './globals.css';
import '../styles/shared.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TouchGuides - Digital Guidebooks for Vacation Homes',
  description: 'Create and manage digital guidebooks for your vacation rental properties',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClerkProvider>
          <Providers>
            <Navbar />
            <main>{children}</main>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}