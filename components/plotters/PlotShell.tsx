'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { PlotLegendItem, PlotTooltipData } from '@/lib/plot/types';

interface PlotShellProps {
  title?: string;
  description?: string;
  className?: string;
  axisLabels?: string[];
  legendItems?: PlotLegendItem[];
  legendTitle?: string;
  loading?: boolean;
  error?: string | null;
  tooltip?: PlotTooltipData | null;
  children: ReactNode;
  footer?: ReactNode;
}

export default function PlotShell({
  title,
  className,
  axisLabels,
  legendItems,
  legendTitle,
  loading,
  error,
  tooltip,
  children,
  footer,
}: PlotShellProps) {
  const hasLegend = Boolean(legendItems && legendItems.length > 0);

  return (
    <section className={cn('flex flex-col my-12 bg-muted/30 rounded-3xl p-8 border border-border', className)}>
      {axisLabels && axisLabels.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {axisLabels.map((label) => (
            <span key={label} className="px-2 py-1 rounded-md bg-muted border border-border/70">
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[var(--plot-border)] bg-[var(--plot-surface)]">
        {children}

        {tooltip && (
          <div
            className="pointer-events-none absolute z-30 min-w-36 max-w-60 rounded-lg border border-[var(--plot-border)] bg-[var(--plot-surface)]/95 px-3 py-2 text-xs text-[var(--plot-text)] shadow-lg"
            style={{ left: Math.max(8, tooltip.x + 12), top: Math.max(8, tooltip.y + 12) }}
          >
            <div className="font-semibold mb-1">{tooltip.title}</div>
            {tooltip.lines.map((line) => (
              <div key={line} className="text-[var(--plot-muted-text)]">{line}</div>
            ))}
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[var(--plot-surface)]/85">
            <div className="text-sm text-[var(--plot-muted-text)]">Rendering plot...</div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[var(--plot-surface)]/90 px-4 text-center">
            <div className="text-sm text-red-500">{error}</div>
          </div>
        )}
      </div>

      {title && (
        <h3 className="m-0 p-0 text-center text-xl font-semibold leading-none text-foreground">
          {title}
        </h3>
      )}

      {hasLegend && (
        <div className="mt-4 rounded-xl border border-border/70 bg-[var(--plot-surface)] px-4 py-3">
          {legendTitle && <div className="text-xs uppercase tracking-wider text-[var(--plot-muted-text)] mb-2">{legendTitle}</div>}
          <div className="flex flex-wrap gap-3">
            {(legendItems ?? []).map((item) => (
              <div key={`${item.name}-${item.color}`} className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-[var(--plot-text)]">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {footer && <div className="mt-4">{footer}</div>}
    </section>
  );
}
