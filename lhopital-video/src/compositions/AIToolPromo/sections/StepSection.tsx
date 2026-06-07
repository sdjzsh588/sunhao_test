import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, SIZES } from "../styles";
import { fadeIn, popScale, sectionOpacity, slideIn, typed } from "../../../utils/animations";
import { MediaFrame } from "./Media";
import type { AIToolConfigV3, MediaStep } from "../config/types";

// One of the 4 tutorial steps: numbered badge + title/subtitle, then the
// looping GIF (or jpg) with a highlight that springs in after the media settles.
export const StepSection: React.FC<{
  step: MediaStep;
  index: number;
  dur: number;
  ready: boolean;
}> = ({ step, index, dur, ready }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = sectionOpacity(frame, dur);

  const badgeScale = popScale(frame, fps, 2, { damping: 8, stiffness: 120 });
  const headX = slideIn(frame, 6, 18, 120);
  const mediaY = slideIn(frame, 16, 22, 60);
  const mediaOpacity = fadeIn(frame, 16, 16);
  const hlScale = popScale(frame, fps, 40, { damping: 9, stiffness: 120 });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 70,
        gap: 44,
        opacity,
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 26, transform: `translateX(${headX}px)` }}>
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
          {index + 1}
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.text, lineHeight: 1.15 }}>
            {step.title}
          </div>
          {step.subtitle ? (
            <div style={{ fontSize: 36, color: COLORS.textMuted, marginTop: 8 }}>
              {step.subtitle}
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ transform: `translateY(${mediaY}px)`, opacity: mediaOpacity }}>
        <MediaFrame
          src={step.media}
          aspect={step.aspect}
          highlight={step.highlight}
          highlightScale={hlScale}
          ready={ready}
        />
      </div>
    </AbsoluteFill>
  );
};

// Tool-name section for v3: brand name (typed) + value line + hero media.
export const ToolIntroV3: React.FC<{ config: AIToolConfigV3; dur: number }> = ({
  config,
  dur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { toolName, value } = config.script;
  const nameScale = popScale(frame, fps, 0);
  const shownName = typed(frame, toolName, 4, 2);
  const opacity = sectionOpacity(frame, dur);
  const mediaY = slideIn(frame, 26, 22, 80);
  const mediaOpacity = fadeIn(frame, 26, 16);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 70,
        gap: 46,
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
        <div style={{ fontSize: SIZES.value, fontWeight: 700, color: COLORS.text, marginTop: 16 }}>
          {value}
        </div>
      </div>
      <div style={{ transform: `translateY(${mediaY}px)`, opacity: mediaOpacity }}>
        <MediaFrame src={config.heroMedia} aspect={config.heroAspect} ready={config.mediaReady} />
      </div>
    </AbsoluteFill>
  );
};
