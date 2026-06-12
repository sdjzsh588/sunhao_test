import { interpolate, spring, SpringConfig } from "remotion";

export const SPRING: Partial<SpringConfig> = { damping: 12 };
export const SPRING_BOUNCY: Partial<SpringConfig> = { damping: 8, stiffness: 120 };

// Fade a value in over `dur` frames starting at `delay`.
export const fadeIn = (frame: number, delay = 0, dur = 15) =>
  interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Fade out over the last `dur` frames of a `total`-frame section.
export const fadeOut = (frame: number, total: number, dur = 15) =>
  interpolate(frame, [total - dur, total], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Combined enter/exit opacity for a section of length `total`.
export const sectionOpacity = (frame: number, total: number, inDur = 12) =>
  Math.min(fadeIn(frame, 0, inDur), fadeOut(frame, total, 15));

// Slide-in offset (px) from a direction, easing to 0.
export const slideIn = (
  frame: number,
  delay = 0,
  dur = 20,
  distance = 200,
) =>
  interpolate(frame, [delay, delay + dur], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Spring scale 0 -> 1 (delay in frames).
export const popScale = (
  frame: number,
  fps: number,
  delay = 0,
  config: Partial<SpringConfig> = SPRING,
) => spring({ frame: frame - delay, fps, config, durationInFrames: 24 });

// Spring overshoot 0 -> 1.2 -> 1.0 for the hook card.
export const overshoot = (frame: number, fps: number, delay = 0) => {
  const p = spring({
    frame: frame - delay,
    fps,
    config: SPRING_BOUNCY,
    durationInFrames: 26,
  });
  // map 0..1 spring to a 0 -> 1.12 -> 1.0 pulse
  return interpolate(p, [0, 0.6, 1], [0, 1.12, 1]);
};

// Number of characters of `text` to reveal at `frame` (1 char / `per` frames).
export const typed = (frame: number, text: string, delay = 0, per = 2) =>
  text.slice(0, Math.max(0, Math.floor((frame - delay) / per)));
