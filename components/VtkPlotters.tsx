'use client';

import Plot2D from '@/components/plotters/Plot2D';
import Plot3D from '@/components/plotters/Plot3D';
import {
  Plot2DPoint,
  Plot2DProps,
  Plot3DPoint,
  Plot3DProps,
  Plot3DSurface,
} from '@/lib/plot/types';

export type { Plot2DProps, Plot3DProps, Plot2DPoint, Plot3DPoint, Plot3DSurface } from '@/lib/plot/types';

export { Plot2D, Plot3D };

export interface LinePlot2DProps extends Omit<Plot2DProps, 'data'> {
  points: Plot2DPoint[];
  name?: string;
  color?: string;
}

export function LinePlot2D({
  points,
  name = 'Line',
  color,
  ...rest
}: LinePlot2DProps) {
  return (
    <Plot2D
      data={[
        {
          name,
          points,
          type: 'line',
          color,
        },
      ]}
      {...rest}
    />
  );
}

export interface ScatterPlot2DProps extends Omit<Plot2DProps, 'data'> {
  points: Plot2DPoint[];
  name?: string;
  color?: string;
}

export function ScatterPlot2D({
  points,
  name = 'Scatter',
  color,
  ...rest
}: ScatterPlot2DProps) {
  return (
    <Plot2D
      data={[
        {
          name,
          points,
          type: 'scatter',
          color,
        },
      ]}
      {...rest}
    />
  );
}

export interface PointCloud3DProps extends Omit<Plot3DProps, 'data'> {
  points: Plot3DPoint[];
  pointColor?: string;
  pointColorMap?: Plot3DProps['data']['pointColorMap'];
  pointSize?: number;
}

export function PointCloud3D({
  points,
  pointColor,
  pointColorMap,
  pointSize,
  ...rest
}: PointCloud3DProps) {
  return (
    <Plot3D
      data={{
        points,
        pointColor,
        pointColorMap,
        pointSize,
      }}
      {...rest}
    />
  );
}

export interface SurfacePlot3DProps extends Omit<Plot3DProps, 'data'> {
  surface: Plot3DSurface;
}

export function SurfacePlot3D({
  surface,
  ...rest
}: SurfacePlot3DProps) {
  return (
    <Plot3D
      data={{
        surfaces: [surface],
      }}
      {...rest}
    />
  );
}
