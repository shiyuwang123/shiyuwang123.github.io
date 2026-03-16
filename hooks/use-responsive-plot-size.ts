'use client';

import * as React from 'react';

export interface ResponsivePlotSizeOptions {
  height?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
}

export interface ResponsivePlotSize {
  width: number;
  height: number;
  dpr: number;
  ready: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function useResponsivePlotSize(
  containerRef: React.RefObject<HTMLElement | null>,
  options: ResponsivePlotSizeOptions = {},
): ResponsivePlotSize {
  const {
    height,
    minHeight = 260,
    maxHeight = 620,
    aspectRatio = 2.0,
  } = options;

  const [size, setSize] = React.useState<ResponsivePlotSize>({
    width: 0,
    height: height ?? minHeight,
    dpr: 1,
    ready: false,
  });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const calculateHeight = (width: number): number => {
      if (typeof height === 'number' && Number.isFinite(height)) {
        return height;
      }
      const scaled = width / aspectRatio;
      return clamp(Math.round(scaled), minHeight, maxHeight);
    };

    const refreshSize = () => {
      const rect = container.getBoundingClientRect();
      const widthValue = Math.max(0, Math.floor(rect.width));
      const heightValue = calculateHeight(widthValue);
      const dpr = window.devicePixelRatio || 1;
      setSize({
        width: widthValue,
        height: heightValue,
        dpr,
        ready: widthValue > 0 && heightValue > 0,
      });
    };

    refreshSize();

    const observer = new ResizeObserver(() => {
      refreshSize();
    });
    observer.observe(container);

    const mediaQuery = window.matchMedia('(resolution: 2dppx)');
    const handleResolution = () => refreshSize();
    mediaQuery.addEventListener('change', handleResolution);

    window.addEventListener('resize', refreshSize);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleResolution);
      window.removeEventListener('resize', refreshSize);
    };
  }, [containerRef, height, minHeight, maxHeight, aspectRatio]);

  return size;
}
