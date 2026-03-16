'use client';

import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import * as React from 'react';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkAxesActor from '@kitware/vtk.js/Rendering/Core/AxesActor';
import vtkCellArray from '@kitware/vtk.js/Common/Core/CellArray';
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import vtkDataArray from '@kitware/vtk.js/Common/Core/DataArray';
import vtkInteractorStyleTrackballCamera from '@kitware/vtk.js/Interaction/Style/InteractorStyleTrackballCamera';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkPlane from '@kitware/vtk.js/Common/DataModel/Plane';
import vtkPointPicker from '@kitware/vtk.js/Rendering/Core/PointPicker';
import vtkPoints from '@kitware/vtk.js/Common/Core/Points';
import vtkPolyData from '@kitware/vtk.js/Common/DataModel/PolyData';
import type { vtkRenderWindowInteractor } from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import type { vtkSubscription } from '@kitware/vtk.js/interfaces';
import { adapt3DData, formatAxisValue } from '@/lib/plot/adapters';
import { buildColorMapStops, parseCssColorToRgbNormalized } from '@/lib/plot/colors';
import { CAMERA_PRESETS } from '@/lib/plot/presets';
import { AxisDomain, AxisKey, Plot3DProps, PlotTooltipData } from '@/lib/plot/types';
import { createVtkScene, disposeVtkScene, VtkScene } from '@/lib/plot/vtkLifecycle';
import { usePlotTheme } from '@/hooks/use-plot-theme';
import { useResponsivePlotSize } from '@/hooks/use-responsive-plot-size';
import PlotShell from '@/components/plotters/PlotShell';

interface PickPointContext {
  name: string;
  points: ReturnType<typeof adapt3DData>['pointCloud'];
}

function axisVector(axis: AxisKey): [number, number, number] {
  if (axis === 'x') return [1, 0, 0];
  if (axis === 'y') return [0, 1, 0];
  return [0, 0, 1];
}

function axisValue(domain: AxisDomain, ratio: number): number {
  return domain.min + (domain.max - domain.min) * Math.max(0, Math.min(1, ratio));
}

function buildLookupTable(
  colorMap: NonNullable<Plot3DProps['data']['pointColorMap']>,
  range: [number, number],
): ReturnType<typeof vtkColorTransferFunction.newInstance> {
  const lut = vtkColorTransferFunction.newInstance();
  const stops = buildColorMapStops(colorMap);
  const span = Math.max(1e-9, range[1] - range[0]);

  stops.forEach((stop) => {
    const scalar = range[0] + stop.position * span;
    lut.addRGBPoint(scalar, stop.color[0], stop.color[1], stop.color[2]);
  });

  return lut;
}

function createPointCloudActor(
  adapted: ReturnType<typeof adapt3DData>,
  themeColor: string,
): {
  actor: ReturnType<typeof vtkActor.newInstance>;
  mapper: ReturnType<typeof vtkMapper.newInstance>;
} {
  const polyData = vtkPolyData.newInstance();
  const vtkPts = vtkPoints.newInstance();
  const coordinates = new Float32Array(adapted.pointCloud.length * 3);

  adapted.pointCloud.forEach((point, index) => {
    coordinates[index * 3] = point.x;
    coordinates[index * 3 + 1] = point.y;
    coordinates[index * 3 + 2] = point.z;
  });

  vtkPts.setData(coordinates, 3);
  polyData.setPoints(vtkPts);

  const verts = vtkCellArray.newInstance();
  for (let index = 0; index < adapted.pointCloud.length; index += 1) {
    verts.insertNextCell([index]);
  }
  polyData.setVerts(verts);

  const mapper = vtkMapper.newInstance();
  mapper.setInputData(polyData);

  const colorMap = adapted.pointColorMap;
  if (colorMap) {
    const scalarValues = new Float32Array(adapted.pointCloud.map((point) => point.value));
    const scalars = vtkDataArray.newInstance({
      name: 'value',
      values: scalarValues,
      numberOfComponents: 1,
    });
    polyData.getPointData().setScalars(scalars);

    mapper.setScalarModeToUsePointData();
    mapper.setLookupTable(buildLookupTable(colorMap, adapted.valueRange));
    mapper.setScalarRange(adapted.valueRange[0], adapted.valueRange[1]);
    mapper.setUseLookupTableScalarRange(true);
    mapper.setScalarVisibility(true);
  } else {
    mapper.setScalarVisibility(false);
  }

  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);
  actor.getProperty().setRepresentationToPoints();
  actor.getProperty().setPointSize(adapted.pointSize);
  actor.getProperty().setColor(parseCssColorToRgbNormalized(adapted.pointColor ?? themeColor));

  return { actor, mapper };
}

function createSurfaceActor(
  surface: ReturnType<typeof adapt3DData>['surfaces'][number],
  valueRange: [number, number],
  fallbackColor: string,
): {
  actor: ReturnType<typeof vtkActor.newInstance>;
  mapper: ReturnType<typeof vtkMapper.newInstance>;
} {
  const polyData = vtkPolyData.newInstance();
  const vtkPts = vtkPoints.newInstance();
  const coordinates = new Float32Array(surface.points.length * 3);

  surface.points.forEach((point, index) => {
    coordinates[index * 3] = point.x;
    coordinates[index * 3 + 1] = point.y;
    coordinates[index * 3 + 2] = point.z;
  });

  vtkPts.setData(coordinates, 3);
  polyData.setPoints(vtkPts);

  const polys = vtkCellArray.newInstance();
  surface.triangles.forEach((triangle) => {
    polys.insertNextCell([triangle[0], triangle[1], triangle[2]]);
  });
  polyData.setPolys(polys);

  const mapper = vtkMapper.newInstance();
  mapper.setInputData(polyData);

  const shouldColorByScalar = Boolean(surface.colorMap);
  if (shouldColorByScalar) {
    const scalarValues = new Float32Array(surface.points.map((point) => (
      surface.colorBy === 'z' ? point.z : point.value
    )));

    const scalars = vtkDataArray.newInstance({
      name: 'surfaceValue',
      values: scalarValues,
      numberOfComponents: 1,
    });
    polyData.getPointData().setScalars(scalars);

    mapper.setScalarModeToUsePointData();
    mapper.setLookupTable(buildLookupTable(surface.colorMap ?? 'viridis', valueRange));
    mapper.setScalarRange(valueRange[0], valueRange[1]);
    mapper.setUseLookupTableScalarRange(true);
    mapper.setScalarVisibility(true);
  } else {
    mapper.setScalarVisibility(false);
  }

  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);
  actor.getProperty().setColor(parseCssColorToRgbNormalized(surface.color ?? fallbackColor));
  actor.getProperty().setOpacity(surface.opacity);

  return { actor, mapper };
}

function createXYGridActor(
  xDomain: AxisDomain,
  yDomain: AxisDomain,
  zValue: number,
  divisions: number,
  color: string,
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

    const xLineStart = points.length / 3;
    points.push(x, yDomain.min, zValue, x, yDomain.max, zValue);
    lines.insertNextCell([xLineStart, xLineStart + 1]);

    const yLineStart = points.length / 3;
    points.push(xDomain.min, y, zValue, xDomain.max, y, zValue);
    lines.insertNextCell([yLineStart, yLineStart + 1]);
  }

  vtkPts.setData(new Float32Array(points), 3);
  polyData.setPoints(vtkPts);
  polyData.setLines(lines);

  const mapper = vtkMapper.newInstance();
  mapper.setInputData(polyData);

  const actor = vtkActor.newInstance();
  actor.setMapper(mapper);
  actor.getProperty().setColor(parseCssColorToRgbNormalized(color));
  actor.getProperty().setLineWidth(1);

  return actor;
}

function install3DPicking(
  interactor: vtkRenderWindowInteractor,
  picker: ReturnType<typeof vtkPointPicker.newInstance>,
  mapperContext: Map<object, PickPointContext>,
  xScale: NonNullable<Plot3DProps['xAxis']>['scale'],
  yScale: NonNullable<Plot3DProps['yAxis']>['scale'],
  zScale: NonNullable<Plot3DProps['zAxis']>['scale'],
  onTooltip: (value: PlotTooltipData | null) => void,
): vtkSubscription[] {
  const subscriptions: vtkSubscription[] = [];

  subscriptions.push(
    interactor.onMouseMove((event) => {
      const { x, y } = event.position;
      picker.pick([x, y, 0], event.pokedRenderer);
      const pointId = picker.getPointId();
      const mapper = picker.getMapper();

      if (pointId < 0 || !mapper) {
        onTooltip(null);
        return;
      }

      const context = mapperContext.get(mapper as unknown as object);
      const point = context?.points[pointId];
      if (!context || !point) {
        onTooltip(null);
        return;
      }

      onTooltip({
        x,
        y,
        title: context.name,
        lines: [
          `x: ${formatAxisValue(point.x, xScale ?? 'linear')}`,
          `y: ${formatAxisValue(point.y, yScale ?? 'linear')}`,
          `z: ${formatAxisValue(point.z, zScale ?? 'linear')}`,
          `value: ${point.value.toFixed(4)}`,
        ],
      });
    }) as vtkSubscription,
  );

  subscriptions.push(
    interactor.onMouseLeave(() => onTooltip(null)) as vtkSubscription,
  );

  return subscriptions;
}

export default function Plot3D({
  data,
  title,
  description,
  xAxis,
  yAxis,
  zAxis,
  legend,
  grid,
  interactions,
  className,
  height,
  cameraPreset,
  clippingAxis,
  clippingRatio,
  slicingAxis,
  slicingRatio,
  loadingText,
  emptyText,
}: Plot3DProps) {
  const theme = usePlotTheme();

  const outerRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<VtkScene | null>(null);
  const subscriptionsRef = React.useRef<vtkSubscription[]>([]);

  const [tooltip, setTooltip] = React.useState<PlotTooltipData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [clipRatio, setClipRatio] = React.useState(clippingRatio ?? 0.5);
  const [sliceRatio, setSliceRatio] = React.useState(slicingRatio ?? 0.5);

  React.useEffect(() => setClipRatio(clippingRatio ?? 0.5), [clippingRatio]);
  React.useEffect(() => setSliceRatio(slicingRatio ?? 0.5), [slicingRatio]);

  const size = useResponsivePlotSize(outerRef, {
    height,
    aspectRatio: 1.8,
    minHeight: 280,
    maxHeight: 620,
  });

  const adapted = React.useMemo(() => {
    return adapt3DData(data, xAxis, yAxis, zAxis);
  }, [data, xAxis, yAxis, zAxis]);

  React.useEffect(() => {
    subscriptionsRef.current.forEach((subscription) => subscription.unsubscribe());
    subscriptionsRef.current = [];

    disposeVtkScene(sceneRef.current);
    sceneRef.current = null;

    const hasRenderableData = adapted.pointCloud.length > 0 || adapted.surfaces.length > 0;
    if (!containerRef.current || !size.ready || !hasRenderableData) {
      return;
    }

    setError(null);

    try {
      const scene = createVtkScene(containerRef.current, parseCssColorToRgbNormalized(theme.surface));
      sceneRef.current = scene;
      scene.interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());

      if (interactions?.orbitPanZoom === false) {
        scene.interactor.disable();
      } else {
        scene.interactor.enable();
      }

      const allMappers: Array<ReturnType<typeof vtkMapper.newInstance>> = [];
      const mapperContext = new Map<object, PickPointContext>();
      const pickActors: Array<ReturnType<typeof vtkActor.newInstance>> = [];

      if ((grid?.show ?? true)) {
        const gridActor = createXYGridActor(
          adapted.layout.xDomain,
          adapted.layout.yDomain,
          adapted.layout.zDomain.min,
          Math.max(2, grid?.majorDivisions ?? 8),
          theme.grid,
        );
        scene.renderer.addActor(gridActor);
      }

      if (adapted.pointCloud.length > 0) {
        const pointCloud = createPointCloudActor(adapted, theme.series[0]);
        scene.renderer.addActor(pointCloud.actor);
        allMappers.push(pointCloud.mapper);
        mapperContext.set(pointCloud.mapper as unknown as object, {
          name: 'Point Cloud',
          points: adapted.pointCloud,
        });
        pickActors.push(pointCloud.actor);
      }

      adapted.surfaces.forEach((surface, index) => {
        const actor = createSurfaceActor(surface, adapted.valueRange, theme.series[(index + 1) % theme.series.length]);
        scene.renderer.addActor(actor.actor);
        allMappers.push(actor.mapper);

        mapperContext.set(actor.mapper as unknown as object, {
          name: surface.name,
          points: surface.points,
        });
        pickActors.push(actor.actor);
      });

      const axesActor = vtkAxesActor.newInstance();
      axesActor.setXAxisColor(parseCssColorToRgbNormalized(theme.series[0]));
      axesActor.setYAxisColor(parseCssColorToRgbNormalized(theme.series[1]));
      axesActor.setZAxisColor(parseCssColorToRgbNormalized(theme.series[2]));
      const xSpan = adapted.layout.xDomain.max - adapted.layout.xDomain.min;
      const ySpan = adapted.layout.yDomain.max - adapted.layout.yDomain.min;
      const zSpan = adapted.layout.zDomain.max - adapted.layout.zDomain.min;
      const dominantSpan = Math.max(1e-6, xSpan, ySpan, zSpan);
      axesActor.setScale(dominantSpan * 0.35, dominantSpan * 0.35, dominantSpan * 0.35);
      axesActor.setPosition(
        adapted.layout.xDomain.min,
        adapted.layout.yDomain.min,
        adapted.layout.zDomain.min,
      );
      scene.renderer.addActor(axesActor);

      const selectedClipAxis = clippingAxis ?? 'z';
      const selectedSliceAxis = slicingAxis ?? 'z';

      if (interactions?.clipping) {
        const domain = selectedClipAxis === 'x'
          ? adapted.layout.xDomain
          : selectedClipAxis === 'y'
            ? adapted.layout.yDomain
            : adapted.layout.zDomain;
        const value = axisValue(domain, clipRatio);

        const clipPlane = vtkPlane.newInstance();
        const [nx, ny, nz] = axisVector(selectedClipAxis);
        clipPlane.setNormal(nx, ny, nz);
        if (selectedClipAxis === 'x') clipPlane.setOrigin(value, 0, 0);
        if (selectedClipAxis === 'y') clipPlane.setOrigin(0, value, 0);
        if (selectedClipAxis === 'z') clipPlane.setOrigin(0, 0, value);

        allMappers.forEach((mapper) => {
          mapper.addClippingPlane(clipPlane);
        });
      }

      if (interactions?.slicing) {
        const domain = selectedSliceAxis === 'x'
          ? adapted.layout.xDomain
          : selectedSliceAxis === 'y'
            ? adapted.layout.yDomain
            : adapted.layout.zDomain;

        const value = axisValue(domain, sliceRatio);
        const thickness = Math.max(1e-6, (domain.max - domain.min) * 0.03);

        const firstPlane = vtkPlane.newInstance();
        const secondPlane = vtkPlane.newInstance();

        if (selectedSliceAxis === 'x') {
          firstPlane.setNormal(1, 0, 0);
          firstPlane.setOrigin(value - thickness, 0, 0);
          secondPlane.setNormal(-1, 0, 0);
          secondPlane.setOrigin(value + thickness, 0, 0);
        } else if (selectedSliceAxis === 'y') {
          firstPlane.setNormal(0, 1, 0);
          firstPlane.setOrigin(0, value - thickness, 0);
          secondPlane.setNormal(0, -1, 0);
          secondPlane.setOrigin(0, value + thickness, 0);
        } else {
          firstPlane.setNormal(0, 0, 1);
          firstPlane.setOrigin(0, 0, value - thickness);
          secondPlane.setNormal(0, 0, -1);
          secondPlane.setOrigin(0, 0, value + thickness);
        }

        allMappers.forEach((mapper) => {
          mapper.addClippingPlane(firstPlane);
          mapper.addClippingPlane(secondPlane);
        });
      }

      if (interactions?.pointPicking) {
        const picker = vtkPointPicker.newInstance();
        picker.setPickFromList(true);
        picker.initializePickList();
        pickActors.forEach((actor) => picker.addPickList(actor));

        subscriptionsRef.current = install3DPicking(
          scene.interactor,
          picker,
          mapperContext,
          xAxis?.scale,
          yAxis?.scale,
          zAxis?.scale,
          setTooltip,
        );
      }

      const centerX = (adapted.layout.xDomain.min + adapted.layout.xDomain.max) / 2;
      const centerY = (adapted.layout.yDomain.min + adapted.layout.yDomain.max) / 2;
      const centerZ = (adapted.layout.zDomain.min + adapted.layout.zDomain.max) / 2;
      const pose = CAMERA_PRESETS[cameraPreset ?? 'isometric'];
      const sceneSpan = Math.max(1e-6, xSpan, ySpan, zSpan);

      const camera = scene.renderer.getActiveCamera();
      camera.setFocalPoint(centerX, centerY, centerZ);
      camera.setPosition(
        centerX + pose.position[0] * sceneSpan,
        centerY + pose.position[1] * sceneSpan,
        centerZ + pose.position[2] * sceneSpan,
      );
      camera.setViewUp(pose.viewUp[0], pose.viewUp[1], pose.viewUp[2]);

      scene.renderer.resetCamera();
      scene.renderer.resetCameraClippingRange();
      scene.renderWindow.render();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Plot3D failed to render.');
    }

    return () => {
      subscriptionsRef.current.forEach((subscription) => subscription.unsubscribe());
      subscriptionsRef.current = [];
      disposeVtkScene(sceneRef.current);
      sceneRef.current = null;
    };
  }, [
    adapted,
    cameraPreset,
    clipRatio,
    clippingAxis,
    grid?.majorDivisions,
    grid?.show,
    interactions?.clipping,
    interactions?.orbitPanZoom,
    interactions?.pointPicking,
    interactions?.slicing,
    size.ready,
    sliceRatio,
    slicingAxis,
    theme.grid,
    theme.series,
    theme.surface,
    xAxis?.scale,
    yAxis?.scale,
    zAxis?.scale,
  ]);

  const hasRenderableData = adapted.pointCloud.length > 0 || adapted.surfaces.length > 0;

  const legendItems = [
    ...(adapted.pointCloud.length > 0 ? [{ name: 'Point Cloud', color: adapted.pointColor ?? theme.series[0] }] : []),
    ...adapted.surfaces.map((surface, index) => ({
      name: surface.name,
      color: surface.color ?? theme.series[(index + 1) % theme.series.length],
    })),
  ];

  const axisLabels = [
    `X: ${xAxis?.title ?? 'x'} (${xAxis?.scale ?? 'linear'})`,
    `Y: ${yAxis?.title ?? 'y'} (${yAxis?.scale ?? 'linear'})`,
    `Z: ${zAxis?.title ?? 'z'} (${zAxis?.scale ?? 'linear'})`,
  ];

  const controls = (
    <div className="flex flex-wrap gap-4">
      {interactions?.clipping && (
        <label className="text-xs text-muted-foreground flex flex-col gap-1 min-w-56">
          <span>Clipping ({(clippingAxis ?? 'z').toUpperCase()}): {(clipRatio * 100).toFixed(0)}%</span>
          <input
            type="range"
            min={0}
            max={100}
            value={clipRatio * 100}
            onChange={(event) => setClipRatio(Number(event.target.value) / 100)}
            className="accent-primary"
          />
        </label>
      )}

      {interactions?.slicing && (
        <label className="text-xs text-muted-foreground flex flex-col gap-1 min-w-56">
          <span>Slicing ({(slicingAxis ?? 'z').toUpperCase()}): {(sliceRatio * 100).toFixed(0)}%</span>
          <input
            type="range"
            min={0}
            max={100}
            value={sliceRatio * 100}
            onChange={(event) => setSliceRatio(Number(event.target.value) / 100)}
            className="accent-primary"
          />
        </label>
      )}
    </div>
  );

  const resolvedError = hasRenderableData
    ? error
    : (emptyText ?? 'No valid 3D points available. Check data arrays and log-scale constraints.');

  return (
    <PlotShell
      title={title}
      description={description}
      className={className}
      axisLabels={axisLabels}
      legendItems={legend?.show === false ? [] : legendItems}
      legendTitle={legend?.title}
      loading={!size.ready && !resolvedError}
      error={resolvedError}
      tooltip={tooltip}
      footer={
        <div className="space-y-3">
          {controls}
          {loadingText && <div className="text-xs text-muted-foreground">{loadingText}</div>}
        </div>
      }
    >
      <div ref={outerRef} className="relative w-full" style={{ height: `${size.height}px` }}>
        <div ref={containerRef} className="absolute inset-0" />
      </div>
    </PlotShell>
  );
}
