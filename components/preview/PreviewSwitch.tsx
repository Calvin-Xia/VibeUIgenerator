'use client';

import { useMemo } from 'react';
import { useVibeStore, createActions } from '@/lib/store/vibeStore';
import { MousePointer2, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PreviewSwitch() {
  const selectedComponent = useVibeStore(state => state.ui.selectedComponent);
  
  const actions = useMemo(() => 
    createActions(
      (fn) => useVibeStore.setState(fn),
      () => useVibeStore.getState()
    ),
  []);

  const tabs = [
    { id: 'button' as const, label: 'Button', icon: MousePointer2 },
    { id: 'card' as const, label: 'Card', icon: Layout }
  ];

  return (
    <div className="flex items-center gap-1 rounded-md bg-secondary p-1">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = selectedComponent === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => actions.setSelectedComponent(tab.id)}
            className={cn(
              'flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
