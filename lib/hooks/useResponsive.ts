import { useState, useCallback } from 'react';

export type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'wide';

interface ViewportConfig {
  width: number;
  height: number;
  label: string;
  deviceScale: number;
}

export const VIEWPORT_CONFIGS: Record<ViewportSize, ViewportConfig> = {
  mobile: { width: 375, height: 812, label: 'iPhone 14', deviceScale: 2 },
  tablet: { width: 768, height: 1024, label: 'iPad', deviceScale: 2 },
  desktop: { width: 1280, height: 800, label: 'Laptop', deviceScale: 1 },
  wide: { width: 1920, height: 1080, label: 'Desktop', deviceScale: 1 }
};

export function useResponsive() {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const config = VIEWPORT_CONFIGS[viewport];
  const actualWidth = orientation === 'portrait' ? config.width : config.height;
  const actualHeight = orientation === 'portrait' ? config.height : config.width;

  const cycleViewport = useCallback(() => {
    const sizes: ViewportSize[] = ['mobile', 'tablet', 'desktop', 'wide'];
    const currentIndex = sizes.indexOf(viewport);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setViewport(sizes[nextIndex]);
  }, [viewport]);

  const toggleOrientation = useCallback(() => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  }, []);

  return {
    viewport,
    setViewport,
    orientation,
    toggleOrientation,
    cycleViewport,
    config,
    width: actualWidth,
    height: actualHeight,
    isMobile: viewport === 'mobile',
    isTablet: viewport === 'tablet',
    isDesktop: viewport === 'desktop' || viewport === 'wide'
  };
}
