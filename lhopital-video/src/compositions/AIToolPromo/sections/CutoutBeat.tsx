import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../styles";
import { fadeIn, sectionOpacity, slideIn } from "../../../utils/animations";
import { BeforeAfter } from "./BeforeAfter";

// One cutout beat: a use-case label drops in at top, then the original photo
// wipes to the rembg result (busy background → clean cut). The reveal is the
// BeforeAfter component; here it's a full-res photo so pixelated is off.
export const CutoutBeat: React.FC<{
  label: string;
  before: string;
  after: string;
  beforeTag: string;
  afterTag: string;
  index: number;
  dur: number;
}> = ({ label, before, after, beforeTag, afterTag, index, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "150px 60px 90px",
        gap: 50,
        opacity: sectionOpacity(frame, dur),
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          transform: `translateY(${slideIn(frame, 0, 16, -40)}px)`,
          opacity: fadeIn(frame, 0, 12),
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 32, color: COLORS.accent, fontWeight: 800, letterSpacing: 2 }}>
          用法 {index + 1}
        </div>
        <div style={{ fontSize: 66, fontWeight: 900, color: COLORS.text, marginTop: 8 }}>
          {label}
        </div>
      </div>
      <BeforeAfter
        before={before}
        after={after}
        aspect={3 / 4}
        width={760}
        beforeTag={beforeTag}
        afterTag={afterTag}
        pixelated={false}
      />
    </AbsoluteFill>
  );
};
