import { AxisKey, CameraPreset, PlotGridConfig } from '@/lib/plot/types';

export const GRID_PRESETS: Record<string, PlotGridConfig> = {
  subtle: {
    show: true,
    majorDivisions: 8,
  },
  dense: {
    show: true,
    majorDivisions: 12,
  },
  minimal: {
    show: true,
    majorDivisions: 5,
  },
};

export const AXIS_TITLE_PRESETS: Record<AxisKey, string> = {
  x: 'X Axis',
  y: 'Y Axis',
  z: 'Z Axis',
};

export interface CameraPose {
  position: [number, number, number];
  focalPoint: [number, number, number];
  viewUp: [number, number, number];
}

const ROOT_2 = Math.SQRT2;

export const CAMERA_PRESETS: Record<CameraPreset, CameraPose> = {
  isometric: {
    position: [1.35 * ROOT_2, 1.2 * ROOT_2, 1.25 * ROOT_2],
    focalPoint: [0, 0, 0],
    viewUp: [0, 0, 1],
  },
  top: {
    position: [0, 0, 2.5],
    focalPoint: [0, 0, 0],
    viewUp: [0, 1, 0],
  },
  front: {
    position: [0, -2.5, 0],
    focalPoint: [0, 0, 0],
    viewUp: [0, 0, 1],
  },
  side: {
    position: [2.5, 0, 0],
    focalPoint: [0, 0, 0],
    viewUp: [0, 0, 1],
  },
};
