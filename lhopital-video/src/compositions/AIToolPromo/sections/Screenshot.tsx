import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, SIZES } from "../styles";
import type { Highlight as HL, ScreenshotKey } from "../config/types";
import type { AIToolConfig } from "../config/types";

// A framed screenshot that fills the frame (cover) with a per-shot focus point
// and a slow zoom, wrapped in a neon glow. Falls back to a labeled placeholder
// when the real asset isn't present yet.
export const ScreenFrame: React.FC<{
  shot: ScreenshotKey;
  config: AIToolConfig;
  objectPosition?: string;
  zoomFrom?: number;
  zoomTo?: number;
  highlight?: HL;
  highlightScale?: number;
  style?: React.CSSProperties;
}> = ({
  shot,
  config,
  objectPosition = "center top",
  zoomFrom = 1.0,
  zoomTo = 1.06,
  highlight,
  highlightScale = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 150], [zoomFrom, zoomTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 3",
        borderRadius: SIZES.radius,
        overflow: "hidden",
        border: `2px solid ${COLORS.accent}`,
        boxShadow: `0 0 50px ${COLORS.highlight}, 0 30px 80px rgba(0,0,0,0.6)`,
        background: COLORS.bgPanel,
        ...style,
      }}
    >
      {config.screenshotsReady ? (
        <Img
          src={staticFile(config.screenshots[shot])}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            transform: `scale(${scale})`,
          }}
        />
      ) : (
        <Placeholder shot={shot} file={config.screenshots[shot]} />
      )}

      {highlight ? (
        <div
          style={{
            position: "absolute",
            left: `${highlight.x * 100}%`,
            top: `${highlight.y * 100}%`,
            width: `${highlight.w * 100}%`,
            height: `${highlight.h * 100}%`,
            border: `4px solid ${COLORS.accent}`,
            borderRadius: 12,
            background: COLORS.highlight,
            boxShadow: `0 0 40px ${COLORS.accent}`,
            pointerEvents: "none",
            transform: `scale(${highlightScale})`,
            transformOrigin: "center",
          }}
        />
      ) : null}
    </div>
  );
};

const Placeholder: React.FC<{ shot: ScreenshotKey; file: string }> = ({ shot, file }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      backgroundImage:
        "repeating-linear-gradient(45deg, #161616 0px, #161616 18px, #141414 18px, #141414 36px)",
    }}
  >
    <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.text }}>{shot}</div>
    <div style={{ fontSize: 22, color: COLORS.textMuted }}>{file.split("/").pop()}</div>
  </div>
);
