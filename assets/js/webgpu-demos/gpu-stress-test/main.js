// =============================================================================
// TEST 1: The working "Simple Triangle" test.
// =============================================================================
async function runSuccessTest(canvasId, statusId) {
  const canvas = document.getElementById(canvasId);
  const statusText = document.getElementById(statusId);

  function showError(message) {
    canvas.style.display = 'none';
    if (statusText)
      statusText.innerHTML = `<div class="fail-box" style="border: 2px solid #f44336; padding: 20px;"><strong>A Critical Error Occurred:</strong><br><br>${message}</div>`;
  }

  try {
    if (!navigator.gpu) {
      throw new Error('WebGPU not supported.');
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error('Failed to get a GPU adapter.');
    }
    const device = await adapter.requestDevice();

    const context = canvas.getContext('webgpu');
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format: presentationFormat });

    const vertices = new Float32Array([
      0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0,
    ]);
    const vertexBuffer = device.createBuffer({
      size: vertices.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });
    new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
    vertexBuffer.unmap();

    const shaderCode = `
            @vertex fn vs_main(@location(0) position: vec3<f32>) -> @builtin(position) vec4<f32> { return vec4<f32>(position, 1.0); }
            @fragment fn fs_main() -> @location(0) vec4<f32> { return vec4<f32>(1.0, 0.5, 0.0, 1.0); }
        `;
    const shaderModule = device.createShaderModule({ code: shaderCode });

    const pipeline = device.createRenderPipeline({
      layout: device.createPipelineLayout({ bindGroupLayouts: [] }),
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [
          {
            arrayStride: 12,
            attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
          },
        ],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [{ format: presentationFormat }],
      },
      primitive: { topology: 'triangle-list' },
    });

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.1, g: 0.1, b: 0.2, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    };
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.draw(3);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);

    if (statusText)
      statusText.textContent = 'Success Case: Rendered successfully.';
  } catch (err) {
    showError(err.message);
  }
}

// =============================================================================
// TEST 2: The failing "Hello Cube" test.
// =============================================================================
async function runFailureTest(canvasId, statusId) {
  const canvas = document.getElementById(canvasId);
  const statusText = document.getElementById(statusId);

  function showError(message) {
    canvas.style.display = 'none';
    if (statusText)
      statusText.innerHTML = `<div class="fail-box" style="border: 2px solid #f44336; padding: 20px;"><strong>A Critical Error Occurred:</strong><br><br>${message}</div>`;
  }

  try {
    if (typeof glMatrix === 'undefined') {
      throw new Error('gl-matrix library not loaded.');
    }
    if (!navigator.gpu) {
      throw new Error('WebGPU not supported.');
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error('Failed to get GPU adapter.');
    }
    const device = await adapter.requestDevice();

    const context = canvas.getContext('webgpu');
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format: presentationFormat });

    const cubeVertices = new Float32Array([
      1, -1, 1, 1, 1, 1, 1, 1, -1, 1, -1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1,
      -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1, 1, -1, -1, 1, -1, 1, -1, 1, 1, -1,
      1, 1, 1, -1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, 1, -1, 1, -1,
      1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, 1, -1,
      -1, -1, -1, 1, -1, -1,
    ]);
    const vertexBuffer = device.createBuffer({
      size: cubeVertices.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    });
    new Float32Array(vertexBuffer.getMappedRange()).set(cubeVertices);
    vertexBuffer.unmap();

    const shaderCode = `
            struct Uniforms { mvp_matrix: mat4x4<f32> };
            @group(0) @binding(0) var<uniform> uniforms: Uniforms;
            @vertex fn vs_main(@location(0) position: vec3<f32>) -> @builtin(position) vec4<f32> { return uniforms.mvp_matrix * vec4<f32>(position, 1.0); }
            @fragment fn fs_main() -> @location(0) vec4<f32> { return vec4<f32>(1.0, 0.5, 0.0, 1.0); }
        `;
    const shaderModule = device.createShaderModule({ code: shaderCode });

    const pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
        buffers: [
          {
            arrayStride: 12,
            attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x3' }],
          },
        ],
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [{ format: presentationFormat }],
      },
      primitive: { topology: 'triangle-list', cullMode: 'none' },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus',
      },
    });

    const depthTexture = device.createTexture({
      size: [canvas.width, canvas.height],
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    const uniformBuffer = device.createBuffer({
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const mvpMatrix = glMatrix.mat4.create();
    const projectionMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(
      projectionMatrix,
      (2 * Math.PI) / 5,
      canvas.width / canvas.height,
      0.1,
      100.0
    );
    const viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(viewMatrix, [0, 1, 4], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
    device.queue.writeBuffer(uniformBuffer, 0, mvpMatrix);

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();
    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.1, g: 0.1, b: 0.2, a: 1.0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      },
    };
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.draw(36);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);

    if (statusText)
      statusText.textContent =
        'Failure Case: Code ran without error, but may result in a black screen.';
  } catch (err) {
    showError(err.message);
  }
}

// Attach both functions to the window object
window.runSuccessTest = runSuccessTest;
window.runFailureTest = runFailureTest;
