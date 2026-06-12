import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Card, Fraction, Lim, MathRow, Scene, V, useEnter } from "../components";
import { COLORS } from "../theme";

export const Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const heading = useEnter(4);
  const cond = useEnter(24);
  const main = useEnter(60);
  const note = useEnter(120);

  // glow that swells in on the derivative side
  const glow = interpolate(frame, [70, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Scene>
      <h2 style={{ ...heading, fontSize: 60, fontWeight: 900, marginBottom: 18 }}>
        洛必达法则
      </h2>
      <p style={{ ...cond, fontSize: 36, color: COLORS.muted, marginBottom: 44 }}>
        当极限为 <V color={COLORS.amber}>0/0</V> 或{" "}
        <V color={COLORS.amber}>∞/∞</V> 型时：
      </p>

      <Card style={{ ...main }}>
        <MathRow fontSize={86} gap={30}>
          <Lim sub={<><V>x</V>→<V>a</V></>} fontSize={80} />
          <Fraction num={<><V>f</V>(<V>x</V>)</>} den={<><V>g</V>(<V>x</V>)</>} fontSize={78} />
          <span style={{ fontSize: 80, padding: "0 6px" }}>=</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 20,
              padding: "10px 22px",
              boxShadow: `0 0 ${40 * glow}px ${10 * glow}px rgba(34,211,238,${0.35 * glow})`,
              background: `rgba(34,211,238,${0.10 * glow})`,
            }}
          >
            <Lim sub={<><V>x</V>→<V>a</V></>} fontSize={80} />
            <span style={{ width: 24 }} />
            <Fraction
              num={<><V color={COLORS.cyan}>f&apos;</V>(<V>x</V>)</>}
              den={<><V color={COLORS.cyan}>g&apos;</V>(<V>x</V>)</>}
              fontSize={78}
            />
          </span>
        </MathRow>
      </Card>

      <p style={{ ...note, fontSize: 40, marginTop: 44, fontWeight: 700 }}>
        对 <V color={COLORS.cyan}>分子</V> 和 <V color={COLORS.cyan}>分母</V>{" "}
        <span style={{ color: COLORS.cyan }}>分别求导</span>，再求极限！
      </p>
    </Scene>
  );
};
