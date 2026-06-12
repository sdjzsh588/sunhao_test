import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../styles";
import { fadeIn, sectionOpacity, slideIn } from "../../../utils/animations";
import type { BulletPair } from "../config/resume";

const ROW_STAGGER = 46; // frames between rows starting
const STRIKE_AT = 14; // within a row: when the weak line gets struck through
const STRONG_AT = 24; // when the strong line slides in

// Render a strong bullet with digits/percent runs highlighted in accent.
const HighlightNumbers: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/([\d.,+\-−]+[\d.,]*[%万]?|10w\+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^[\d.,+\-−]/.test(p) || p === "10w+" ? (
          <span key={i} style={{ color: COLORS.accent, fontWeight: 900 }}>
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
};

// The bullet-rewrite beat: weak resume lines get struck out one by one, and
// the skill's quantified rewrite (X-Y-Z formula) slides in underneath.
export const BulletRewrite: React.FC<{
  bullets: BulletPair[];
  dur: number;
}> = ({ bullets, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "150px 70px 90px",
        gap: 46,
        opacity: sectionOpacity(frame, dur),
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", opacity: fadeIn(frame, 0, 12) }}>
        <div style={{ fontSize: 32, color: COLORS.accent, fontWeight: 800, letterSpacing: 2 }}>
          它干的事
        </div>
        <div style={{ fontSize: 62, fontWeight: 900, color: COLORS.text, marginTop: 8 }}>
          空话 → 数字说话
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 38, width: "100%" }}>
        {bullets.map((b, i) => {
          const start = 18 + i * ROW_STAGGER;
          const strike = interpolate(
            frame,
            [start + STRIKE_AT, start + STRIKE_AT + 10],
            [0, 100],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          const strongVisible = frame >= start + STRONG_AT;
          return (
            <div
              key={i}
              style={{
                background: "#15191e",
                border: "1px solid #262c33",
                borderRadius: 20,
                padding: "26px 32px",
                opacity: fadeIn(frame, start, 12),
                transform: `translateY(${slideIn(frame, start, 16, 40)}px)`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  fontSize: 35,
                  color: strike >= 100 ? "#5c656e" : "#aab4bd",
                }}
              >
                {b.weak}
                {/* strikethrough sweeps across */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "54%",
                    height: 4,
                    width: `${strike}%`,
                    background: "#ff5b5b",
                    borderRadius: 2,
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 40,
                  fontWeight: 800,
                  color: COLORS.text,
                  borderLeft: `6px solid ${COLORS.accent}`,
                  paddingLeft: 20,
                  opacity: strongVisible
                    ? fadeIn(frame, start + STRONG_AT, 12)
                    : 0,
                  transform: `translateX(${slideIn(frame, start + STRONG_AT, 16, 50)}px)`,
                }}
              >
                <HighlightNumbers text={b.strong} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
