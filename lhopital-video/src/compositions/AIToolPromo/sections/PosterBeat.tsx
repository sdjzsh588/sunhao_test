import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { COLORS, FONT } from "../styles";
import { fadeIn, sectionOpacity } from "../../../utils/animations";

const MONO =
  '"DejaVu Sans Mono", "JetBrains Mono", Consolas, "Noto Sans SC", monospace';

const TYPE_PER_CHAR = 2.2; // CJK brief reads slower than code
const TYPE_DELAY = 10;

// One prompt→poster beat: the one-line brief types out at the top, then the
// finished poster rises into view like a print coming out, and a green
// "已生成" chip pops. The poster IS the show — it takes most of the frame.
export const PosterBeat: React.FC<{
  prompt: string;
  poster: string;
  index: number;
  dur: number;
}> = ({ prompt, poster, index, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = sectionOpacity(frame, dur);

  const typeDur = Math.ceil(prompt.length * TYPE_PER_CHAR);
  const typed = prompt.slice(
    0,
    Math.max(0, Math.floor((frame - TYPE_DELAY) / TYPE_PER_CHAR)),
  );
  const typingDone = frame >= TYPE_DELAY + typeDur;
  const cursorOn = Math.floor(frame / 14) % 2 === 0;

  // Poster prints upward once the brief is in.
  const revealStart = TYPE_DELAY + typeDur + 6;
  const rise = spring({
    frame: frame - revealStart,
    fps,
    config: { damping: 14, stiffness: 80 },
    durationInFrames: 36,
  });
  const posterY = interpolate(rise, [0, 1], [1250, 0]);
  const chipScale = spring({
    frame: frame - (revealStart + 26),
    fps,
    config: { damping: 9, stiffness: 140 },
    durationInFrames: 24,
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        alignItems: "center",
        padding: "150px 70px 70px",
        gap: 46,
        opacity,
        fontFamily: FONT,
      }}
    >
      {/* The brief, typed live. */}
      <div
        style={{
          width: "100%",
          fontFamily: MONO,
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1.6,
          color: COLORS.text,
          textAlign: "left",
          opacity: fadeIn(frame, 0, 8),
        }}
      >
        <span style={{ color: COLORS.accent, fontWeight: 900 }}>{"❯ "}</span>
        {typed}
        {!typingDone && cursorOn ? (
          <span style={{ color: COLORS.accent }}>▍</span>
        ) : null}
      </div>

      {/* The poster, printing up into its slot. */}
      <div style={{ position: "relative", width: 860, flex: 1, minHeight: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            borderRadius: 22,
          }}
        >
          <Img
            src={staticFile(poster)}
            style={{
              width: "100%",
              display: "block",
              borderRadius: 22,
              border: "1px solid #2c2c2c",
              transform: `translateY(${posterY}px)`,
              boxShadow: `0 0 60px ${COLORS.highlight}, 0 30px 80px rgba(0,0,0,0.65)`,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            right: -14,
            top: -24,
            transform: `scale(${chipScale})`,
            background: COLORS.accent,
            color: "#000",
            fontWeight: 900,
            fontSize: 32,
            padding: "10px 26px",
            borderRadius: 999,
            boxShadow: `0 0 36px ${COLORS.accent}`,
          }}
        >
          ✓ 已生成 {index + 1}/4
        </div>
      </div>
    </AbsoluteFill>
  );
};
