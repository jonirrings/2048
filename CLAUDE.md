# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A 2048 game built with Rari (Runtime Accelerated Rendering Infrastructure), React 19, and Tailwind CSS 4. Features multiple animation modes (DOM, SVG, WebGL, WebGPU) and supports various input methods (keyboard, gamepad, touch, device orientation).

## Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm run dev          # Start development server (http://localhost:5173)

# Production
pnpm run build        # Build for production
pnpm run start        # Start production server

# Type checking
pnpm run typecheck    # Run TypeScript checks (uses tsgo)
```

## Architecture

### Rari Framework

- Uses React Server Components (RSC) with file-based routing
- Client components must use `'use client'` directive
- Entry point: `src/app/page.tsx` (RSC) → `Game` component (client)

### Key Directories

- `src/app/` - Rari pages and layouts (RSC)
- `src/components/` - React components (mostly client)
- `src/hooks/` - Custom React hooks for input handling
- `src/lib/` - Game engine and constants

### Animation System

Four rendering modes in `src/components/animations/`:

- `DOMAnimation.tsx` - CSS transitions on React elements
- `SVGAnimation.tsx` - SVG elements with vector graphics
- `WebGLAnimation.tsx` - WebGL canvas rendering
- `WebGPUAnimation.tsx` - WebGPU rendering with fallback

### Input Handling

- `useKeyboard.ts` - WASD and arrow keys
- `useGamepad.ts` - Gamepad D-pad and left stick
- `useTouch.ts` - Mobile swipe gestures
- `useOrientation.ts` - Device gyroscope (requires permission on iOS)

### Game Logic

Core game engine in `src/lib/gameEngine.ts` handles:

- Tile movement and merging
- Score calculation
- Win/lose detection

## Tech Stack

- **Runtime**: Rari (Node.js >= 22.12.0)
- **UI**: React 19, Tailwind CSS 4
- **Build**: Vite+ (via rari)
- **Types**: TypeScript with `@webgpu/types` for WebGPU
