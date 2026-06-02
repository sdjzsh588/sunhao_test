import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Scene, useEnter } from "../components";
import { COLORS } from "../theme";

export const VTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const badge = useEnter(6);
  const title = useEnter(16);
  const sub = useEnter(34);
  const lineW = interpolate(frame, [20, 44], [0, 460], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Scene>
      <div style={{ ...badge, marginBottom: 26 }}>
        <span
          style={{
            fontSize: 30,
            letterSpacing: 8,
            color: COLORS.cyan,
            fontWeight: 700,
          }}
        >
          初中数学 · 一元二次方程
        </span>
      </div>
      <h1
        style={{
          ...title,
          fontSize: 150,
          fontWeight: 900,
          margin: 0,
          letterSpacing: 8,
          textShadow: "0 8px 40px rgba(34,211,238,0.35)",
        }}
      >
        韦达定理
      </h1>
      <div
        style={{
          width: lineW,
          height: 6,
          background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.amber})`,
          borderRadius: 4,
          margin: "30px 0",
        }}
      />
      <p
        style={{
          ...sub,
          fontSize: 44,
          color: COLORS.muted,
          margin: 0,
          letterSpacing: 2,
        }}
      >
        根与系数的关系
      </p>
    </Scene>
  );
};
