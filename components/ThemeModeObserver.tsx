'use client';

import { useEffect } from 'react';
import { useVibeStore } from '@/lib/store/vibeStore';

export function ThemeModeObserver() {
  const mode = useVibeStore(state => state.tokens.theme.mode);

  useEffect(() => {
    const html = document.documentElement;
    if (mode === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [mode]);

  return null;
}
