import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { serifFamily } from "../fonts";

// Ink-wash (水墨) palette: warm rice-paper ground, near-black ink, cinnabar red.
export const INK = {
  paper: "#e9e0cb",
  paperDark: "#cdbf9d",
  ink: "#1c1813",
  inkSoft: "rgba(28,24,19,0.55)",
  inkFaint: "rgba(28,24,19,0.18)",
  muted: "#5b5142",
  cinnabar: "#b23a2e",
  cinnabarDeep: "#8f2c22",
  gold: "#9c7a3c",
};

// Spring entrance (fade + rise). delay in frames.
export const useEnter = (delay = 0, rise = 26) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 24,
  });
  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [rise, 0])}px)`,
  };
};

// ---------------------------------------------------------------------------
// Shared rice-paper backdrop: aged paper, ink-wash blooms, layered ink ridges,
// drifting mist. Everything is frame-driven (no CSS animations).
// ---------------------------------------------------------------------------
export const PaperBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 70) * 18;
  const breathe = 1 + Math.sin(frame / 90) * 0.04;

  return (
    <AbsoluteFill style={{ background: INK.paper }}>
      {/* vignette / aged edges */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, rgba(0,0,0,0) 45%, ${INK.paperDark} 100%)`,
          opacity: 0.9,
        }}
      />
      {/* faint paper fibre speckle */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(28,24,19,0.05) 1px, transparent 1px)",
          backgroundSize: "7px 7px",
          opacity: 0.5,
        }}
      />
      {/* large soft ink bloom, slowly breathing */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 50% at ${50 + drift / 3}% 30%, rgba(28,24,19,0.10), rgba(28,24,19,0) 70%)`,
          transform: `scale(${breathe})`,
        }}
      />
      {/* distant ink ridges */}
      <Mountains />
      {/* drifting mist band */}
      <AbsoluteFill
        style={{
          top: "58%",
          height: 160,
          background:
            "linear-gradient(transparent, rgba(233,224,203,0.85) 40%, rgba(233,224,203,0.85) 60%, transparent)",
          transform: `translateX(${drift * 2}px)`,
          opacity: 0.8,
        }}
      />
    </AbsoluteFill>
  );
};

// Layered ink mountains along the lower third.
const Mountains: React.FC = () => (
  <svg
    viewBox="0 0 1920 1080"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    preserveAspectRatio="xMidYMid slice"
  >
    <path
      d="M0,760 C300,650 520,720 760,690 C1050,655 1300,740 1560,700 C1720,675 1850,710 1920,700 L1920,1080 L0,1080 Z"
      fill={INK.inkFaint}
    />
    <path
      d="M0,860 C260,800 480,840 740,820 C1040,797 1280,860 1540,835 C1700,820 1850,850 1920,845 L1920,1080 L0,1080 Z"
      fill="rgba(28,24,19,0.10)"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Scene wrapper: serif ink type, centred column.
// ---------------------------------------------------------------------------
export const InkScene: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{
      fontFamily: serifFamily,
      color: INK.ink,
      justifyContent: "center",
      alignItems: "center",
      padding: 96,
      textAlign: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Cinnabar seal (印章): square red stamp with vertical characters; springs in.
// ---------------------------------------------------------------------------
export const Seal: React.FC<{
  text: string;
  delay?: number;
  size?: number;
}> = ({ text, delay = 0, size = 132 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 9, stiffness: 120 },
    durationInFrames: 26,
  });
  return (
    <div
      style={{
        width: size,
        height: size,
        background: INK.cinnabar,
        borderRadius: 12,
        boxShadow: `inset 0 0 0 4px ${INK.paper}, inset 0 0 0 7px ${INK.cinnabar}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${p}) rotate(${interpolate(p, [0, 1], [-12, -6])}deg)`,
        opacity: Math.min(1, p * 1.2),
      }}
    >
      <span
        style={{
          writingMode: "vertical-rl",
          color: INK.paper,
          fontWeight: 900,
          fontSize: size * 0.3,
          letterSpacing: 6,
          fontFamily: serifFamily,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// Growing horizontal brush stroke (ink bar with tapered ends).
export const BrushStroke: React.FC<{
  delay?: number;
  width?: number;
  height?: number;
  color?: string;
}> = ({ delay = 0, width = 460, height = 10, color = INK.ink }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame - delay, [0, 24], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: w,
        height,
        background: `linear-gradient(90deg, transparent, ${color} 12%, ${color} 88%, transparent)`,
        borderRadius: height,
        filter: "blur(0.3px)",
      }}
    />
  );
};

// Vertical (竖排) calligraphic text block.
export const VerticalText: React.FC<{
  children: React.ReactNode;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, fontSize = 150, color = INK.ink, style }) => (
  <div
    style={{
      writingMode: "vertical-rl",
      fontFamily: serifFamily,
      fontWeight: 900,
      fontSize,
      color,
      letterSpacing: fontSize * 0.12,
      lineHeight: 1.05,
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Silhouettes (black ink shapes). All take a style for entrance animation.
// ---------------------------------------------------------------------------

// Crenellated city wall with a central gate-tower. `open` shows an open gate.
export const CityWall: React.FC<{
  open?: boolean;
  style?: React.CSSProperties;
  width?: number;
}> = ({ open = false, style, width = 900 }) => (
  <svg
    viewBox="0 0 900 360"
    style={{ width, height: (width * 360) / 900, ...style }}
  >
    <g fill={INK.ink}>
      {/* wall body */}
      <rect x="40" y="170" width="820" height="190" />
      {/* crenellations */}
      {Array.from({ length: 17 }).map((_, i) => (
        <rect key={i} x={48 + i * 48} y="150" width="30" height="26" />
      ))}
      {/* central tower */}
      <rect x="340" y="60" width="220" height="130" />
      {Array.from({ length: 4 }).map((_, i) => (
        <rect key={i} x={352 + i * 52} y="44" width="32" height="22" />
      ))}
      {/* tower roof (curved eaves) */}
      <path d="M300,60 Q450,-6 600,60 L560,60 Q450,28 340,60 Z" />
      {/* roof ridge tips */}
      <path d="M300,60 q-22,-6 -30,-22 q26,6 44,10 Z" />
      <path d="M600,60 q22,-6 30,-22 q-26,6 -44,10 Z" />
    </g>
    {/* gate */}
    {open ? (
      <path
        d="M408,360 L408,250 Q450,212 492,250 L492,360 Z"
        fill={INK.paper}
      />
    ) : (
      <path
        d="M408,360 L408,250 Q450,212 492,250 L492,360 Z"
        fill="rgba(233,224,203,0.18)"
      />
    )}
  </svg>
);

// Seated robed scholar (with a guan headdress) — Zhuge Liang at the qin.
export const Scholar: React.FC<{ style?: React.CSSProperties; height?: number }> = ({
  style,
  height = 240,
}) => (
  <svg
    viewBox="0 0 200 260"
    style={{ height, width: (height * 200) / 260, ...style }}
  >
    <g fill={INK.ink}>
      {/* head + tall scholar's cap */}
      <rect x="84" y="22" width="32" height="22" rx="4" />
      <circle cx="100" cy="62" r="24" />
      {/* shoulders / flowing robe */}
      <path d="M100,84 C58,92 40,150 38,250 L162,250 C160,150 142,92 100,84 Z" />
      {/* sleeves resting forward */}
      <path d="M52,150 C30,168 26,196 40,214 L96,206 C90,176 78,158 52,150 Z" />
      <path d="M148,150 C170,168 174,196 160,214 L104,206 C110,176 122,158 148,150 Z" />
    </g>
  </svg>
);

// A guqin (zither) seen from the side, with strings.
export const Guqin: React.FC<{ style?: React.CSSProperties; width?: number }> = ({
  style,
  width = 360,
}) => (
  <svg viewBox="0 0 360 70" style={{ width, height: (width * 70) / 360, ...style }}>
    <path d="M6,40 Q40,18 180,18 Q330,18 354,40 Q330,58 180,58 Q40,58 6,40 Z" fill={INK.ink} />
    {Array.from({ length: 5 }).map((_, i) => (
      <line
        key={i}
        x1="40"
        x2="320"
        y1={30 + i * 4}
        y2={30 + i * 4}
        stroke={INK.paper}
        strokeWidth="1"
        opacity="0.5"
      />
    ))}
  </svg>
);

// Rising incense smoke — a gently waving line.
export const IncenseSmoke: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 16) * 10;
  const sway2 = Math.sin(frame / 16 + 1.2) * 14;
  return (
    <svg viewBox="0 0 80 220" style={{ width: 80, height: 220, ...style }}>
      <path
        d={`M40,220 C${40 + sway},170 ${40 - sway},130 40,96 C${40 + sway2},66 ${40 - sway2},38 40,8`}
        stroke={INK.inkSoft}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
};

// A massed army: rows of spears + a swaying banner. Position via wrapper style.
export const Army: React.FC<{ style?: React.CSSProperties; flip?: boolean }> = ({
  style,
  flip = false,
}) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame / 12) * 4;
  return (
    <div style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <svg viewBox="0 0 520 300" style={{ width: 520, height: 300 }}>
        <g fill={INK.ink}>
          {/* banner pole + flag */}
          <rect x="250" y="20" width="6" height="250" />
          <path
            d={`M256,28 Q${330 + wave},44 ${314 + wave},78 Q${340 + wave},96 256,104 Z`}
            fill={INK.cinnabarDeep}
          />
          {/* three rows of helmeted soldiers as silhouette clusters */}
          {[0, 1, 2].map((row) => (
            <g key={row} opacity={1 - row * 0.18} transform={`translate(${row * 18}, ${row * 26})`}>
              {Array.from({ length: 10 }).map((_, i) => (
                <g key={i} transform={`translate(${i * 48}, ${190})`}>
                  {/* spear */}
                  <rect x="18" y="-120" width="4" height="160" />
                  <path d="M14,-120 L26,-120 L20,-140 Z" />
                  {/* head + body lump */}
                  <circle cx="20" cy="14" r="13" />
                  <path d="M4,40 C4,22 36,22 36,40 L36,80 L4,80 Z" />
                </g>
              ))}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
