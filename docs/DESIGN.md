# 2048 Game - Design Document

## 1. Architecture Design

### 1.1 Rari Compatibility

The project is designed to work with Rari's React Server Components (RSC):

- Client components use `'use client'` directive
- Server components handle static content (layout, metadata)
- Hydration via Rari's client entry point

### 1.2 Component Hierarchy

```
RootLayout (RSC)
└── HomePage (RSC)
    └── Game (Client)
        ├── GameBoard
        │   ├── DOMAnimation
        │   ├── SVGAnimation
        │   ├── WebGLAnimation
        │   └── WebGPUAnimation
        ├── Score
        ├── GameOver
        └── Settings
```

## 2. Animation Mode Implementation

### 2.1 DOM Mode

- Uses React state to render tile positions
- CSS `transform` for smooth transitions
- CSS `transition-duration: 150ms` for animation
- Tile colors from Tailwind utility classes

### 2.2 SVG Mode

- Single `<svg>` element with `viewBox`
- `<rect>` elements for grid cells and tiles
- `<text>` elements for tile numbers
- Color interpolation via fill attributes

### 2.3 WebGL Mode

- Vertex shader transforms positions to clip space
- Fragment shader applies solid colors
- Triangle strip rendering for tiles
- Float32Array for vertex data

### 2.4 WebGPU Mode

- WGSL shaders for vertex/fragment stages
- Uniform buffer for resolution
- Vertex buffer with position + color attributes
- Render pipeline with triangle-list topology

## 3. Input Handling Design

### 3.1 Keyboard Input

```typescript
// Key mapping
{
  ArrowUp, w, W, k, K → 'up'
  ArrowDown, s, S, j, J → 'down'
  ArrowLeft, a, A, h, H → 'left'
  ArrowRight, d, D, l, L → 'right'
}
```

### 3.2 Gamepad Input

- Poll gamepads via `navigator.getGamepads()`
- D-pad buttons: 12 (up), 13 (down), 14 (left), 15 (right)
- Left stick: axes[0] (X), axes[1] (Y)
- Threshold: 0.5 for stick input

### 3.3 Touch Input

- Record touch start position
- On touch end, calculate delta
- Minimum threshold: 50px
- Determine direction from larger delta (X or Y)

### 3.4 Device Orientation

- Listen to `deviceorientation` event
- Gamma: left/right tilt (-90 to 90)
- Beta: front/back tilt (-180 to 180)
- Threshold: 30 degrees
- iOS 13+ requires permission request

## 4. Haptic Feedback Design

### 4.1 Mobile Vibration

```typescript
// Vibration patterns (ms)
{
  move: 10,
  merge: 30,
  gameOver: 100
}
```

### 4.2 Gamepad Rumble

```typescript
// Rumble patterns
{
  move: { duration: 10, strong: 0.1, weak: 0.2 },
  merge: { duration: 30, strong: 0.3, weak: 0.5 },
  gameOver: { duration: 100, strong: 0.8, weak: 1.0 }
}
```

## 5. State Management

### 5.1 Game State

```typescript
interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}
```

### 5.2 Persistence

- Best score saved to `localStorage` key: `a2048-best-score`
- Animation mode saved to `localStorage` key: `a2048-animation-mode`

## 6. Color Scheme

| Value | Background | Text Color |
| ----- | ---------- | ---------- |
| 2     | #eee4da    | #776e65    |
| 4     | #ede0c8    | #776e65    |
| 8     | #f2b179    | white      |
| 16    | #f59563    | white      |
| 32    | #f67c5f    | white      |
| 64    | #f65e3b    | white      |
| 128   | #edcf72    | white      |
| 256   | #edcc61    | white      |
| 512   | #edc850    | white      |
| 1024  | #edc53f    | white      |
| 2048  | #edc22e    | white      |

## 7. Responsive Breakpoints

- Mobile: < 640px (portrait)
- Tablet: 640px - 1024px
- Desktop: > 1024px

Board size calculation:

```typescript
const maxWidth = Math.min(window.innerWidth - 32, 500);
const maxHeight = window.innerHeight - 200;
boardSize = Math.min(maxWidth, maxHeight, 500);
```

## 8. Error Handling

- WebGPU not supported → fallback to WebGL → fallback to DOM
- Gamepad vibration not available → graceful degradation
- Device orientation not supported → hide toggle in settings
- Touch events not available → hide touch controls (desktop)

## 9. Performance Considerations

- Gamepad polling via `requestAnimationFrame`
- Debounced orientation events (500ms)
- CSS `transform` for GPU-accelerated animations
- WebGL/WebGPU for hardware-accelerated rendering
- Memoized animation components
