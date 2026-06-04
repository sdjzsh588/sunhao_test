import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COLORS, SIZES } from "../styles";
import type { Highlight as HL, ScreenshotKey } from "../config/types";
import type { AIToolConfig } from "../config/types";

// A framed screenshot in a neon glow. For 16:9 shots the frame is 16:9 too, so
// highlight coords (0..1 of the image) map 1:1 with no crop. Tall shots (e.g.
// the blog page) use `scroll` to pan down the page.
export const ScreenFrame: React.FC<{
  shot: ScreenshotKey;
  config: AIToolConfig;
  aspect?: string;
  zoomTo?: number;
  scroll?: boolean;
  scrollPx?: number;
  dur?: number;
  highlight?: HL;
  highlightScale?: number;
  style?: React.CSSProperties;
}> = ({
  shot,
  config,
  aspect = "16 / 9",
  zoomTo = 1,
  scroll = false,
  scrollPx = 460,
  dur = 150,
  highlight,
  highlightScale = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const ready = config.screenshotsReady;
  const src = staticFile(config.screenshots[shot]);

  // tall-page pan: image is full width, translate up over the section
  const panY = scroll
    ? interpolate(frame, [0, dur], [0, -scrollPx], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const scale = interpolate(frame, [0, 150], [1, zoomTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspect,
        borderRadius: SIZES.radius,
        overflow: "hidden",
        border: `2px solid ${COLORS.accent}`,
        boxShadow: `0 0 50px ${COLORS.highlight}, 0 30px 80px rgba(0,0,0,0.6)`,
        background: COLORS.bgPanel,
        ...style,
      }}
    >
      {ready ? (
        scroll ? (
          <Img
            src={src}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${panY}px)`,
            }}
          />
        ) : (
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scale})`,
            }}
          />
        )
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
