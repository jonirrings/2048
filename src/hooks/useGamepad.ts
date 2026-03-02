"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { Direction } from "@/lib/gameEngine";

type GamepadHandler = (direction: Direction) => void;

const AXIS_THRESHOLD = 0.5;

export function useGamepad(onMove: GamepadHandler) {
  const [connected, setConnected] = useState(false);
  const lastDirectionRef = useRef<Direction | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const pollGamepad = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];

    if (!gamepad) {
      setConnected(false);
      animationFrameRef.current = requestAnimationFrame(pollGamepad);
      return;
    }

    setConnected(true);

    // Check D-pad (buttons 12-15)
    const dpadUp = gamepad.buttons[12]?.pressed;
    const dpadDown = gamepad.buttons[13]?.pressed;
    const dpadLeft = gamepad.buttons[14]?.pressed;
    const dpadRight = gamepad.buttons[15]?.pressed;

    let direction: Direction | null = null;

    if (dpadUp) direction = "up";
    else if (dpadDown) direction = "down";
    else if (dpadLeft) direction = "left";
    else if (dpadRight) direction = "right";
    else {
      // Check left stick (axes 0 and 1)
      const axisX = gamepad.axes[0];
      const axisY = gamepad.axes[1];

      if (axisY < -AXIS_THRESHOLD) direction = "up";
      else if (axisY > AXIS_THRESHOLD) direction = "down";
      else if (axisX < -AXIS_THRESHOLD) direction = "left";
      else if (axisX > AXIS_THRESHOLD) direction = "right";
    }

    if (direction && direction !== lastDirectionRef.current) {
      lastDirectionRef.current = direction;
      onMove(direction);
    } else if (!direction) {
      lastDirectionRef.current = null;
    }

    animationFrameRef.current = requestAnimationFrame(pollGamepad);
  }, [onMove]);

  useEffect(() => {
    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    window.addEventListener("gamepadconnected", handleConnect);
    window.addEventListener("gamepaddisconnected", handleDisconnect);

    animationFrameRef.current = requestAnimationFrame(pollGamepad);

    return () => {
      window.removeEventListener("gamepadconnected", handleConnect);
      window.removeEventListener("gamepaddisconnected", handleDisconnect);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pollGamepad]);

  return { connected };
}
