import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS } from "../styles";
import { fadeIn } from "../../../utils/animations";
import type { TermLine } from "../config/types";

// Streamed terminal output: "cmd" lines type out character by character, other
// lines flow in one by one. Deliberately chrome-less — no window bar, no app
// branding — just a quiet panel with the text stream and a block cursor.

const MONO =
  '"DejaVu Sans Mono", "JetBrains Mono", Consolas, "Noto Sans SC", monospace';

const TYPE_PER_CHAR = 1.0; // frames per typed character
const LINE_FLOW = 10; // frames between streamed output lines
const START_DELAY = 14;

type Scheduled = TermLine & { start: number; typeDur: number };

export const scheduleLines = (lines: TermLine[]): Scheduled[] => {
  let t = START_DELAY;
  return lines.map((line) => {
    const typeDur =
      line.kind === "cmd" ? Math.ceil(line.text.length * TYPE_PER_CHAR) : 0;
    const start = t;
    t += typeDur + (line.pause ?? LINE_FLOW);
    return { ...line, start, typeDur };
  });
};

const lineColor = (kind: TermLine["kind"]): string =>
  kind === "cmd"
    ? COLORS.text
    : kind === "ok"
      ? COLORS.accent
      : kind === "muted"
        ? COLORS.textMuted
        : "#c9c9c9";

export const TerminalStream: React.FC<{
  lines: TermLine[];
  width?: number;
}> = ({ lines, width = 960 }) => {
  const frame = useCurrentFrame();
  const scheduled = scheduleLines(lines);
  const cursorOn = Math.floor(frame / 16) % 2 === 0;
  // The cursor sits on the last line that has started.
  const activeIdx = scheduled.reduce(
    (acc, l, i) => (frame >= l.start ? i : acc),
    -1,
  );

  return (
    <div
      style={{
        width,
        minHeight: 560,
        borderRadius: 20,
        background: "#101010",
        border: "1px solid #262626",
        boxShadow: "0 26px 70px rgba(0,0,0,0.6)",
        padding: "52px 56px",
        fontFamily: MONO,
        fontSize: 31,
        lineHeight: 1.9,
        textAlign: "left",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
      }}
    >
      {scheduled.map((line, i) => {
        if (frame < line.start) return null;
        const isCmd = line.kind === "cmd";
        const visible = isCmd
          ? line.text.slice(
              0,
              Math.max(0, Math.floor((frame - line.start) / TYPE_PER_CHAR)),
            )
          : line.text;
        return (
          <div
            key={i}
            style={{
              color: lineColor(line.kind),
              opacity: isCmd ? 1 : fadeIn(frame, line.start, 8),
              fontWeight: isCmd || line.kind === "ok" ? 700 : 400,
            }}
          >
            {isCmd ? (
              <span style={{ color: COLORS.accent, fontWeight: 900 }}>
                {"❯ "}
              </span>
            ) : null}
            {visible}
            {i === activeIdx && cursorOn ? (
              <span style={{ color: COLORS.accent }}>▍</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
