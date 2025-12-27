'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibeStore, createActions } from '@/lib/store/vibeStore';
import { toast } from '@/components/ui/use-toast';
import { Save, Heart, Trash2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PresetCardProps {
  preset: {
    id: string;
    name: string;
    description?: string;
    tokens: {
      theme: {
        palette: {
          accent: string;
          bg: string;
        };
      };
    };
  };
  isFavorite: boolean;
  onApply: () => void;
  onToggleFavorite: () => void;
  onDelete?: () => void;
  isBuiltIn?: boolean;
}

function PresetCard({ preset, isFavorite, onApply, onToggleFavorite, onDelete, isBuiltIn }: PresetCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
    >
      <button
        onClick={onApply}
        className="w-full text-left"
      >
        <div
          className="h-16 w-full"
          style={{
            background: `linear-gradient(135deg, ${preset.tokens.theme.palette.accent}40, ${preset.tokens.theme.palette.bg})`
          }}
        />
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium truncate">{preset.name}</h3>
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleFavorite();
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`rounded p-1 transition-colors cursor-pointer ${
                isFavorite
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </div>
          </div>
          {preset.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {preset.description}
            </p>
          )}
        </div>
      </button>

      {!isBuiltIn && onDelete && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowDeleteConfirm(true);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          className="absolute right-2 top-2 rounded bg-background/80 p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
        >
          <Trash2 className="h-3 w-3" />
        </div>
      )}

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Preset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{preset.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete?.();
                setShowDeleteConfirm(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export function PresetPanel() {
  const tokens = useVibeStore(state => state.tokens);
  const presets = useVibeStore(state => state.presets);
  
  const actions = useMemo(() => 
    createActions(
      (fn) => useVibeStore.setState(fn),
      () => useVibeStore.getState()
    ),
  []);
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [activeTab, setActiveTab] = useState<'built-in' | 'saved' | 'favorites'>('built-in');

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast({ title: 'Please enter a name', variant: 'destructive' });
      return;
    }

    const newPreset = {
      id: `preset-${Date.now()}`,
      name: presetName,
      description: 'Custom preset',
      tags: ['custom'],
      tokens: JSON.parse(JSON.stringify(tokens)),
      isBuiltIn: false,
      createdAt: Date.now()
    };

    actions.addSavedPreset(newPreset);
    toast({ title: 'Preset saved!', description: `"${presetName}" has been saved` });
    setShowSaveDialog(false);
    setPresetName('');
  };

  const filteredPresets = {
    'built-in': presets.builtIn || [],
    'saved': (presets.saved || []).filter(p => !(presets.favorites || []).includes(p.id)),
    'favorites': ((presets.builtIn || []) as any[]).filter(p => (presets.favorites || []).includes(p.id)).concat(
      (presets.saved || []).filter(p => (presets.favorites || []).includes(p.id))
    )
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Presets</h2>
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Save
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Preset</DialogTitle>
                <DialogDescription>
                  Give your current configuration a name to save it for later.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="My awesome preset"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSavePreset}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border-b bg-muted/30 px-2 py-2">
        <div className="flex items-center gap-1">
          {(['built-in', 'saved', 'favorites'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 vibe-scroll">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredPresets[activeTab].map(preset => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isFavorite={actions.isFavorite(preset.id)}
                isBuiltIn={preset.isBuiltIn}
                onApply={() => {
                  actions.applyPreset(preset);
                  toast({ title: `Applied: ${preset.name}` });
                }}
                onToggleFavorite={() => {
                  actions.toggleFavorite(preset.id);
                }}
                onDelete={preset.isBuiltIn ? undefined : () => {
                  actions.removeSavedPreset(preset.id);
                  toast({ title: 'Preset deleted' });
                }}
              />
            ))}
          </AnimatePresence>

          {filteredPresets[activeTab].length === 0 && (
            <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">
              {activeTab === 'built-in'
                ? 'No built-in presets available'
                : activeTab === 'saved'
                ? 'No saved presets yet'
                : 'No favorite presets yet'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
