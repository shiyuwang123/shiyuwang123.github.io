import {
  Adapted2DPoint,
  Adapted2DSeries,
  AxisDomain,
  AxisScale,
  Plot2DLayout,
  Plot2DSeries,
  Plot3DData,
  Plot3DPoint,
  Plot3DSurface,
  PlotAxisConfig,
} from '@/lib/plot/types';

const LOG_EPSILON = 1e-12;

function isFiniteNumber(value: number): boolean {
  return Number.isFinite(value) && !Number.isNaN(value);
}

function applyAxisScale(value: number, scale: AxisScale): number | null {
  if (!isFiniteNumber(value)) {
    return null;
  }

  if (scale === 'log') {
    if (value <= LOG_EPSILON) {
      return null;
    }
    return Math.log10(value);
  }

  return value;
}

function normalizeDomain(domain: AxisDomain): AxisDomain {
  if (domain.min === domain.max) {
    const delta = Math.abs(domain.min || 1) * 0.25;
    return {
      min: domain.min - delta,
      max: domain.max + delta,
    };
  }

  return domain;
}

function resolveDomain(values: number[], axis?: PlotAxisConfig): AxisDomain {
  const validValues = values.filter(isFiniteNumber);

  if (axis?.domain) {
    const start = applyAxisScale(axis.domain[0], axis.scale ?? 'linear');
    const end = applyAxisScale(axis.domain[1], axis.scale ?? 'linear');
    if (start !== null && end !== null && isFiniteNumber(start) && isFiniteNumber(end)) {
      return normalizeDomain({
        min: Math.min(start, end),
        max: Math.max(start, end),
      });
    }
  }

  if (validValues.length === 0) {
    return { min: 0, max: 1 };
  }

  return normalizeDomain({
    min: Math.min(...validValues),
    max: Math.max(...validValues),
  });
}

function seriesType(series: Plot2DSeries): 'line' | 'scatter' | 'line+scatter' {
  if (series.type === 'line' || series.type === 'scatter' || series.type === 'line+scatter') {
    return series.type;
  }
  return 'line';
}

export function adapt2DSeries(
  data: Plot2DSeries[],
  xAxis: PlotAxisConfig | undefined,
  yAxis: PlotAxisConfig | undefined,
  fallbackSeriesColors: string[],
): { series: Adapted2DSeries[]; layout: Plot2DLayout } {
  const xScale = xAxis?.scale ?? 'linear';
  const yScale = yAxis?.scale ?? 'linear';

  const series = data.map((entry, index) => {
    const points: Adapted2DPoint[] = entry.points
      .map((point) => {
        const x = applyAxisScale(point.x, xScale);
        const y = applyAxisScale(point.y, yScale);
        if (x === null || y === null || !isFiniteNumber(x) || !isFiniteNumber(y)) {
          return null;
        }
        return {
          original: point,
          x,
          y,
        };
      })
      .filter((point): point is Adapted2DPoint => point !== null);

    return {
      name: entry.name,
      color: entry.color ?? fallbackSeriesColors[index % fallbackSeriesColors.length] ?? '#2563eb',
      type: seriesType(entry),
      lineWidth: entry.lineWidth ?? 2.5,
      pointSize: entry.pointSize ?? 8,
      points,
    } satisfies Adapted2DSeries;
  }).filter((entry) => entry.points.length > 0);

  const allX = series.flatMap((entry) => entry.points.map((point) => point.x));
  const allY = series.flatMap((entry) => entry.points.map((point) => point.y));

  const layout: Plot2DLayout = {
    xDomain: resolveDomain(allX, xAxis),
    yDomain: resolveDomain(allY, yAxis),
  };

  return { series, layout };
}

export interface Adapted3DPoint {
  original: Plot3DPoint;
  x: number;
  y: number;
  z: number;
  value: number;
}

export interface Adapted3DSurface {
  name: string;
  color: string | undefined;
  opacity: number;
  colorBy: 'z' | 'value';
  colorMap: Plot3DSurface['colorMap'];
  points: Adapted3DPoint[];
  triangles: Array<[number, number, number]>;
}

export interface Plot3DLayout {
  xDomain: AxisDomain;
  yDomain: AxisDomain;
  zDomain: AxisDomain;
}

export interface Adapted3DData {
  pointCloud: Adapted3DPoint[];
  pointColor?: string;
  pointSize: number;
  pointColorMap: Plot3DData['pointColorMap'];
  surfaces: Adapted3DSurface[];
  layout: Plot3DLayout;
  valueRange: [number, number];
}

function transform3DPoint(
  point: Plot3DPoint,
  xScale: AxisScale,
  yScale: AxisScale,
  zScale: AxisScale,
): Adapted3DPoint | null {
  const x = applyAxisScale(point.x, xScale);
  const y = applyAxisScale(point.y, yScale);
  const z = applyAxisScale(point.z, zScale);

  if (x === null || y === null || z === null) {
    return null;
  }

  if (!isFiniteNumber(x) || !isFiniteNumber(y) || !isFiniteNumber(z)) {
    return null;
  }

  return {
    original: point,
    x,
    y,
    z,
    value: point.value ?? point.z,
  };
}

function normalizeTriangleIndices(
  triangles: Array<[number, number, number]>,
  maxIndex: number,
): Array<[number, number, number]> {
  return triangles.filter(([a, b, c]) => (
    Number.isInteger(a)
    && Number.isInteger(b)
    && Number.isInteger(c)
    && a >= 0
    && b >= 0
    && c >= 0
    && a <= maxIndex
    && b <= maxIndex
    && c <= maxIndex
  ));
}

function resolveValueRange(values: number[]): [number, number] {
  const valid = values.filter(isFiniteNumber);
  if (valid.length === 0) {
    return [0, 1];
  }
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  if (min === max) {
    const delta = Math.abs(min || 1) * 0.25;
    return [min - delta, max + delta];
  }
  return [min, max];
}

export function adapt3DData(
  data: Plot3DData,
  xAxis: PlotAxisConfig | undefined,
  yAxis: PlotAxisConfig | undefined,
  zAxis: PlotAxisConfig | undefined,
): Adapted3DData {
  const xScale = xAxis?.scale ?? 'linear';
  const yScale = yAxis?.scale ?? 'linear';
  const zScale = zAxis?.scale ?? 'linear';

  const pointCloud = (data.points ?? [])
    .map((point) => transform3DPoint(point, xScale, yScale, zScale))
    .filter((point): point is Adapted3DPoint => point !== null);

  const surfaces = (data.surfaces ?? [])
    .map((surface, index) => {
      const points = surface.points
        .map((point) => transform3DPoint(point, xScale, yScale, zScale))
        .filter((point): point is Adapted3DPoint => point !== null);

      if (points.length < 3) {
        return null;
      }

      const triangles = normalizeTriangleIndices(surface.triangles, points.length - 1);
      if (triangles.length === 0) {
        return null;
      }

      return {
        name: surface.name ?? `surface-${index + 1}`,
        color: surface.color,
        opacity: surface.opacity ?? 0.85,
        colorBy: surface.colorBy ?? 'value',
        colorMap: surface.colorMap,
        points,
        triangles,
      } satisfies Adapted3DSurface;
    })
    .filter((surface): surface is Adapted3DSurface => surface !== null);

  const allPoints = [
    ...pointCloud,
    ...surfaces.flatMap((surface) => surface.points),
  ];

  const layout: Plot3DLayout = {
    xDomain: resolveDomain(allPoints.map((point) => point.x), xAxis),
    yDomain: resolveDomain(allPoints.map((point) => point.y), yAxis),
    zDomain: resolveDomain(allPoints.map((point) => point.z), zAxis),
  };

  const valueRange = resolveValueRange(
    allPoints.map((point) => point.value),
  );

  return {
    pointCloud,
    pointColor: data.pointColor,
    pointSize: data.pointSize ?? 6,
    pointColorMap: data.pointColorMap,
    surfaces,
    layout,
    valueRange,
  };
}

export function formatAxisValue(value: number, scale: AxisScale): string {
  if (!isFiniteNumber(value)) {
    return 'n/a';
  }

  if (scale === 'log') {
    const actual = 10 ** value;
    return actual.toExponential(2);
  }

  if (Math.abs(value) >= 1_000 || Math.abs(value) < 0.001) {
    return value.toExponential(2);
  }

  return value.toFixed(3);
}
