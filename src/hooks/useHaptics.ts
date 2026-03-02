"use client";

import { useCallback } from "react";
import { VIBRATION_PATTERNS, RUMBLE_PATTERNS } from "@/lib/constants";

type RumbleType = "move" | "merge" | "gameOver";

export function useHaptics() {
  const vibrate = useCallback((type: "move" | "merge" | "gameOver") => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(VIBRATION_PATTERNS[type]);
    }
  }, []);

  const findGamepad = useCallback((): Gamepad | null => {
    const gamepads = navigator.getGamepads();
    for (const gp of gamepads) {
      if (gp) {
        return gp;
      }
    }
    return null;
  }, []);

  const rumble = useCallback(
    (type: RumbleType) => {
      const gamepad = findGamepad();
      if (!gamepad) return;

      const actuator = gamepad.vibrationActuator;
      if (!actuator || !actuator.playEffect) return;

      const pattern = RUMBLE_PATTERNS[type];
      actuator.playEffect("dual-rumble", {
        duration: pattern.duration,
        strongMagnitude: pattern.strongMagnitude,
        weakMagnitude: pattern.weakMagnitude,
      });
    },
    [findGamepad],
  );

  const triggerFeedback = useCallback(
    (type: RumbleType) => {
      vibrate(type);
      rumble(type);
    },
    [vibrate, rumble],
  );

  return { vibrate, rumble, triggerFeedback };
}
