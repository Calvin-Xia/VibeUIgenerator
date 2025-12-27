'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibeStore, createActions } from '@/lib/store/vibeStore';
import { loadPresets, getPresetById } from '@/lib/presets/builtIn';
import { toast } from '@/components/ui/use-toast';
import { ExportModal } from '@/components/output/ExportModal';
import { useHydrated } from '@/lib/utils';
import {
  Sun,
  Moon,
  Share2,
  Download,
  Shuffle,
  Save,
  Palette,
  ChevronDown,
  Wand2,
  Code2,
  Menu,
  X
} from 'lucide-react';

export function TopBar() {
  const tokens = useVibeStore(state => state.tokens);
  const presets = useVibeStore(state => state.presets);
  const version = useVibeStore(state => state.ui.version);
  
  const actions = useMemo(() => 
    createActions(
      (fn) => useVibeStore.setState(fn),
      () => useVibeStore.getState()
    ),
  []);
  
  const [showPresets, setShowPresets] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const hydrated = useHydrated();

  const copyShareLink = async () => {
    const url = actions.getShareURL();
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied!', description: 'Share URL copied to clipboard' });
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' });
    }
  };

  const handleRandomize = () => {
    actions.randomize();
    toast({ title: 'Randomized!', description: 'New random vibe generated' });
  };

  const handlePresetClick = (presetId: string) => {
    const preset = getPresetById(presetId);
    if (preset) {
      actions.applyPreset(preset);
      toast({ title: `Applied: ${preset.name}`, description: preset.description });
    }
    setShowPresets(false);
  };

  const builtInPresets = (presets.builtIn && presets.builtIn.length > 0) ? presets.builtIn : loadPresets();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Palette className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight">VibeUI Generator</span>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <button
          onClick={handleRandomize}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80"
        >
          <Wand2 className="h-4 w-4" />
          Randomize
        </button>

        <div className="relative">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80"
          >
            <Save className="h-4 w-4" />
            Presets
            <ChevronDown className="h-3 w-3" />
          </button>

          {hydrated && (
            <AnimatePresence>
              {showPresets && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowPresets(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border bg-card shadow-lg"
                  >
                    <div className="max-h-80 overflow-y-auto p-2 vibe-scroll">
                      <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">Built-in</div>
                      {builtInPresets.map(preset => (
                        <button
                          key={preset.id}
                          onClick={() => handlePresetClick(preset.id)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary"
                        >
                          <div
                            className="h-6 w-6 rounded border"
                            style={{
                              background: preset.tokens.theme.palette.accent,
                              borderColor: preset.tokens.theme.palette.border
                            }}
                          />
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          )}
        </div>

        <button
          onClick={copyShareLink}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>

        <button
          onClick={() => setShowExportModal(true)}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Code2 className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-secondary md:hidden"
        >
          {showMobileMenu ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={() => actions.setToken('theme.mode', tokens.theme.mode === 'light' ? 'dark' : 'light')}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors hover:bg-secondary"
        >
          {tokens.theme.mode === 'light' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>

      {hydrated && createPortal(
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />,
        document.body
      )}

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-14 z-50 border-b bg-card shadow-lg md:hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              <button
                onClick={() => {
                  handleRandomize();
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                <Wand2 className="h-4 w-4" />
                Randomize
              </button>
              <button
                onClick={() => {
                  copyShareLink();
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button
                onClick={() => {
                  setShowExportModal(true);
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground"
              >
                <Code2 className="h-4 w-4" />
                Export Code
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
