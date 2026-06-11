import React from "react";
import {
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, SIZES } from "../styles";

// Climax reveal: the degraded "before" photo, with the Real-ESRGAN "after"
// wiped in left→right by a moving divider. Both images are shown at the same
// box size, so the only difference the eye sees is the restored detail.
export const BeforeAfter: React.FC<{
  before: string;
  after: string;
  aspect: number;
  width?: number;
}> = ({ before, after, aspect, width = 760 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const height = Math.round(width / aspect);

  // Hold on "before", sweep across the middle, settle on "after".
  const t = interpolate(
    frame,
    [fps * 0.6, fps * 2.4, fps * 3.2],
    [0, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const dividerPct = t * 100;

  const tagStyle = (color: string): React.CSSProperties => ({
    position: "absolute",
    top: 20,
    padding: "8px 20px",
    borderRadius: 999,
    fontSize: 30,
    fontWeight: 800,
    color: "#000",
    background: color,
  });

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: SIZES.radius,
        overflow: "hidden",
        border: `2px solid ${COLORS.accent}`,
        boxShadow: `0 0 50px ${COLORS.highlight}, 0 26px 70px rgba(0,0,0,0.6)`,
      }}
    >
      {/* AFTER is the base layer (fully sharp). */}
      <Img
        src={staticFile(after)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {/* BEFORE clipped to the left of the divider — recedes as it sweeps. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${100 - dividerPct}% 0 0)`,
        }}
      >
        <Img
          src={staticFile(before)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            imageRendering: "pixelated",
          }}
        />
      </div>
      {/* Divider line. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${dividerPct}%`,
          width: 4,
          background: COLORS.accent,
          boxShadow: `0 0 20px ${COLORS.accent}`,
          transform: "translateX(-2px)",
          opacity: t > 0.001 && t < 0.999 ? 1 : 0,
        }}
      />
      <div style={{ ...tagStyle("#ff5b5b"), left: 20 }}>糊</div>
      <div style={{ ...tagStyle(COLORS.accent), right: 20 }}>高清</div>
    </div>
  );
};
