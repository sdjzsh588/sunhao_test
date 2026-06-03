import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, SIZES } from "../styles";
import { overshoot, sectionOpacity } from "../../../utils/animations";

export const HookCard: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = overshoot(frame, fps, 0);
  const opacity = sectionOpacity(frame, dur);
  const lines = text.split("\n");

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, #10231a 0%, ${COLORS.bg} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 90,
        opacity,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: SIZES.hook,
          lineHeight: 1.22,
          textAlign: "center",
          color: COLORS.text,
        }}
      >
        {lines.map((l, i) => (
          <div key={i}>
            {i === 0 ? <span style={{ color: COLORS.accent }}>{l}</span> : l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
