import React from "react";
import { useCurrentFrame } from "remotion";
import {
  Card,
  Fraction,
  Lim,
  MathRow,
  Scene,
  V,
  useEnter,
} from "../components";
import { COLORS } from "../theme";

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const heading = useEnter(4);
  const formula = useEnter(24);
  const arrow = useEnter(70);
  const warn = useEnter(110);

  // pulsing highlight on the 0/0 indeterminate form
  const pulse = 1 + Math.sin(frame / 10) * 0.04;

  return (
    <Scene>
      <h2 style={{ ...heading, fontSize: 56, fontWeight: 700, marginBottom: 50 }}>
        遇到这样的极限，怎么办？
      </h2>

      <Card style={{ ...formula }}>
        <MathRow fontSize={88} gap={26}>
          <Lim sub={<><V>x</V>→0</>} fontSize={88} />
          <Fraction
            num={<>sin&nbsp;<V>x</V></>}
            den={<V>x</V>}
            fontSize={84}
          />
        </MathRow>
      </Card>

      <div
        style={{
          ...arrow,
          fontSize: 40,
          color: COLORS.muted,
          margin: "34px 0 24px",
        }}
      >
        直接代入 <V color={COLORS.text}>x = 0</V> ↓
      </div>

      <div style={{ ...warn }}>
        <MathRow fontSize={70}>
          <Fraction num="0" den="0" fontSize={70} color={COLORS.rose} />
          <span
            style={{
              fontSize: 44,
              color: COLORS.rose,
              fontWeight: 900,
              transform: `scale(${pulse})`,
              display: "inline-block",
              marginLeft: 28,
            }}
          >
            这是「未定式」！
          </span>
        </MathRow>
        <p style={{ fontSize: 34, color: COLORS.muted, marginTop: 26 }}>
          <V color={COLORS.amber}>0/0</V> 和 <V color={COLORS.amber}>∞/∞</V>{" "}
          都无法直接算出答案
        </p>
      </div>
    </Scene>
  );
};
