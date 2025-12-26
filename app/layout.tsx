import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeModeObserver } from '@/components/ThemeModeObserver';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'VibeUI Generator - Create Beautiful CSS Components',
  description: 'Generate beautiful button and card styles with real-time visual controls. Export CSS, Tailwind, and HTML.',
  keywords: ['css', 'generator', 'tailwind', 'ui', 'button', 'card', 'components'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeModeObserver />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
