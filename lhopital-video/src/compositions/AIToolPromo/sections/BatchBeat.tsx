import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { COLORS, FONT } from "../styles";
import { fadeIn, sectionOpacity } from "../../../utils/animations";

const MONO =
  '"DejaVu Sans Mono", "JetBrains Mono", Consolas, "Noto Sans SC", monospace';

const TYPE_PER_CHAR = 1.6;
const TYPE_DELAY = 10;
const STAGGER = 10; // frames between tiles starting their wipe
const WIPE = 16; // frames for one tile's original→cutout wipe

// The differentiator beat, now showing the batch RUN itself: a 3×3 wall of
// originals, then — once `rembg p` finishes typing — a wave sweeps tile by
// tile, wiping each original away to its REAL cutout over a transparency
// checkerboard, border flipping green, counter ticking up.
export const BatchBeat: React.FC<{
  cmd: string;
  items: { src: string; cut: string }[]; // 9 original/cutout pairs
  dur: number;
}> = ({ cmd, items, dur }) => {
  const frame = useCurrentFrame();
  const opacity = sectionOpacity(frame, dur);

  const typeDur = Math.ceil(cmd.length * TYPE_PER_CHAR);
  const typed = cmd.slice(
    0,
    Math.max(0, Math.floor((frame - TYPE_DELAY) / TYPE_PER_CHAR)),
  );
  const typingDone = frame >= TYPE_DELAY + typeDur;
  const cursorOn = Math.floor(frame / 14) % 2 === 0;

  const wallStart = TYPE_DELAY + typeDur + 8;
  const doneCount = items.reduce(
    (n, _it, i) => (frame >= wallStart + i * STAGGER + WIPE ? n + 1 : n),
    0,
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

      {/* 3×3 wall: originals first, then the cutting wave sweeps through. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
          width: 900,
        }}
      >
        {items.map((it, i) => {
          const start = wallStart + i * STAGGER;
          const p = interpolate(frame, [start, start + WIPE], [0, 100], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const cutting = p > 0 && p < 100;
          const done = p >= 100;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                aspectRatio: "3 / 4",
                borderRadius: 16,
                overflow: "hidden",
                border: `2px solid ${done ? COLORS.accent : cutting ? "#9affd1" : "#2c2c2c"}`,
                boxShadow: done ? `0 0 24px ${COLORS.highlight}` : "none",
                opacity: fadeIn(frame, 6 + i * 2, 10),
              }}
            >
              {/* original underneath */}
              <Img
                src={staticFile(it.src)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* cutout-on-checkerboard wipes in left→right */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: `inset(0 ${100 - p}% 0 0)`,
                  background:
                    "repeating-conic-gradient(#1d2227 0% 25%, #161a1e 0% 50%) 0 / 36px 36px",
                }}
              >
                <Img
                  src={staticFile(it.cut)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* scan line at the wipe edge */}
              {cutting ? (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${p}%`,
                    width: 4,
                    background: COLORS.accent,
                    boxShadow: `0 0 16px ${COLORS.accent}`,
                    transform: "translateX(-2px)",
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div
        style={{
          fontSize: 44,
          fontWeight: 900,
          fontFamily: MONO,
          color: doneCount >= items.length ? COLORS.accent : COLORS.textMuted,
          opacity: fadeIn(frame, wallStart, 8),
        }}
      >
        {doneCount >= items.length
          ? `✓ ${items.length}/${items.length} 全部抠完 · 11 秒`
          : `抠图中 ${doneCount}/${items.length}…`}
      </div>
    </AbsoluteFill>
  );
};
