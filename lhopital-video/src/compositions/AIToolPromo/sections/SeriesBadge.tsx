import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../styles";
import { fadeIn } from "../../../utils/animations";

// Persistent series corner badge (top-left). Dark pill + neon outline so it
// reads on both dark scenes and the white logo card. Top-left keeps it clear of
// Douyin's right-edge buttons and bottom caption area.
export const SeriesBadge: React.FC<{ tag: string; episode: number }> = ({
  tag,
  episode,
}) => {
  const frame = useCurrentFrame();
  const ep = String(episode).padStart(2, "0");

  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 48,
        opacity: fadeIn(frame, 6, 14),
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 24px",
        borderRadius: 999,
        background: "rgba(10,10,10,0.66)",
        border: `1.5px solid rgba(0,255,136,0.55)`,
        boxShadow: `0 0 24px rgba(0,255,136,0.25)`,
        fontFamily: FONT,
        fontSize: 30,
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: COLORS.accent }}>⚡</span>
      <span style={{ color: COLORS.text }}>{tag}</span>
      <span style={{ color: COLORS.textMuted, fontWeight: 700 }}>·</span>
      <span style={{ color: COLORS.accent }}>第 {ep} 期</span>
    </div>
  );
};
