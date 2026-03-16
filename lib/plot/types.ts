export type AxisScale = 'linear' | 'log';

export type Plot2DSeriesMode = 'line' | 'scatter' | 'line+scatter';

export type ColorMapName = 'viridis' | 'plasma' | 'inferno' | 'magma' | 'cividis';

export type AxisKey = 'x' | 'y' | 'z';

export type CameraPreset = 'isometric' | 'top' | 'front' | 'side';

export interface PlotAxisConfig {
  title?: string;
  scale?: AxisScale;
  domain?: [number, number];
}

export interface PlotLegendConfig {
  title?: string;
  show?: boolean;
}

export interface PlotGridConfig {
  show?: boolean;
  majorDivisions?: number;
}

export interface Plot2DInteractionConfig {
  panZoom?: boolean;
  pointPicking?: boolean;
}

export interface Plot3DInteractionConfig {
  orbitPanZoom?: boolean;
  pointPicking?: boolean;
  clipping?: boolean;
  slicing?: boolean;
}

export interface Plot2DPoint {
  x: number;
  y: number;
  label?: string;
}

export interface Plot2DSeries {
  name: string;
  points: Plot2DPoint[];
  type?: Plot2DSeriesMode;
  color?: string;
  lineWidth?: number;
  pointSize?: number;
}

export interface Plot2DProps {
  data: Plot2DSeries[];
  title?: string;
  description?: string;
  xAxis?: PlotAxisConfig;
  yAxis?: PlotAxisConfig;
  legend?: PlotLegendConfig;
  grid?: PlotGridConfig;
  interactions?: Plot2DInteractionConfig;
  className?: string;
  height?: number;
  loadingText?: string;
  emptyText?: string;
}

export interface Plot3DPoint {
  x: number;
  y: number;
  z: number;
  value?: number;
  label?: string;
}

export interface Plot3DSurface {
  name?: string;
  points: Plot3DPoint[];
  triangles: Array<[number, number, number]>;
  color?: string;
  opacity?: number;
  colorMap?: ColorMapName;
  colorBy?: 'z' | 'value';
}

export interface Plot3DData {
  points?: Plot3DPoint[];
  pointSize?: number;
  pointColor?: string;
  pointColorMap?: ColorMapName;
  surfaces?: Plot3DSurface[];
}

export interface Plot3DProps {
  data: Plot3DData;
  title?: string;
  description?: string;
  xAxis?: PlotAxisConfig;
  yAxis?: PlotAxisConfig;
  zAxis?: PlotAxisConfig;
  legend?: PlotLegendConfig;
  grid?: PlotGridConfig;
  interactions?: Plot3DInteractionConfig;
  className?: string;
  height?: number;
  cameraPreset?: CameraPreset;
  clippingAxis?: AxisKey;
  clippingRatio?: number;
  slicingAxis?: AxisKey;
  slicingRatio?: number;
  loadingText?: string;
  emptyText?: string;
}

export interface PlotThemeTokens {
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  axis: string;
  grid: string;
  pick: string;
  series: string[];
}

export interface PlotLegendItem {
  name: string;
  color: string;
}

export interface PlotTooltipData {
  x: number;
  y: number;
  title: string;
  lines: string[];
}

export interface Adapted2DPoint {
  original: Plot2DPoint;
  x: number;
  y: number;
}

export interface Adapted2DSeries {
  name: string;
  color: string;
  type: Plot2DSeriesMode;
  lineWidth: number;
  pointSize: number;
  points: Adapted2DPoint[];
}

export interface AxisDomain {
  min: number;
  max: number;
}

export interface Plot2DLayout {
  xDomain: AxisDomain;
  yDomain: AxisDomain;
}
