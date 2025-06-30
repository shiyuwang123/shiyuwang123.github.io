---
title: "A WebGPU Debugging Journey: The Black Screen"
date: 2025-06-26 21:09:12 +0800
categories: [Programming, WebGPU]
tags: [graphics, debugging, jekyll]
---

After an extensive debugging session, I discovered a fascinating bug with my specific hardware/driver/browser combination. The simplest possible WebGPU test works perfectly, but as soon as a uniform buffer for a 3D camera is introduced, the rendering fails silently.

Below are both tests running side-by-side.

### Test 1: The Success Case (A Simple Triangle)

This test removes all libraries, math, and uniforms. It draws a single hardcoded triangle and is **expected to work** on all compatible browsers.

<canvas id="webgpu-canvas-success"
        width="800"
        height="600"
        style="border: 1px solid #ccc; display: block; margin: auto;">
</canvas>
<p id="status-text-success" style="text-align: center; font-style: italic;"></p>

---

### Test 2: The Failure Case (A Single Cube)

This test adds back the `gl-matrix` library to handle 3D perspective and a uniform buffer to pass camera data to the GPU. On my machine, this test **results in a black screen**, even though the code runs to completion. It may work for you, depending on your environment.

<canvas id="webgpu-canvas-fail"
        width="800"
        height="600"
        style="border: 1px solid #ccc; display: block; margin: auto;">
</canvas>
<p id="status-text-fail" style="text-align: center; font-style: italic;"></p>

<!-- Load libraries and the main script once for the whole page -->
<script src="{{ '/assets/js/libs/gl-matrix-min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/webgpu-demos/gpu-stress-test/main.js' | relative_url }}"></script>

<!-- Run both initialization functions -->
<script>
  document.addEventListener('DOMContentLoaded', (event) => {
    if (window.runSuccessTest) {
      window.runSuccessTest('webgpu-canvas-success', 'status-text-success');
    }
    if (window.runFailureTest) {
      window.runFailureTest('webgpu-canvas-fail', 'status-text-fail');
    }
  });
</script>