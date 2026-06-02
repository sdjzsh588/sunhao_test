import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Fraction, MathRow, Scene, Sub, V, useEnter } from "../components";
import { COLORS } from "../theme";

export const VOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const line1 = useEnter(8);
  const formula = useEnter(26);
  const line2 = useEnter(60);
  const title = useEnter(86);
  const lineW = interpolate(frame, [86, 112], [0, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Scene>
      <div style={{ ...line1, fontSize: 38, color: COLORS.muted, marginBottom: 26 }}>
        记住这两个公式
      </div>

      <div style={{ ...formula }}>
        <MathRow fontSize={64} gap={56}>
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <V>
              x<Sub>1</Sub>
            </V>
            +
            <V>
              x<Sub>2</Sub>
            </V>
            =
            <Fraction num={<>−<V>b</V></>} den={<V>a</V>} fontSize={60} color={COLORS.amber} />
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <V>
              x<Sub>1</Sub>
            </V>
            ·
            <V>
              x<Sub>2</Sub>
            </V>
            =
            <Fraction num={<V>c</V>} den={<V>a</V>} fontSize={60} color={COLORS.amber} />
          </span>
        </MathRow>
      </div>

      <div
        style={{
          ...line2,
          fontSize: 44,
          fontWeight: 900,
          margin: "40px 0 30px",
          lineHeight: 1.4,
        }}
      >
        不用解方程，也能求出<br />
        两根的 <span style={{ color: COLORS.cyan }}>和</span> 与{" "}
        <span style={{ color: COLORS.cyan }}>积</span>
      </div>
      <div
        style={{
          width: lineW,
          height: 5,
          background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.amber})`,
          borderRadius: 4,
          marginBottom: 26,
        }}
      />
      <h1 style={{ ...title, fontSize: 64, fontWeight: 900, margin: 0 }}>
        韦达定理 · 搞定！
      </h1>
    </Scene>
  );
};
