'use client';

import { useVibeStore } from '@/lib/store/vibeStore';
import { cn } from '@/lib/utils';

interface CodeTabsProps {
  activeTab: string;
  onChange: (tab: 'css' | 'tailwind' | 'html' | 'react' | 'vue' | 'json') => void;
}

export function CodeTabs({ activeTab, onChange }: CodeTabsProps) {
  const tabs = [
    { id: 'css', label: 'CSS' },
    { id: 'tailwind', label: 'Tailwind' },
    { id: 'react', label: 'React' },
    { id: 'vue', label: 'Vue' },
    { id: 'html', label: 'HTML' },
    { id: 'json', label: 'JSON' }
  ] as const;

  return (
    <div className="flex items-center gap-1 border-b bg-muted/30 px-2 py-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded px-3 py-1.5 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
