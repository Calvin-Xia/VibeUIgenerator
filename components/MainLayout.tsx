'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibeStore, createActions } from '@/lib/store/vibeStore';
import { InspectorPanel } from '@/components/inspector/InspectorPanel';
import { PreviewCanvas } from '@/components/preview/PreviewCanvas';
import { OutputPanel } from '@/components/output/OutputPanel';
import { PresetPanel } from '@/components/presets/PresetPanel';
import { useHydrated } from '@/lib/utils';
import { Settings2, Eye, Code2, LayoutGrid } from 'lucide-react';

export function MainLayout() {
  const ui = useVibeStore(state => state.ui);
  const tokens = useVibeStore(state => state.tokens);
  const initialized = useVibeStore(state => state.ui.initialized);
  const hydrated = useHydrated();
  
  const actions = useMemo(() => 
    createActions(
      (fn) => useVibeStore.setState(fn),
      () => useVibeStore.getState()
    ),
  []);

  const tabs = [
    { id: 'inspector', label: 'Inspector', icon: Settings2 },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'code', label: 'Code', icon: Code2 }
  ] as const;

  if (!hydrated || !initialized) return null;

  return (
    <div className="flex flex-1 overflow-hidden">
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        className="hidden lg:flex w-80 flex-col border-r bg-card overflow-y-auto vibe-scroll"
      >
        <InspectorPanel />
      </motion.aside>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b bg-background/50 px-4 py-2 lg:hidden">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => actions.setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                ui.activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {ui.activeTab === 'inspector' && (
              <motion.div
                key="inspector"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full flex-shrink-0 overflow-hidden lg:hidden"
              >
                <InspectorPanel />
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`flex-1 overflow-hidden ${ui.activeTab !== 'preview' ? 'hidden lg:flex' : 'flex'}`}>
            <PreviewCanvas />
          </div>

          <AnimatePresence mode="wait">
            {ui.activeTab === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 overflow-hidden lg:w-96 lg:border-l"
              >
                <OutputPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <motion.aside
        initial={{ x: 320 }}
        animate={{ x: 0 }}
        className="hidden lg:flex w-80 flex-col border-l bg-card overflow-y-auto vibe-scroll"
      >
        <PresetPanel />
      </motion.aside>
    </div>
  );
}
