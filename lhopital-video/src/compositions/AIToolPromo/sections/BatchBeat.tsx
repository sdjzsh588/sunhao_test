import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { COLORS, FONT } from "../styles";
import { fadeIn, sectionOpacity } from "../../../utils/animations";

const MONO =
  '"DejaVu Sans Mono", "JetBrains Mono", Consolas, "Noto Sans SC", monospace';

// The differentiator beat: one command (`rembg p`) types out, then a 3×3 wall
// of REAL batch cutouts pops in one after another over a transparency
// checkerboard, with a running counter. Apps can't do this.
export const BatchBeat: React.FC<{
  cmd: string;
  cutouts: string[]; // 9 transparent PNGs
  dur: number;
}> = ({ cmd, cutouts, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = sectionOpacity(frame, dur);

  const TYPE_PER_CHAR = 1.6;
  const TYPE_DELAY = 10;
  const typeDur = Math.ceil(cmd.length * TYPE_PER_CHAR);
  const typed = cmd.slice(
    0,
    Math.max(0, Math.floor((frame - TYPE_DELAY) / TYPE_PER_CHAR)),
  );
  const typingDone = frame >= TYPE_DELAY + typeDur;
  const cursorOn = Math.floor(frame / 14) % 2 === 0;

  const wallStart = TYPE_DELAY + typeDur + 8;
  const PER_TILE = 5;
  const doneCount = Math.max(
    0,
    Math.min(
      cutouts.length,
      Math.floor((frame - wallStart) / PER_TILE),
    ),
  );

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        alignItems: "center",
        padding: "150px 60px 80px",
        gap: 40,
        opacity,
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", opacity: fadeIn(frame, 0, 10) }}>
        <div style={{ fontSize: 32, color: COLORS.accent, fontWeight: 800, letterSpacing: 2 }}>
          重点来了 · 批量
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, color: COLORS.text, marginTop: 8 }}>
          一条命令，整个文件夹
        </div>
      </div>

      <div
        style={{
          width: "100%",
          fontFamily: MONO,
          fontSize: 38,
          fontWeight: 700,
          color: COLORS.text,
          textAlign: "left",
        }}
      >
        <span style={{ color: COLORS.accent, fontWeight: 900 }}>{"❯ "}</span>
        {typed}
        {!typingDone && cursorOn ? (
          <span style={{ color: COLORS.accent }}>▍</span>
        ) : null}
      </div>

      {/* 3×3 wall of real batch cutouts on a transparency checkerboard. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
          width: 900,
        }}
      >
        {cutouts.map((c, i) => {
          const s = spring({
            frame: frame - (wallStart + i * PER_TILE),
            fps,
            config: { damping: 11, stiffness: 150 },
            durationInFrames: 22,
          });
          return (
            <div
              key={i}
              style={{
                position: "relative",
                aspectRatio: "3 / 4",
                borderRadius: 16,
                overflow: "hidden",
                border: `2px solid ${frame >= wallStart + i * PER_TILE ? COLORS.accent : "#262626"}`,
                background:
                  "repeating-conic-gradient(#1d2227 0% 25%, #161a1e 0% 50%) 0 / 36px 36px",
                transform: `scale(${0.7 + 0.3 * s})`,
                opacity: s,
              }}
            >
              <Img
                src={staticFile(c)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          fontSize: 44,
          fontWeight: 900,
          fontFamily: MONO,
          color: doneCount >= cutouts.length ? COLORS.accent : COLORS.textMuted,
          opacity: fadeIn(frame, wallStart, 8),
        }}
      >
        {doneCount >= cutouts.length
          ? `✓ ${cutouts.length}/${cutouts.length} 全部抠完 · 11 秒`
          : `抠图中 ${doneCount}/${cutouts.length}…`}
      </div>
    </AbsoluteFill>
  );
};
