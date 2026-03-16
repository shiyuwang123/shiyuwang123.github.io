'use client';

import * as React from 'react';
import { DEFAULT_PLOT_THEME, readPlotThemeFromCss } from '@/lib/plot/theme';
import { PlotThemeTokens } from '@/lib/plot/types';

export function usePlotTheme(): PlotThemeTokens {
  const [theme, setTheme] = React.useState<PlotThemeTokens>(DEFAULT_PLOT_THEME);

  React.useEffect(() => {
    const refreshTheme = () => {
      setTheme(readPlotThemeFromCss());
    };

    refreshTheme();

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = () => refreshTheme();
    darkModeQuery.addEventListener('change', handleDarkModeChange);

    const observer = new MutationObserver(refreshTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => {
      darkModeQuery.removeEventListener('change', handleDarkModeChange);
      observer.disconnect();
    };
  }, []);

  return theme;
}
