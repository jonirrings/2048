"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Tile, GRID_SIZE } from "@/lib/constants";

interface WebGPUAnimationProps {
  tiles: Tile[];
  size: number;
}

const TILE_COLORS: Record<number, [number, number, number]> = {
  2: [0.933, 0.894, 0.855],
  4: [0.929, 0.878, 0.784],
  8: [0.949, 0.694, 0.475],
  16: [0.961, 0.576, 0.388],
  32: [0.965, 0.369, 0.373],
  64: [0.965, 0.369, 0.231],
  128: [0.929, 0.812, 0.447],
  256: [0.929, 0.8, 0.38],
  512: [0.929, 0.784, 0.314],
  1024: [0.929, 0.773, 0.247],
  2048: [0.929, 0.761, 0.18],
};

const vertexShaderCode = `
  struct Uniforms {
    resolution: vec2f,
  }

  @group(0) @binding(0) var<uniform> uniforms: Uniforms;

  struct VertexInput {
    @location(0) position: vec2f,
    @location(1) color: vec3f,
  }

  struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec3f,
  }

  @vertex
  fn vertexMain(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let clipSpace = (input.position / uniforms.resolution) * 2.0 - 1.0;
    output.position = vec4f(clipSpace * vec2f(1, -1), 0, 1);
    output.color = input.color;
    return output;
  }
`;

const fragmentShaderCode = `
  struct FragmentInput {
    @location(0) color: vec3f,
  }

  @fragment
  fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
    return vec4f(input.color, 1.0);
  }
`;

export function WebGPUAnimation({ tiles, size }: WebGPUAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deviceRef = useRef<GPUDevice | null>(null);
  const pipelineRef = useRef<GPURenderPipeline | null>(null);
  const uniformBufferRef = useRef<GPUBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cellSize = useMemo(() => {
    const gap = 8;
    return (size - gap * (GRID_SIZE + 1)) / GRID_SIZE;
  }, [size]);

  // Initialize WebGPU
  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!canvasRef.current) return;

      const adapter = await navigator.gpu?.requestAdapter();
      if (!adapter) {
        setError("WebGPU not supported");
        return;
      }

      const device = await adapter.requestDevice();
      if (!mounted || !device) return;

      deviceRef.current = device;

      const context = canvasRef.current.getContext("webgpu");
      if (!context) {
        setError("WebGPU context not available");
        return;
      }

      const format = navigator.gpu.getPreferredCanvasFormat();
      (context as GPUCanvasContext).configure({ device, format, alphaMode: "premultiplied" });

      const shaderModule = device.createShaderModule({
        code: vertexShaderCode + fragmentShaderCode,
      });

      const vertexBufferLayout: GPUVertexBufferLayout[] = [
        {
          arrayStride: 20, // 2 floats for position + 3 floats for color
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x2" },
            { shaderLocation: 1, offset: 8, format: "float32x3" },
          ],
        },
      ];

      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: {
          module: shaderModule,
          entryPoint: "vertexMain",
          buffers: vertexBufferLayout,
        },
        fragment: {
          module: shaderModule,
          entryPoint: "fragmentMain",
          targets: [{ format }],
        },
        primitive: { topology: "triangle-list" },
      });

      pipelineRef.current = pipeline;

      const uniformBuffer = device.createBuffer({
        size: 8, // vec2f
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      uniformBufferRef.current = uniformBuffer;
    }

    init();

    return () => {
      mounted = false;
      deviceRef.current?.destroy();
    };
  }, [size]);

  // Render
  useEffect(() => {
    const device = deviceRef.current;
    const pipeline = pipelineRef.current;
    const uniformBuffer = uniformBufferRef.current;
    const canvas = canvasRef.current;

    if (!device || !pipeline || !uniformBuffer || !canvas) return;

    const context = canvas.getContext("webgpu");
    if (!context) return;

    const commandEncoder = device.createCommandEncoder();
    const textureView = (context as GPUCanvasContext).getCurrentTexture().createView();

    const renderPass: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.98, g: 0.97, b: 0.94, a: 1.0 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPass);
    passEncoder.setPipeline(pipeline);

    // Update uniform
    device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([size, size]));

    const bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });
    passEncoder.setBindGroup(0, bindGroup);

    const gap = 8;
    const vertices: number[] = [];

    // Grid cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = gap + col * (cellSize + gap);
        const y = gap + row * (cellSize + gap);
        const color: [number, number, number] = [0.722, 0.678, 0.627];

        // Two triangles for each cell
        vertices.push(
          x,
          y,
          ...color,
          x + cellSize,
          y,
          ...color,
          x,
          y + cellSize,
          ...color,
          x,
          y + cellSize,
          ...color,
          x + cellSize,
          y,
          ...color,
          x + cellSize,
          y + cellSize,
          ...color,
        );
      }
    }

    // Tiles
    for (const tile of tiles) {
      const x = gap + tile.col * (cellSize + gap);
      const y = gap + tile.row * (cellSize + gap);
      const color = TILE_COLORS[tile.value] || [0.235, 0.227, 0.196];

      vertices.push(
        x,
        y,
        ...color,
        x + cellSize,
        y,
        ...color,
        x,
        y + cellSize,
        ...color,
        x,
        y + cellSize,
        ...color,
        x + cellSize,
        y,
        ...color,
        x + cellSize,
        y + cellSize,
        ...color,
      );
    }

    const vertexBuffer = device.createBuffer({
      size: vertices.length * 4,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(vertexBuffer, 0, new Float32Array(vertices));
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.draw(vertices.length / 5);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);

    vertexBuffer.destroy();
  }, [tiles, size, cellSize]);

  if (error) {
    return (
      <div className="flex items-center justify-center bg-[#faf8ef] rounded-lg text-red-500">
        {error}
      </div>
    );
  }

  return <canvas ref={canvasRef} width={size} height={size} className="block rounded-lg" />;
}
