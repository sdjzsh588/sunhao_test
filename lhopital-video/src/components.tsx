import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { serifFamily, sansFamily } from "./fonts";
import { COLORS } from "./theme";

// ---------------------------------------------------------------------------
// Animated gradient background with a subtle floating grid of dots
// ---------------------------------------------------------------------------
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 20;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${50 + drift / 4}% 30%, ${COLORS.bgTo} 0%, ${COLORS.bgFrom} 70%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.5px)",
          backgroundSize: "44px 44px",
          backgroundPosition: `${drift}px ${drift / 2}px`,
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};

// Spring-driven entrance (fade + rise). delay in frames.
export const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
  };
};

// ---------------------------------------------------------------------------
// Math primitives
// ---------------------------------------------------------------------------

// A variable / math token, rendered italic & serif so it reads as maths.
export const V: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color,
}) => (
  <span style={{ fontFamily: serifFamily, fontStyle: "italic", color }}>
    {children}
  </span>
);

// "lim" with a subscript below it.
export const Lim: React.FC<{ sub: React.ReactNode; fontSize: number }> = ({
  sub,
  fontSize,
}) => (
  <span
    style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: serifFamily,
      lineHeight: 1,
    }}
  >
    <span style={{ fontSize }}>lim</span>
    <span style={{ fontSize: fontSize * 0.42, marginTop: 4, opacity: 0.9 }}>
      {sub}
    </span>
  </span>
);

// A stacked fraction with a horizontal bar.
export const Fraction: React.FC<{
  num: React.ReactNode;
  den: React.ReactNode;
  fontSize: number;
  color?: string;
}> = ({ num, den, fontSize, color = COLORS.text }) => (
  <span
    style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: serifFamily,
      fontSize,
      color,
      lineHeight: 1.15,
      verticalAlign: "middle",
    }}
  >
    <span style={{ padding: "0 14px" }}>{num}</span>
    <span
      style={{
        width: "100%",
        height: Math.max(2, fontSize * 0.05),
        background: color,
        borderRadius: 2,
        margin: "6px 0",
      }}
    />
    <span style={{ padding: "0 14px" }}>{den}</span>
  </span>
);

// A horizontal row of math tokens, vertically centered.
export const MathRow: React.FC<{
  children: React.ReactNode;
  fontSize: number;
  gap?: number;
}> = ({ children, fontSize, gap = 18 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap,
      fontFamily: serifFamily,
      fontSize,
      color: COLORS.text,
    }}
  >
    {children}
  </div>
);

// A soft card container used to frame formulas.
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: COLORS.cardBg,
      border: `1px solid ${COLORS.cardBorder}`,
      borderRadius: 28,
      padding: "40px 56px",
      backdropFilter: "blur(4px)",
      boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    {children}
  </div>
);

// Scene-level layout: centered column with consistent font.
export const Scene: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{
      fontFamily: sansFamily,
      color: COLORS.text,
      justifyContent: "center",
      alignItems: "center",
      padding: 100,
      textAlign: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);
