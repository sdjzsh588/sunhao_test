import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../styles";
import { fadeIn, sectionOpacity, slideIn } from "../../../utils/animations";

const Column: React.FC<{
  caption: string;
  text: string;
  color: string;
  x: number;
  opacity: number;
}> = ({ caption, text, color, x, opacity }) => (
  <div
    style={{
      flex: 1,
      transform: `translateX(${x}px)`,
      opacity,
      background: COLORS.bgPanel,
      border: `2px solid ${color}`,
      borderRadius: 24,
      padding: "56px 30px",
      textAlign: "center",
      boxShadow: `0 0 50px ${color}22`,
    }}
  >
    <div style={{ fontSize: 34, color: COLORS.textMuted, marginBottom: 22 }}>{caption}</div>
    {text.split("\n").map((l, i) => (
      <div key={i} style={{ fontSize: 58, fontWeight: 900, color, lineHeight: 1.2 }}>
        {l}
      </div>
    ))}
  </div>
);

export const Comparison: React.FC<{ before: string; after: string; dur: number }> = ({
  before,
  after,
  dur,
}) => {
  const frame = useCurrentFrame();
  const opacity = sectionOpacity(frame, dur);
  const leftX = slideIn(frame, 0, 20, -260);
  const rightX = slideIn(frame, 5, 20, 260);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 70,
        gap: 40,
        opacity,
        fontFamily: FONT,
      }}
    >
      <div style={{ fontSize: 54, fontWeight: 800, color: COLORS.text, opacity: fadeIn(frame, 0, 12) }}>
        前后对比
      </div>
      <div style={{ display: "flex", gap: 30, width: "100%", alignItems: "stretch" }}>
        <Column caption="以前" text={before} color={COLORS.danger} x={leftX} opacity={fadeIn(frame, 0, 16)} />
        <div style={{ alignSelf: "center", fontSize: 70, color: COLORS.accent, fontWeight: 900, opacity: fadeIn(frame, 18, 10) }}>
          →
        </div>
        <Column caption="现在" text={after} color={COLORS.accent} x={rightX} opacity={fadeIn(frame, 5, 16)} />
      </div>
    </AbsoluteFill>
  );
};
