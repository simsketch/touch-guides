'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import UserDropdown from '@/components/UserDropdown';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen text-black">
        {/* Header */}
        <header className="border-b">
          <div className="container width-100 px-4 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold text-green-400">Touch Guides</h1>
            <UserDropdown />
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </QueryClientProvider>
  );
} 