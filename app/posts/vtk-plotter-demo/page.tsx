import PostLayout from '@/components/PostLayout';
import {
  LinePlot2D,
  Plot2D,
  Plot3D,
  type Plot2DPoint,
  type Plot3DPoint,
  type Plot3DSurface,
} from '@/components/VtkPlotters';

function buildWaveSurface(rows = 22, cols = 22): Plot3DSurface {
  const points: Plot3DPoint[] = [];
  const triangles: Array<[number, number, number]> = [];

  for (let row = 0; row < rows; row += 1) {
    const y = -3 + (6 * row) / (rows - 1);
    for (let col = 0; col < cols; col += 1) {
      const x = -3 + (6 * col) / (cols - 1);
      const radial = Math.sqrt(x * x + y * y);
      const z = Math.cos(radial * 1.4) * Math.exp(-radial / 4);
      points.push({ x, y, z, value: z });
    }
  }

  for (let row = 0; row < rows - 1; row += 1) {
    for (let col = 0; col < cols - 1; col += 1) {
      const a = row * cols + col;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      triangles.push([a, b, c]);
      triangles.push([b, d, c]);
    }
  }

  return {
    name: 'Damped Wave Surface',
    points,
    triangles,
    colorMap: 'viridis',
    colorBy: 'z',
    opacity: 0.92,
  };
}

function buildHelixCloud(count = 240): Plot3DPoint[] {
  return Array.from({ length: count }, (_, index) => {
    const t = (index / Math.max(1, count - 1)) * 10 * Math.PI;
    const radius = 0.5 + (index / count) * 2.2;
    const noise = Math.sin(index * 0.41) * 0.08;
    const x = Math.cos(t) * radius + noise;
    const y = Math.sin(t) * radius - noise;
    const z = -2 + (index / count) * 4;
    return {
      x,
      y,
      z,
      value: radius,
    };
  });
}

const directSeries = [
  {
    name: 'signal-a',
    type: 'line+scatter' as const,
    points: Array.from({ length: 72 }, (_, index) => {
      const t = index / 8;
      return {
        x: t,
        y: Math.exp(-t / 7) * Math.sin(t * 1.8),
      };
    }),
  },
  {
    name: 'signal-b',
    type: 'line' as const,
    points: Array.from({ length: 72 }, (_, index) => {
      const t = index / 8;
      return {
        x: t,
        y: Math.exp(-t / 6.4) * Math.cos(t * 1.35) * 0.85,
      };
    }),
  },
];

const logWrapperPoints: Plot2DPoint[] = Array.from({ length: 25 }, (_, index) => {
  const x = index + 1;
  const y = 1 + x * x * 0.18;
  return { x, y };
});

export default function VtkPlotterDemo() {
  const waveSurface = buildWaveSurface();
  const helixCloud = buildHelixCloud();

  return (
    <PostLayout
      title="vtk.js Plotters Demo"
      date="2026-03-16 16:20:00 -0700"
      categories={['Data Visualization', 'Test']}
      tags={['vtk.js', 'plotter', 'next.js', 'interactive']}
      isHighlight={false}
    >
      <p className="text-xl text-muted-foreground mb-10">
        This post demonstrates the new vtk.js plotting toolkit for this blog: direct 2D and 3D APIs plus wrapper shortcuts for fast authoring.
      </p>

      <h2>1. Direct API: 2D Plotter</h2>
      <p>
        This chart uses <strong>two named series</strong>, explicit axis titles, linear scaling, pan/zoom, and point picking tooltips.
      </p>

      <Plot2D
        title="Coupled Damped Oscillators"
        description="Pan and zoom to inspect the response curves. Hover to inspect picked points."
        data={directSeries}
        xAxis={{ title: 'time (s)', scale: 'linear' }}
        yAxis={{ title: 'amplitude', scale: 'linear' }}
        legend={{ title: 'Direct 2D Series', show: true }}
        grid={{ show: true, majorDivisions: 9 }}
        interactions={{ panZoom: true, pointPicking: true }}
      />

      <h2>2. Direct API: 3D Plotter</h2>
      <p>
        The 3D scene combines a scalar-colored point cloud with a triangulated surface. Orbit, pan, and zoom are enabled. Use clipping and slicing sliders to inspect internal geometry.
      </p>

      <Plot3D
        title="Point Cloud + Surface"
        description="Point picking, clipping, and slicing are enabled in this direct API example."
        data={{
          points: helixCloud,
          pointColorMap: 'plasma',
          pointSize: 7,
          surfaces: [waveSurface],
        }}
        xAxis={{ title: 'x', scale: 'linear' }}
        yAxis={{ title: 'y', scale: 'linear' }}
        zAxis={{ title: 'z', scale: 'linear' }}
        legend={{ title: 'Direct 3D Layers', show: true }}
        grid={{ show: true, majorDivisions: 8 }}
        interactions={{
          orbitPanZoom: true,
          pointPicking: true,
          clipping: true,
          slicing: true,
        }}
        clippingAxis="z"
        slicingAxis="x"
        cameraPreset="isometric"
      />

      <h2>3. Wrapper API: LinePlot2D</h2>
      <p>
        Wrappers are intentionally concise for common cases. This one uses a log-scale y-axis with a single line series.
      </p>

      <LinePlot2D
        title="Wrapper Example: Growth Curve"
        description="Same rendering engine, less boilerplate for single-series charts."
        points={logWrapperPoints}
        name="growth"
        xAxis={{ title: 'step', scale: 'linear' }}
        yAxis={{ title: 'metric', scale: 'log' }}
        legend={{ title: 'Wrapper Series', show: true }}
        interactions={{ panZoom: true, pointPicking: true }}
      />

      <p className="text-lg font-medium bg-muted p-6 rounded-2xl border border-border mt-8">
        <strong>Developer note:</strong> Import plotters from <code>@/components/VtkPlotters</code> in any post page and pass plain data arrays plus style settings.
      </p>
    </PostLayout>
  );
}
