"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { Direction } from "@/lib/gameEngine";
import { ORIENTATION_THRESHOLD } from "@/lib/constants";

type OrientationHandler = (direction: Direction) => void;

export function useOrientation(onMove: OrientationHandler) {
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(false);
  const lastDirectionRef = useRef<Direction | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const gamma = event.gamma ?? 0; // Left/right tilt (-90 to 90)
      const beta = event.beta ?? 0; // Front/back tilt (-180 to 180)

      let direction: Direction | null = null;

      // Use gamma for left/right (more responsive for holding phone)
      if (gamma > ORIENTATION_THRESHOLD) {
        direction = "right";
      } else if (gamma < -ORIENTATION_THRESHOLD) {
        direction = "left";
      } else if (beta > ORIENTATION_THRESHOLD + 30) {
        direction = "down";
      } else if (beta < ORIENTATION_THRESHOLD - 30) {
        direction = "up";
      }

      if (direction && direction !== lastDirectionRef.current) {
        lastDirectionRef.current = direction;
        onMove(direction);

        // Debounce: prevent multiple triggers
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          lastDirectionRef.current = null;
        }, 500);
      }
    },
    [onMove],
  );

  const enable = useCallback(async () => {
    if (typeof DeviceOrientationEvent !== "undefined") {
      // iOS 13+ requires permission
      if (
        typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
          .requestPermission === "function"
      ) {
        try {
          const permission = await (
            DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
          ).requestPermission();
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
            setEnabled(true);
            setSupported(true);
          }
        } catch {
          setSupported(false);
        }
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
        setEnabled(true);
        setSupported(true);
      }
    } else {
      setSupported(false);
    }
  }, [handleOrientation]);

  const disable = useCallback(() => {
    window.removeEventListener("deviceorientation", handleOrientation);
    setEnabled(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [handleOrientation]);

  useEffect(() => {
    setSupported(typeof DeviceOrientationEvent !== "undefined");
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleOrientation]);

  return { enabled, supported, enable, disable };
}
