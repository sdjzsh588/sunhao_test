import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Scene, useEnter } from "../components";
import { COLORS } from "../theme";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const line1 = useEnter(8);
  const line2 = useEnter(28);
  const title = useEnter(54);
  const lineW = interpolate(frame, [54, 80], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Scene>
      <div style={{ ...line1, fontSize: 40, color: COLORS.muted }}>
        记住核心一句话
      </div>
      <div
        style={{
          ...line2,
          fontSize: 64,
          fontWeight: 900,
          margin: "24px 0 36px",
          lineHeight: 1.4,
        }}
      >
        遇到 <span style={{ color: COLORS.amber }}>0/0</span> 或{" "}
        <span style={{ color: COLORS.amber }}>∞/∞</span>，
        <br />
        就<span style={{ color: COLORS.cyan }}>上下分别求导</span>，再求极限
      </div>
      <div
        style={{
          width: lineW,
          height: 5,
          background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.amber})`,
          borderRadius: 4,
          marginBottom: 30,
        }}
      />
      <h1 style={{ ...title, fontSize: 70, fontWeight: 900, margin: 0 }}>
        洛必达法则 · 搞定！
      </h1>
    </Scene>
  );
};
