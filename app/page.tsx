'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/AppShell';
import { useVibeStore, createActions } from '@/lib/store/vibeStore';
import { decodeFromURL } from '@/lib/generator/normalize';
import { loadPresets } from '@/lib/presets/builtIn';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const searchParams = useSearchParams();
  const initialized = useVibeStore((state) => state.ui.initialized);
  const ui = useVibeStore((state) => state.ui);
  
  const actions = useMemo(() => 
    createActions(
      (fn) => useVibeStore.setState(fn),
      () => useVibeStore.getState()
    ),
  []);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const encoded = searchParams.get('s');
        if (encoded) {
          const decoded = decodeFromURL(encoded);
          if (decoded) {
            actions.loadFromURL(decoded);
          }
        }
        const presets = useVibeStore.getState().presets;
        if (!presets.builtIn || presets.builtIn.length === 0) {
          presets.setBuiltIn(loadPresets());
        }
      } catch (error) {
        console.error('Failed to initialize:', error);
      } finally {
        setLoading(false);
        useVibeStore.setState((state) => ({ ui: { ...state.ui, initialized: true } }));
      }
    };
    init();
  }, [searchParams, actions]);

  if (!initialized || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading VibeUI Generator...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app-shell"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="h-screen w-full overflow-hidden"
      >
        <AppShell />
      </motion.div>
    </AnimatePresence>
  );
}
