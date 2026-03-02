"use client";

import { useRef, useEffect, useMemo } from "react";
import { Tile, GRID_SIZE } from "@/lib/constants";

interface WebGLAnimationProps {
  tiles: Tile[];
  size: number;
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  uniform vec2 u_resolution;

  void main() {
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_texCoord = a_texCoord;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec4 u_color;
  varying vec2 v_texCoord;

  void main() {
    gl_FragColor = u_color;
  }
`;

const TILE_COLORS: Record<number, [number, number, number, number]> = {
  2: [0.933, 0.894, 0.855, 1.0],
  4: [0.929, 0.878, 0.784, 1.0],
  8: [0.949, 0.694, 0.475, 1.0],
  16: [0.961, 0.576, 0.388, 1.0],
  32: [0.965, 0.369, 0.373, 1.0],
  64: [0.965, 0.369, 0.231, 1.0],
  128: [0.929, 0.812, 0.447, 1.0],
  256: [0.929, 0.8, 0.38, 1.0],
  512: [0.929, 0.784, 0.314, 1.0],
  1024: [0.929, 0.773, 0.247, 1.0],
  2048: [0.929, 0.761, 0.18, 1.0],
};

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export function WebGLAnimation({ tiles, size }: WebGLAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const positionBufferRef = useRef<WebGLBuffer | null>(null);

  const cellSize = useMemo(() => {
    const gap = 8;
    return (size - gap * (GRID_SIZE + 1)) / GRID_SIZE;
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    programRef.current = program;

    const positionBuffer = gl.createBuffer();
    positionBufferRef.current = positionBuffer;

    canvas.width = size;
    canvas.height = size;
    gl.viewport(0, 0, size, size);

    return () => {
      gl.deleteProgram(program);
      if (positionBuffer) gl.deleteBuffer(positionBuffer);
    };
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const program = programRef.current;
    const positionBuffer = positionBufferRef.current;

    if (!canvas || !program || !positionBuffer) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    gl.clearColor(0.98, 0.97, 0.94, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const colorLocation = gl.getUniformLocation(program, "u_color");

    gl.uniform2f(resolutionLocation, size, size);

    const gap = 8;

    // Draw grid cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const x = gap + col * (cellSize + gap);
        const y = gap + row * (cellSize + gap);

        const positions = new Float32Array([
          x,
          y,
          x + cellSize,
          y,
          x,
          y + cellSize,
          x,
          y + cellSize,
          x + cellSize,
          y,
          x + cellSize,
          y + cellSize,
        ]);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform4f(colorLocation, 0.722, 0.678, 0.627, 1.0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }

    // Draw tiles
    for (const tile of tiles) {
      const x = gap + tile.col * (cellSize + gap);
      const y = gap + tile.row * (cellSize + gap);

      const positions = new Float32Array([
        x,
        y,
        x + cellSize,
        y,
        x,
        y + cellSize,
        x,
        y + cellSize,
        x + cellSize,
        y,
        x + cellSize,
        y + cellSize,
      ]);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const color = TILE_COLORS[tile.value] || [0.235, 0.227, 0.196, 1.0];
      gl.uniform4f(colorLocation, color[0], color[1], color[2], color[3]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }, [tiles, size, cellSize]);

  return <canvas ref={canvasRef} className="block rounded-lg" />;
}
