import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, SIZES } from "../styles";
import { fadeIn, popScale, sectionOpacity, slideIn } from "../../../utils/animations";
import { ScreenFrame } from "./Screenshot";
import type { AIToolConfig, ToolPoint } from "../config/types";

export const KeyPoint: React.FC<{
  point: ToolPoint;
  index: number;
  config: AIToolConfig;
  dur: number;
}> = ({ point, index, config, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = sectionOpacity(frame, dur);
  const badge = point.badge ?? index + 1;

  const badgeScale = popScale(frame, fps, 2, { damping: 8, stiffness: 120 });
  const titleX = slideIn(frame, 6, 18, 120);
  const shotX = slideIn(frame, 16, 22, 220);
  const shotOpacity = fadeIn(frame, 16, 16);
  // Let viewers see the screenshot first, then the highlight pops in.
  const hlScale = popScale(frame, fps, 30, { damping: 9, stiffness: 120 });
  const lines = point.title.split("\n");

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        gap: 46,
        opacity,
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28, transform: `translateX(${titleX}px)` }}>
        <div
          style={{
            width: SIZES.badge,
            height: SIZES.badge,
            borderRadius: "50%",
            background: COLORS.accent,
            color: COLORS.bg,
            fontWeight: 900,
            fontSize: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${badgeScale})`,
            boxShadow: `0 0 40px ${COLORS.highlight}`,
            flexShrink: 0,
          }}
        >
          {badge}
        </div>
        <div style={{ fontSize: SIZES.point, fontWeight: 700, color: COLORS.text, lineHeight: 1.25 }}>
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
      <div style={{ width: "94%", transform: `translateX(${shotX}px)`, opacity: shotOpacity }}>
        <ScreenFrame shot={point.shot} config={config} highlight={point.highlight} highlightScale={hlScale} />
      </div>
    </AbsoluteFill>
  );
};
