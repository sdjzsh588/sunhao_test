import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Scene, useEnter } from "../components";
import { COLORS } from "../theme";

export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const title = useEnter(6);
  const sub = useEnter(20);
  const badge = useEnter(34);
  const lineW = interpolate(frame, [18, 40], [0, 320], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Scene>
      <div style={{ ...badge, marginBottom: 28 }}>
        <span
          style={{
            fontSize: 30,
            letterSpacing: 8,
            color: COLORS.cyan,
            fontWeight: 700,
          }}
        >
          一分钟搞懂 · 微积分
        </span>
      </div>
      <h1
        style={{
          ...title,
          fontSize: 150,
          fontWeight: 900,
          margin: 0,
          letterSpacing: 6,
          textShadow: "0 8px 40px rgba(34,211,238,0.35)",
        }}
      >
        洛必达法则
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
          fontSize: 46,
          color: COLORS.muted,
          margin: 0,
          fontStyle: "italic",
          letterSpacing: 2,
        }}
      >
        L&apos;Hôpital&apos;s Rule
      </p>
    </Scene>
  );
};
