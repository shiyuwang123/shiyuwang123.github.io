# Developer Documentation

## How to Add a New Post

This blog is built with Next.js and TypeScript. Posts are written directly as React components.

### 1. Create a new page

Create a new folder in `app/posts/` with your post's slug (e.g., `my-new-post`).
Inside that folder, create a `page.tsx` file.

### 2. Structure the component

Use the `PostLayout` component to wrap your content. You can use standard HTML/React elements,
as well as the provided `CodeBlock` and `Math` components for rich content.

### 3. Register the post

You don't need to do anything else! The blog automatically scans the `app/posts/` directory and extracts the metadata (title, date, categories, tags, isHighlight) directly from your `page.tsx` file.

### 4. Set Highlights for the Home Page

To manually choose which posts appear in the "Highlights" section on the home page, simply add the `isHighlight={true}` prop to the `<PostLayout>` component in your post's `page.tsx` file.

### Example Post Template

```tsx
import PostLayout from '@/components/PostLayout';
import CodeBlock from '@/components/CodeBlock';
import Math from '@/components/Math';

export default function MyNewPost() {
  return (
    <PostLayout
      title="My New Post"
      date="2026-01-01 12:00:00 +0800"
      categories={['Tech']}
      tags={['nextjs', 'react']}
      isHighlight={true}
    >
      <p>This is the introduction to my new post.</p>
      
      <h2>Section 1</h2>
      <p>Here is some math:</p>
      <Math math="E = mc^2" block />
      
      <h2>Section 2</h2>
      <p>Here is some code:</p>
      <CodeBlock language="typescript" code="const x = 1;" />
    </PostLayout>
  );
}
```

---

## How to Deploy to GitHub Pages Manually

This project is configured for static export, making it fully compatible with GitHub Pages.

### 1. Configure the Base Path (Optional)

If you are deploying to a user site (e.g., `https://<username>.github.io`), you don't need to change anything.

If you are deploying to a project site (e.g., `https://<username>.github.io/<repository-name>`), you must update `next.config.ts` to include the `basePath`:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // ...
  output: 'export',
  basePath: '/<repository-name>', // Uncomment and set this to your repository name
  // ...
};
```

### 2. Build the Project

Run the following command to generate the static files:

```bash
bun run build
```

This will create an `out` directory containing your fully compiled static website.

### 3. Deploy the `out` Folder

You need to push the contents of the `out` directory to your repository (typically to a branch named `gh-pages` or `main` depending on your GitHub Pages settings).

A common manual deployment workflow using `git` is:

```bash
# Navigate into the build output directory
cd out

# Initialize a new git repository
git init
git checkout -b main

# Add and commit the files
git add -A
git commit -m "Deploy to GitHub Pages"

# Force push to the gh-pages branch of your repository
git push -f git@github.com:<username>/<repository-name>.git main:gh-pages
```

### 4. Configure GitHub Pages Settings

1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment**, set the **Source** to **Deploy from a branch**.
4. Select the `gh-pages` branch and the `/ (root)` folder.
5. Click **Save**.

Your site will be live at your GitHub Pages URL shortly!

---

## Structure & Main APIs

### Directory Structure

- `app/`: Next.js App Router pages.
- `app/posts/`: Individual blog post pages.
- `components/`: Reusable React components.
- `lib/`: Utility functions and data (e.g., `posts.ts`).
- `public/`: Static assets like images.
- `public/assets/`: Directory for pictures, videos, and other assets.

### Components API

#### `<PostLayout />`
The main wrapper for blog posts. Handles typography, metadata, and animations.
- `title` (string): The title of the post.
- `date` (string): The publication date.
- `categories` (string[]): Optional array of categories.
- `tags` (string[]): Optional array of tags.
- `isHighlight` (boolean): Optional. Set to `true` to feature the post on the home page.
- `children` (ReactNode): The content of the post.

#### `<CodeBlock />`
Renders syntax-highlighted code snippets using `react-syntax-highlighter`.
- `language` (string): The programming language (e.g., 'typescript', 'python').
- `code` (string): The source code to highlight.

#### `<Math />`
Renders LaTeX math formulas using KaTeX.
- `math` (string): The LaTeX formula.
- `block` (boolean): Optional. Set to `true` for block-level display equations.

#### `vtk.js Plotters`
Interactive plotting utilities are available through `@/components/VtkPlotters`.

```tsx
import { Plot2D, Plot3D, LinePlot2D, PointCloud3D } from '@/components/VtkPlotters';
```

##### Direct API: `<Plot2D />`
- `data` (Plot2DSeries[]): Required array of named series.
- `xAxis`, `yAxis`: Axis settings with `title`, `scale` (`linear` or `log`), optional `domain`.
- `legend`: `{ title?: string; show?: boolean }`.
- `grid`: `{ show?: boolean; majorDivisions?: number }`.
- `interactions`: `{ panZoom?: boolean; pointPicking?: boolean }`.
- `height`: Optional fixed chart height.

Example:

```tsx
<Plot2D
  title="Loss Curves"
  xAxis={{ title: 'Epoch', scale: 'linear' }}
  yAxis={{ title: 'Loss', scale: 'log' }}
  interactions={{ panZoom: true, pointPicking: true }}
  legend={{ title: 'Training Runs' }}
  data={[
    { name: 'run-a', type: 'line', points: [{ x: 1, y: 0.8 }, { x: 2, y: 0.4 }] },
    { name: 'run-b', type: 'line+scatter', points: [{ x: 1, y: 1.0 }, { x: 2, y: 0.55 }] },
  ]}
/>
```

##### Direct API: `<Plot3D />`
- `data`: `{ points?: Plot3DPoint[]; surfaces?: Plot3DSurface[]; pointSize?; pointColor?; pointColorMap? }`.
- `xAxis`, `yAxis`, `zAxis`: Axis settings with `title`, `scale`, optional `domain`.
- `interactions`: `{ orbitPanZoom?: boolean; pointPicking?: boolean; clipping?: boolean; slicing?: boolean }`.
- `cameraPreset`: `isometric`, `top`, `front`, or `side`.
- `clippingAxis`, `slicingAxis`: `x`, `y`, or `z`.

Example:

```tsx
<Plot3D
  title="Field Visualization"
  xAxis={{ title: 'x', scale: 'linear' }}
  yAxis={{ title: 'y', scale: 'linear' }}
  zAxis={{ title: 'z', scale: 'linear' }}
  cameraPreset="isometric"
  clippingAxis="z"
  slicingAxis="x"
  interactions={{ orbitPanZoom: true, pointPicking: true, clipping: true, slicing: true }}
  data={{
    points: [{ x: 0, y: 0, z: 0, value: 0.2 }],
    pointColorMap: 'viridis',
  }}
/>
```

##### Wrapper API
- `LinePlot2D`: Fast single-series line chart wrapper.
- `ScatterPlot2D`: Fast single-series scatter chart wrapper.
- `PointCloud3D`: Fast point-cloud wrapper.
- `SurfacePlot3D`: Fast single-surface wrapper.

Example:

```tsx
<LinePlot2D
  title="Growth"
  xAxis={{ title: 'Step', scale: 'linear' }}
  yAxis={{ title: 'Metric', scale: 'linear' }}
  interactions={{ panZoom: true, pointPicking: true }}
  points={[
    { x: 1, y: 2.0 },
    { x: 2, y: 2.6 },
    { x: 3, y: 3.1 },
  ]}
/>
```

##### Theme Support
Plot colors are bound to CSS variables in `app/globals.css` and automatically sync with system light/dark mode changes.

##### Utility Modules
Shared utilities are located in:
- `lib/plot/types.ts` (typed API contracts)
- `lib/plot/adapters.ts` (array-to-plot adapters and scale transforms)
- `lib/plot/colors.ts` (colormaps and color conversion helpers)
- `lib/plot/presets.ts` (axes, grid, and camera presets)
- `hooks/use-plot-theme.ts` (live theme token sync)
- `hooks/use-responsive-plot-size.ts` (responsive resize handling)
