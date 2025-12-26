'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVibeStore } from '@/lib/store/vibeStore';
import { TopBar } from './TopBar';
import { MainLayout } from './MainLayout';

export function AppShell() {
  const ui = useVibeStore(state => state.ui);
  const tokens = useVibeStore(state => state.tokens);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <TopBar />
      <MainLayout />
    </div>
  );
}
