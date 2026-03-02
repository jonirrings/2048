# 2048 Game - Project Report

## Project Overview

A feature-rich 2048 game built with Rari, React, and Tailwind CSS, supporting multiple animation modes and diverse input methods.

## Tech Stack

- **Framework**: Rari (React Server Components)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite+
- **Language**: TypeScript

## Features

### Animation Modes

| Mode   | Technology      | Description                          |
| ------ | --------------- | ------------------------------------ |
| DOM    | CSS Transitions | React elements with CSS animations   |
| SVG    | SVG + CSS       | SVG elements with vector graphics    |
| WebGL  | WebGL 1/2       | Canvas-based 2D rendering            |
| WebGPU | WebGPU API      | Modern GPU rendering (auto-fallback) |

### Input Methods

| Method      | Platform | Description             |
| ----------- | -------- | ----------------------- |
| Keyboard    | Desktop  | WASD / Arrow keys       |
| Gamepad     | Desktop  | D-pad + Left stick      |
| Touch       | Mobile   | Swipe gestures          |
| Orientation | Mobile   | Device tilt (gyroscope) |

### Haptic Feedback

- **Mobile**: `navigator.vibrate()` API
- **Gamepad**: Gamepad vibration actuator (dual-rumble)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (RSC)
│   ├── page.tsx            # Game page (RSC)
│   └── globals.css         # Tailwind styles
├── components/
│   ├── animations/
│   │   ├── DOMAnimation.tsx
│   │   ├── SVGAnimation.tsx
│   │   ├── WebGLAnimation.tsx
│   │   └── WebGPUAnimation.tsx
│   ├── game/
│   │   ├── Game.tsx        # Main game component
│   │   ├── GameBoard.tsx   # Board with animation modes
│   │   ├── Score.tsx       # Score display
│   │   └── GameOver.tsx    # Game over overlay
│   └── ui/
│       └── Settings.tsx    # Settings panel
├── hooks/
│   ├── useGameLogic.ts     # Game state management
│   ├── useAnimations.ts    # Animation mode handling
│   ├── useKeyboard.ts      # Keyboard input
│   ├── useGamepad.ts       # Gamepad input
│   ├── useTouch.ts         # Touch swipe
│   ├── useOrientation.ts   # Device orientation
│   └── useHaptics.ts       # Vibration/rumble
└── lib/
    ├── gameEngine.ts       # Core game logic
    └── constants.ts        # Game constants
```

## Key Implementation Details

### Game Engine

The game engine (`src/lib/gameEngine.ts`) handles:

- Tile movement and merging
- Random tile generation
- Win/lose detection
- Score calculation

### Animation Mode Detection

```typescript
// Auto-detect available rendering modes
- WebGPU: Check `navigator.gpu`
- WebGL: Check canvas WebGL context
- Fallback: DOM mode always available
```

### Input Handling

- **Keyboard**: Event listener on `window.keydown`
- **Gamepad**: Polling via `requestAnimationFrame`
- **Touch**: Touch start/end events with swipe threshold
- **Orientation**: `DeviceOrientationEvent` with iOS permission handling

### Responsive Design

- Dynamic board sizing based on viewport
- Mobile-optimized touch targets
- Portrait/landscape support

## Build & Run

```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build

# Start development server
pnpm run dev
```

## Browser Support

| Feature           | Chrome | Firefox | Safari | Edge |
| ----------------- | ------ | ------- | ------ | ---- |
| DOM Animation     | ✓      | ✓       | ✓      | ✓    |
| SVG Animation     | ✓      | ✓       | ✓      | ✓    |
| WebGL             | ✓      | ✓       | ✓      | ✓    |
| WebGPU            | 113+   | ✗       | 17+    | 113+ |
| Gamepad API       | ✓      | ✓       | ✓      | ✓    |
| DeviceOrientation | ✓      | ✓       | ✓      | ✓    |
| Vibration API     | ✓      | ✓       | ✗      | ✓    |

## License

MIT
