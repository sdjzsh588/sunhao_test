import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { serifFamily } from "../fonts";
import { INK } from "./ink";

// Full-bleed AI ink-wash plate with a slow Ken Burns move + legibility scrims.
export const KenBurns: React.FC<{
  src: string;
  dur: number;
  from?: number;
  to?: number;
  panX?: number;
  panY?: number;
}> = ({ src, dur, from = 1.06, to = 1.18, panX = 0, panY = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = from + (to - from) * p;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: INK.paper }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${panX * p}px, ${panY * p}px)`,
        }}
      />
      {/* keep the top light for dark headings, deepen the bottom for mood */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(233,224,203,0.55) 0%, rgba(233,224,203,0) 24%, rgba(233,224,203,0) 66%, rgba(28,24,19,0.18) 100%)",
        }}
      />
      {/* gentle aged-edge vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgba(0,0,0,0) 52%, rgba(28,24,19,0.16) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Scene frame: serif ink type, full-bleed (children positioned absolutely).
export const ProScene: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill style={{ fontFamily: serifFamily, color: INK.ink }}>
    {children}
  </AbsoluteFill>
);

// Translucent rice-paper label, for guaranteed legibility over any plate.
export const PaperCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: "rgba(236,229,210,0.88)",
      border: `1px solid ${INK.inkFaint}`,
      borderRadius: 10,
      padding: "16px 34px",
      boxShadow: "0 10px 34px rgba(28,24,19,0.22)",
      ...style,
    }}
  >
    {children}
  </div>
);

// Big display text drawn straight on the plate, with a paper halo so it reads
// against the light sky.
export const Display: React.FC<{
  children: React.ReactNode;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, fontSize = 96, color = INK.ink, style }) => (
  <div
    style={{
      fontFamily: serifFamily,
      fontWeight: 900,
      fontSize,
      color,
      letterSpacing: fontSize * 0.08,
      textShadow:
        "0 2px 16px rgba(233,224,203,0.95), 0 0 6px rgba(233,224,203,0.95)",
      ...style,
    }}
  >
    {children}
  </div>
);
