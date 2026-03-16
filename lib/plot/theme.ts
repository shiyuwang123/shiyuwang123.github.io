import { PlotThemeTokens } from '@/lib/plot/types';

export const DEFAULT_PLOT_THEME: PlotThemeTokens = {
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  mutedText: '#64748b',
  border: '#e2e8f0',
  axis: '#475569',
  grid: 'rgba(100, 116, 139, 0.25)',
  pick: '#f97316',
  series: ['#2563eb', '#e11d48', '#0891b2', '#7c3aed', '#ea580c'],
};

function readCssVariable(styles: CSSStyleDeclaration, key: string, fallback: string): string {
  const value = styles.getPropertyValue(key).trim();
  return value || fallback;
}

export function readPlotThemeFromCss(): PlotThemeTokens {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_PLOT_THEME;
  }

  const styles = window.getComputedStyle(document.documentElement);

  return {
    background: readCssVariable(styles, '--background', DEFAULT_PLOT_THEME.background),
    surface: readCssVariable(styles, '--plot-surface', DEFAULT_PLOT_THEME.surface),
    text: readCssVariable(styles, '--plot-text', DEFAULT_PLOT_THEME.text),
    mutedText: readCssVariable(styles, '--plot-muted-text', DEFAULT_PLOT_THEME.mutedText),
    border: readCssVariable(styles, '--plot-border', DEFAULT_PLOT_THEME.border),
    axis: readCssVariable(styles, '--plot-axis', DEFAULT_PLOT_THEME.axis),
    grid: readCssVariable(styles, '--plot-grid', DEFAULT_PLOT_THEME.grid),
    pick: readCssVariable(styles, '--plot-pick', DEFAULT_PLOT_THEME.pick),
    series: [
      readCssVariable(styles, '--plot-series-1', DEFAULT_PLOT_THEME.series[0]),
      readCssVariable(styles, '--plot-series-2', DEFAULT_PLOT_THEME.series[1]),
      readCssVariable(styles, '--plot-series-3', DEFAULT_PLOT_THEME.series[2]),
      readCssVariable(styles, '--plot-series-4', DEFAULT_PLOT_THEME.series[3]),
      readCssVariable(styles, '--plot-series-5', DEFAULT_PLOT_THEME.series[4]),
    ],
  };
}
