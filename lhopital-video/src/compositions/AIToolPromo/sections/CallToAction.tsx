import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT, SIZES } from "../styles";
import { overshoot, sectionOpacity } from "../../../utils/animations";

export const CallToAction: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = overshoot(frame, fps, 0);
  const opacity = sectionOpacity(frame, dur, 8);
  const lines = text.split("\n");

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, #10231a 0%, ${COLORS.bg} 72%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 90,
        opacity,
        fontFamily: FONT,
      }}
    >
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        <div style={{ fontSize: 96, marginBottom: 24 }}>👆</div>
        <div style={{ fontSize: SIZES.cta, fontWeight: 800, color: COLORS.text, lineHeight: 1.3 }}>
          {lines.map((l, i) => (
            <div key={i} style={i === lines.length - 1 ? { color: COLORS.accent } : undefined}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
