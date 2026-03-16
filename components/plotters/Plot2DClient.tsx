'use client';

import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import * as React from 'react';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkInteractorStyleManipulator from '@kitware/vtk.js/Interaction/Style/InteractorStyleManipulator';
import vtkMouseCameraTrackballPanManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballPanManipulator';
import vtkMouseCameraTrackballZoomManipulator from '@kitware/vtk.js/Interaction/Manipulators/MouseCameraTrackballZoomManipulator';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPointPicker from '@kitware/vtk.js/Rendering/Core/PointPicker';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
import { MouseButton } from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor/Constants';
import type { vtkRenderWindowInteractor } from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import type { vtkSubscription } from '@kitware/vtk.js/interfaces';
import { adapt2DSeries, formatAxisValue } from '@/lib/plot/adapters';
import { parseCssColorToRgbNormalized } from '@/lib/plot/colors';
import { AxisDomain, Plot2DProps, PlotTooltipData } from '@/lib/plot/types';
import { createVtkScene, disposeVtkScene, VtkScene } from '@/lib/plot/vtkLifecycle';
import { usePlotTheme } from '@/hooks/use-plot-theme';
import { useResponsivePlotSize } from '@/hooks/use-responsive-plot-size';
import PlotShell from '@/components/plotters/PlotShell';

interface PickSeriesContext {
  seriesName: string;
  points: ReturnType<typeof adapt2DSeries>['series'][number]['points'];
}

interface Visible2DDomain {
  xDomain: AxisDomain;
  yDomain: AxisDomain;
}

function create2DInteractorStyle() {
  const style = vtkInteractorStyleManipulator.newInstance();

  const panManipulator = vtkMouseCameraTrackballPanManipulator.newInstance({
    button: MouseButton.LeftButton,
  });

  const zoomWheelManipulator = vtkMouseCameraTrackballZoomManipulator.newInstance();
  zoomWheelManipulator.setDragEnabled(false);
  zoomWheelManipulator.setScrollEnabled(true);

  const zoomDragManipulator = vtkMouseCameraTrackballZoomManipulator.newInstance({
    button: MouseButton.RightButton,
  });

  style.addMouseManipulator(panManipulator);
  style.addMouseManipulator(zoomWheelManipulator);
  style.addMouseManipulator(zoomDragManipulator);

  return style;
}

function deriveVisibleDomain(scene: VtkScene, width: number, height: number): Visible2DDomain {
  const camera = scene.renderer.getActiveCamera();
  const focalPoint = camera.getFocalPoint();
  const halfY = Math.max(1e-6, camera.getParallelScale());
  const aspect = Math.max(1, width / Math.max(1, height));
  const halfX = halfY * aspect;

  return {
    xDomain: {
      min: focalPoint[0] - halfX,
      max: focalPoint[0] + halfX,
    },
    yDomain: {
      min: focalPoint[1] - halfY,
      max: focalPoint[1] + halfY,
    },
  };
}

function buildTicks(domain: AxisDomain, targetTickCount = 6): number[] {
  const span = domain.max - domain.min;
  if (!Number.isFinite(span) || span <= 0) {
    return [domain.min];
  }

  const rawStep = span / Math.max(1, targetTickCount - 1);
  const power = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / power;

  let niceMultiplier = 1;
  if (normalized > 1 && normalized <= 2) {
    niceMultiplier = 2;
  } else if (normalized > 2 && normalized <= 5) {
    niceMultiplier = 5;
  } else if (normalized > 5) {
    niceMultiplier = 10;
  }

  const step = niceMultiplier * power;
  const first = Math.ceil(domain.min / step) * step;
  const ticks: number[] = [];

  for (let value = first; value <= domain.max + step * 0.5; value += step) {
    ticks.push(Number(value.toPrecision(12)));
  }

  if (ticks.length === 0) {
    return [domain.min, domain.max];
  }

  return ticks;
}

function createLineActor(
  series: ReturnType<typeof adapt2DSeries>['series'][number],
): { actor: ReturnType<typeof vtkActor.newInstance>; mapper: ReturnType<typeof vtkMapper.newInstance> } {
  const polyData = vtkPolyData.newInstance();
  const vtkPts = vtkPoints.newInstance();
  const coordinates = new Float32Array(series.points.length * 3);

  series.points.forEach((point, index) => {
    coordinates[index * 3] = point.x;
    coordinates[index * 3 + 1] = point.y;
    coordinates[index * 3 + 2] = 0;
  });

  vtkPts.setData(coordinates, 3);
  polyData.setPoints(vtkPts);

  const lineIndices = Array.from({ length: series.points.length }, (_, index) => index);
  const lines = vtkCellArray.newInstance();
  lines.insertNextCell(lineIndices);
  polyData.setLines(lines);

  const mapper = vtkMapper.newInstance();
  mapper.setInputData(polyData);

  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);
  actor.getProperty().setColor(parseCssColorToRgbNormalized(series.color));
  actor.getProperty().setLineWidth(series.lineWidth);

  return { actor, mapper };
}

function createPointActor(
  series: ReturnType<typeof adapt2DSeries>['series'][number],
  forPickingOnly: boolean,
): { actor: ReturnType<typeof vtkActor.newInstance>; mapper: ReturnType<typeof vtkMapper.newInstance> } {
  const polyData = vtkPolyData.newInstance();
  const vtkPts = vtkPoints.newInstance();
  const coordinates = new Float32Array(series.points.length * 3);

  series.points.forEach((point, index) => {
    coordinates[index * 3] = point.x;
    coordinates[index * 3 + 1] = point.y;
    coordinates[index * 3 + 2] = 0;
  });

  vtkPts.setData(coordinates, 3);
  polyData.setPoints(vtkPts);

  const verts = vtkCellArray.newInstance();
  for (let index = 0; index < series.points.length; index += 1) {
    verts.insertNextCell([index]);
  }
  polyData.setVerts(verts);

  const mapper = vtkMapper.newInstance();
  mapper.setInputData(polyData);

  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);
  actor.getProperty().setRepresentationToPoints();
  actor.getProperty().setPointSize(series.pointSize);
  actor.getProperty().setColor(parseCssColorToRgbNormalized(series.color));

  if (forPickingOnly) {
    actor.getProperty().setOpacity(0.001);
  }

  return { actor, mapper };
}

function createGridActor(
  xDomain: { min: number; max: number },
  yDomain: { min: number; max: number },
  divisions: number,
  gridColor: string,
): ReturnType<typeof vtkActor.newInstance> {
  const polyData = vtkPolyData.newInstance();
  const vtkPts = vtkPoints.newInstance();
  const points: number[] = [];
  const lines = vtkCellArray.newInstance();

  const xSpan = xDomain.max - xDomain.min;
  const ySpan = yDomain.max - yDomain.min;

  for (let i = 0; i <= divisions; i += 1) {
    const ratio = i / divisions;
    const x = xDomain.min + xSpan * ratio;
    const y = yDomain.min + ySpan * ratio;

    const xStart = points.length / 3;
    points.push(x, yDomain.min, 0, x, yDomain.max, 0);
    lines.insertNextCell([xStart, xStart + 1]);

    const yStart = points.length / 3;
    points.push(xDomain.min, y, 0, xDomain.max, y, 0);
    lines.insertNextCell([yStart, yStart + 1]);
  }

  vtkPts.setData(new Float32Array(points), 3);
  polyData.setPoints(vtkPts);
  polyData.setLines(lines);

  const mapper = vtkMapper.newInstance();
  mapper.setInputData(polyData);

  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);
  actor.getProperty().setColor(parseCssColorToRgbNormalized(gridColor));
  actor.getProperty().setLineWidth(1);

  return actor;
}

function installPicking(
  interactor: vtkRenderWindowInteractor,
  picker: ReturnType<typeof vtkPointPicker.newInstance>,
  contextByMapper: Map<object, PickSeriesContext>,
  xScale: NonNullable<Plot2DProps['xAxis']>['scale'],
  yScale: NonNullable<Plot2DProps['yAxis']>['scale'],
  onTooltip: (tooltip: PlotTooltipData | null) => void,
): vtkSubscription[] {
  const subscriptions: vtkSubscription[] = [];

  subscriptions.push(
    interactor.onMouseMove((event) => {
      const { x, y } = event.position;
      picker.pick([x, y, 0], event.pokedRenderer);
      const pickedPointId = picker.getPointId();
      const pickedMapper = picker.getMapper();

      if (pickedPointId < 0 || !pickedMapper) {
        onTooltip(null);
        return;
      }

      const context = contextByMapper.get(pickedMapper as unknown as object);
      const point = context?.points[pickedPointId];
      if (!context || !point) {
        onTooltip(null);
        return;
      }

      onTooltip({
        x,
        y,
        title: context.seriesName,
        lines: [
          `x: ${formatAxisValue(point.x, xScale ?? 'linear')}`,
          `y: ${formatAxisValue(point.y, yScale ?? 'linear')}`,
          `raw: (${point.original.x}, ${point.original.y})`,
        ],
      });
    }) as vtkSubscription,
  );

  subscriptions.push(
    interactor.onMouseLeave(() => onTooltip(null)) as vtkSubscription,
  );

  return subscriptions;
}

export default function Plot2D({
  data,
  title,
  description,
  xAxis,
  yAxis,
  legend,
  grid,
  interactions,
  className,
  height,
  loadingText,
  emptyText,
}: Plot2DProps) {
  const theme = usePlotTheme();
  const outerRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<VtkScene | null>(null);
  const subscriptionsRef = React.useRef<vtkSubscription[]>([]);

  const [error, setError] = React.useState<string | null>(null);
  const [tooltip, setTooltip] = React.useState<PlotTooltipData | null>(null);
  const [visibleDomain, setVisibleDomain] = React.useState<Visible2DDomain | null>(null);

  const size = useResponsivePlotSize(outerRef, {
    height,
    aspectRatio: 2.1,
    minHeight: 240,
    maxHeight: 520,
  });

  const adapted = React.useMemo(() => {
    return adapt2DSeries(data, xAxis, yAxis, theme.series);
  }, [data, xAxis, yAxis, theme.series]);

  React.useEffect(() => {
    subscriptionsRef.current.forEach((subscription) => subscription.unsubscribe());
    subscriptionsRef.current = [];

    disposeVtkScene(sceneRef.current);
    sceneRef.current = null;

    if (!containerRef.current || !size.ready || adapted.series.length === 0) {
      setVisibleDomain(null);
      return;
    }

    setError(null);

    try {
      const scene = createVtkScene(containerRef.current, parseCssColorToRgbNormalized(theme.surface));
      sceneRef.current = scene;

      const interactionStyle = create2DInteractorStyle();
      scene.interactor.setInteractorStyle(interactionStyle);
      if (interactions?.panZoom === false) {
        scene.interactor.disable();
      } else {
        scene.interactor.enable();
      }

      const mapperContextByMapper = new Map<object, PickSeriesContext>();
      const pointActorsForPick: Array<ReturnType<typeof vtkActor.newInstance>> = [];

      const showGrid = grid?.show ?? true;
      if (showGrid) {
        const gridActor = createGridActor(
          adapted.layout.xDomain,
          adapted.layout.yDomain,
          Math.max(2, grid?.majorDivisions ?? 8),
          theme.grid,
        );
        scene.renderer.addActor(gridActor);
      }

      adapted.series.forEach((seriesEntry) => {
        const includeLine = seriesEntry.type === 'line' || seriesEntry.type === 'line+scatter';
        const includeScatter = seriesEntry.type === 'scatter' || seriesEntry.type === 'line+scatter';

        if (includeLine) {
          const line = createLineActor(seriesEntry);
          scene.renderer.addActor(line.actor);
        }

        if (includeScatter || interactions?.pointPicking) {
          const points = createPointActor(seriesEntry, !includeScatter);
          scene.renderer.addActor(points.actor);
          mapperContextByMapper.set(points.mapper as unknown as object, {
            seriesName: seriesEntry.name,
            points: seriesEntry.points,
          });
          pointActorsForPick.push(points.actor);
        }
      });

      if (interactions?.pointPicking) {
        const picker = vtkPointPicker.newInstance();
        picker.setPickFromList(true);
        picker.initializePickList();
        pointActorsForPick.forEach((actor) => picker.addPickList(actor));

        subscriptionsRef.current = installPicking(
          scene.interactor,
          picker,
          mapperContextByMapper,
          xAxis?.scale,
          yAxis?.scale,
          setTooltip,
        );
      }

      const camera = scene.renderer.getActiveCamera();
      camera.setParallelProjection(true);

      const xCenter = (adapted.layout.xDomain.min + adapted.layout.xDomain.max) / 2;
      const yCenter = (adapted.layout.yDomain.min + adapted.layout.yDomain.max) / 2;
      camera.setFocalPoint(xCenter, yCenter, 0);
      camera.setPosition(xCenter, yCenter, 1);
      camera.setViewUp(0, 1, 0);

      const xSpan = Math.max(1e-6, adapted.layout.xDomain.max - adapted.layout.xDomain.min);
      const ySpan = Math.max(1e-6, adapted.layout.yDomain.max - adapted.layout.yDomain.min);
      const aspect = Math.max(1, size.width / Math.max(1, size.height));
      const parallelScale = Math.max(ySpan / 2, xSpan / (2 * aspect)) * 1.1;
      camera.setParallelScale(parallelScale);

      scene.renderer.resetCameraClippingRange();
      setVisibleDomain(deriveVisibleDomain(scene, size.width, size.height));

      const updateVisibleDomain = () => {
        setVisibleDomain(deriveVisibleDomain(scene, size.width, size.height));
        scene.renderWindow.render();
      };

      const styleAsObserver = interactionStyle as unknown as {
        onInteractionEvent?: (cb: () => void, priority?: number) => vtkSubscription;
      };
      const interactorAsRuntime = scene.interactor as unknown as {
        onInteraction?: (cb: () => void, priority?: number) => vtkSubscription;
      };

      const interactionSubscription = styleAsObserver.onInteractionEvent?.(updateVisibleDomain)
        ?? interactorAsRuntime.onInteraction?.(updateVisibleDomain)
        ?? null;

      if (interactionSubscription) {
        subscriptionsRef.current.push(interactionSubscription);
      }

      scene.renderWindow.render();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Plot2D failed to render.');
    }

    return () => {
      subscriptionsRef.current.forEach((subscription) => subscription.unsubscribe());
      subscriptionsRef.current = [];
      disposeVtkScene(sceneRef.current);
      sceneRef.current = null;
    };
  }, [
    adapted,
    interactions?.panZoom,
    interactions?.pointPicking,
    xAxis?.scale,
    yAxis?.scale,
    size.height,
    size.ready,
    size.width,
    theme.grid,
    theme.surface,
    grid?.majorDivisions,
    grid?.show,
  ]);

  const legendItems = adapted.series.map((seriesEntry) => ({
    name: seriesEntry.name,
    color: seriesEntry.color,
  }));
  const showLegend = legend?.show !== false && legendItems.length > 0;

  const xScaleLabel = xAxis?.scale ?? 'linear';
  const yScaleLabel = yAxis?.scale ?? 'linear';
  const axisDomainX = visibleDomain?.xDomain ?? adapted.layout.xDomain;
  const axisDomainY = visibleDomain?.yDomain ?? adapted.layout.yDomain;
  const xSpan = Math.max(1e-6, axisDomainX.max - axisDomainX.min);
  const ySpan = Math.max(1e-6, axisDomainY.max - axisDomainY.min);
  const xTicks = buildTicks(axisDomainX, 6);
  const yTicks = buildTicks(axisDomainY, 6);

  const resolvedError = adapted.series.length === 0
    ? (emptyText ?? 'No valid 2D points available. Check data values and log-scale constraints.')
    : error;

  return (
    <PlotShell
      title={title}
      description={description}
      className={className}
      legendItems={[]}
      loading={!size.ready && !resolvedError}
      error={resolvedError}
      tooltip={tooltip}
      footer={loadingText ? <div className="text-xs text-muted-foreground">{loadingText}</div> : null}
    >
      <div ref={outerRef} className="relative w-full" style={{ height: `${size.height}px` }}>
        <div ref={containerRef} className="absolute inset-0" />

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute inset-y-0 left-0 w-px bg-[var(--plot-axis)]/80" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--plot-axis)]/80" />

          {xTicks.map((tick, index) => {
            const left = ((tick - axisDomainX.min) / xSpan) * 100;
            return (
              <div
                key={`x-${tick}`}
                className="absolute bottom-0"
                style={{
                  left: `${Math.min(100, Math.max(0, left))}%`,
                  transform: index === 0 ? 'translateX(0%)' : index === xTicks.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                }}
              >
                <div className="h-2 w-px bg-[var(--plot-axis)]/80" />
                <div className="mt-1 text-[10px] leading-none text-[var(--plot-muted-text)]">
                  {formatAxisValue(tick, xScaleLabel)}
                </div>
              </div>
            );
          })}

          {yTicks.map((tick) => {
            const bottom = ((tick - axisDomainY.min) / ySpan) * 100;
            return (
              <div
                key={`y-${tick}`}
                className="absolute left-0 -translate-y-1/2"
                style={{ bottom: `${Math.min(100, Math.max(0, bottom))}%` }}
              >
                <div className="h-px w-2 bg-[var(--plot-axis)]/80" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] leading-none text-[var(--plot-muted-text)]">
                  {formatAxisValue(tick, yScaleLabel)}
                </div>
              </div>
            );
          })}

          {xAxis?.title && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded bg-[var(--plot-surface)]/85 px-2 py-0.5 text-[10px] font-medium text-[var(--plot-text)]">
              {xAxis.title}
            </div>
          )}

          {yAxis?.title && (
            <div className="absolute left-7 top-1/2 -translate-y-1/2 -rotate-90 rounded bg-[var(--plot-surface)]/85 px-2 py-0.5 text-[10px] font-medium text-[var(--plot-text)]">
              {yAxis.title}
            </div>
          )}
        </div>

        {showLegend && (
          <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-lg border border-[var(--plot-border)] bg-[var(--plot-surface)]/90 px-3 py-2 shadow-sm">
            {legend?.title && (
              <div className="mb-1 text-[10px] uppercase tracking-wider text-[var(--plot-muted-text)]">
                {legend.title}
              </div>
            )}
            <div className="flex flex-col gap-1">
              {legendItems.map((item) => (
                <div key={`${item.name}-${item.color}`} className="inline-flex items-center gap-2 text-[11px] text-[var(--plot-text)]">
                  <span className="h-2.5 w-2.5 rounded-full border border-black/10" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PlotShell>
  );
}
