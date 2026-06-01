import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Fraction, Lim, MathRow, Scene, V, useEnter } from "../components";
import { COLORS } from "../theme";

const Step: React.FC<{
  delay: number;
  children: React.ReactNode;
  tag?: React.ReactNode;
}> = ({ delay, children, tag }) => {
  const anim = useEnter(delay);
  return (
    <div
      style={{
        ...anim,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {children}
      {tag}
    </div>
  );
};

const Tag: React.FC<{ children: React.ReactNode; color: string }> = ({
  children,
  color,
}) => (
  <span
    style={{
      fontSize: 28,
      color,
      border: `1.5px solid ${color}`,
      borderRadius: 999,
      padding: "6px 18px",
      fontFamily: "inherit",
    }}
  >
    {children}
  </span>
);

export const Example: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heading = useEnter(4);

  // final answer pops with a spring
  const pop = spring({
    frame: frame - 360,
    fps,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 30,
  });

  return (
    <Scene>
      <h2 style={{ ...heading, fontSize: 54, fontWeight: 900, marginBottom: 46 }}>
        实战演算
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        <Step
          delay={24}
          tag={<Tag color={COLORS.green}>0/0 型 ✓</Tag>}
        >
          <MathRow fontSize={64} gap={20}>
            <Lim sub={<><V>x</V>→0</>} fontSize={64} />
            <Fraction num={<>sin&nbsp;<V>x</V></>} den={<V>x</V>} fontSize={62} />
          </MathRow>
        </Step>

        <Step delay={100} tag={<Tag color={COLORS.cyan}>分别求导</Tag>}>
          <MathRow fontSize={48} gap={16}>
            <span style={{ color: COLORS.muted }}>分子：</span>
            <V>sin&nbsp;x</V>
            <span style={{ color: COLORS.cyan }}>→</span>
            <V color={COLORS.cyan}>cos&nbsp;x</V>
            <span style={{ width: 40 }} />
            <span style={{ color: COLORS.muted }}>分母：</span>
            <V>x</V>
            <span style={{ color: COLORS.cyan }}>→</span>
            <V color={COLORS.cyan}>1</V>
          </MathRow>
        </Step>

        <Step delay={185}>
          <MathRow fontSize={64} gap={20}>
            <span style={{ fontSize: 56 }}>=</span>
            <Lim sub={<><V>x</V>→0</>} fontSize={64} />
            <Fraction
              num={<V color={COLORS.cyan}>cos&nbsp;x</V>}
              den={<V color={COLORS.cyan}>1</V>}
              fontSize={62}
            />
          </MathRow>
        </Step>

        <Step delay={265}>
          <MathRow fontSize={64} gap={20}>
            <span style={{ fontSize: 56 }}>=</span>
            <Fraction num={<>cos&nbsp;0</>} den="1" fontSize={62} />
            <span style={{ fontSize: 56 }}>=</span>
            <Fraction num="1" den="1" fontSize={62} />
          </MathRow>
        </Step>

        <div
          style={{
            transform: `scale(${pop})`,
            opacity: pop,
            marginTop: 16,
            fontSize: 76,
            fontWeight: 900,
            color: "#0b1020",
            background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.green})`,
            borderRadius: 22,
            padding: "16px 52px",
            alignSelf: "center",
            boxShadow: "0 16px 50px rgba(74,222,128,0.4)",
          }}
        >
          = 1
        </div>
      </div>
    </Scene>
  );
};
