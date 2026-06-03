import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, SIZES } from "../styles";
import { fadeIn, popScale, sectionOpacity, slideIn, typed } from "../../../utils/animations";
import { ScreenFrame } from "./Screenshot";
import type { AIToolConfig } from "../config/types";

export const ToolIntro: React.FC<{ config: AIToolConfig; dur: number }> = ({
  config,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { toolName, value } = config.script;
  const nameScale = popScale(frame, fps, 0);
  const shownName = typed(frame, toolName, 4, 2);
  const opacity = sectionOpacity(frame, dur);
  const shotX = slideIn(frame, 26, 22, 220);
  const shotOpacity = fadeIn(frame, 26, 16);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        gap: 50,
        opacity,
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", transform: `scale(${nameScale})` }}>
        <div
          style={{
            fontSize: SIZES.toolName,
            fontWeight: 900,
            color: COLORS.accent,
            letterSpacing: 2,
            textShadow: `0 0 50px ${COLORS.highlight}`,
            minHeight: SIZES.toolName * 1.2,
          }}
        >
          {shownName}
        </div>
        <div style={{ fontSize: SIZES.value, fontWeight: 700, color: COLORS.text, marginTop: 18 }}>
          {value}
        </div>
      </div>
      <div style={{ width: "92%", transform: `translateX(${shotX}px)`, opacity: shotOpacity }}>
        <ScreenFrame shot="homepage" config={config} objectPosition="center" zoomTo={1.04} />
      </div>
    </AbsoluteFill>
  );
};
