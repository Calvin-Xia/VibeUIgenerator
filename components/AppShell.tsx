'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVibeStore } from '@/lib/store/vibeStore';
import { TopBar } from './TopBar';
import { MainLayout } from './MainLayout';
import { useHydrated } from '@/lib/utils';

function AppContent() {
  const ui = useVibeStore(state => state.ui);
  const tokens = useVibeStore(state => state.tokens);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <TopBar />
      <MainLayout />
    </div>
  );
}

export function AppShell() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading VibeUI Generator...</p>
        </div>
      </div>
    );
  }

  return <AppContent />;
}
