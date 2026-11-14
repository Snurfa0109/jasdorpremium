import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import './globals.css';
import ChatbotWidget from '@/components/ChatbotWidget';
import LiveOrderTicker from '@/components/LiveOrderTicker';

export const metadata: Metadata = {
  title: 'saoirse. – Aplikasi Premium & Antrian Transparan buat saories',
  description:
    'Ruang aman saories buat langganan Netflix, YouTube, Spotify, Canva, CapCut, ChatGPT Plus cepat dan bergaransi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#fbf9f5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Suspense fallback={null}>
          <LiveOrderTicker />
        </Suspense>
        <ChatbotWidget />
      </body>
    </html>
  );
}
