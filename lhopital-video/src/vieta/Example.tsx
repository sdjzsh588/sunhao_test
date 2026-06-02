import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, Sub, Sup, V, useEnter } from "../components";
import { COLORS } from "../theme";

const Step: React.FC<{ delay: number; children: React.ReactNode }> = ({
  delay,
  children,
}) => {
  const anim = useEnter(delay);
  return (
    <div
      style={{
        ...anim,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        fontSize: 48,
      }}
    >
      {children}
    </div>
  );
};

const Check: React.FC = () => (
  <span style={{ color: COLORS.green, fontWeight: 900 }}> ✓</span>
);

export const VExample: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const heading = useEnter(4);

  const pop = spring({
    frame: frame - 430,
    fps,
    config: { damping: 12, stiffness: 120 },
    durationInFrames: 30,
  });

  return (
    <Scene>
      <h2 style={{ ...heading, fontSize: 52, fontWeight: 900, marginBottom: 40 }}>
        例题：求两根的和与积
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        <Step delay={24}>
          <span style={{ fontSize: 60 }}>
            <V>
              x<Sup>2</Sup>
            </V>{" "}
            − 5<V>x</V> + 6 = 0
          </span>
          <span style={{ fontSize: 30, color: COLORS.muted, marginLeft: 20 }}>
            ( <V color={COLORS.cyan}>a</V>=1, <V color={COLORS.cyan}>b</V>=−5,{" "}
            <V color={COLORS.cyan}>c</V>=6 )
          </span>
        </Step>

        <Step delay={96}>
          <span style={{ color: COLORS.muted, fontSize: 38 }}>两根之和：</span>
          <V>
            x<Sub>1</Sub>
          </V>
          <span>+</span>
          <V>
            x<Sub>2</Sub>
          </V>
          <span>= −</span>
          <Frac b="−5" a="1" />
          <span>=</span>
          <span style={{ color: COLORS.amber, fontWeight: 900 }}>5</span>
        </Step>

        <Step delay={170}>
          <span style={{ color: COLORS.muted, fontSize: 38 }}>两根之积：</span>
          <V>
            x<Sub>1</Sub>
          </V>
          <span>·</span>
          <V>
            x<Sub>2</Sub>
          </V>
          <span>=</span>
          <Frac b="6" a="1" />
          <span>=</span>
          <span style={{ color: COLORS.amber, fontWeight: 900 }}>6</span>
        </Step>

        <Step delay={250}>
          <span style={{ fontSize: 40 }}>
            找两个数，<span style={{ color: COLORS.amber }}>和为 5</span>、
            <span style={{ color: COLORS.amber }}>积为 6</span> ⟶{" "}
            <span style={{ color: COLORS.cyan, fontWeight: 900 }}>2 和 3</span>
          </span>
        </Step>

        <Step delay={340}>
          <span style={{ fontSize: 38 }}>
            验证：2 + 3 = 5<Check /> &nbsp;&nbsp; 2 × 3 = 6<Check />
          </span>
        </Step>

        <div
          style={{
            transform: `scale(${pop})`,
            opacity: pop,
            marginTop: 14,
            alignSelf: "center",
            fontSize: 56,
            fontWeight: 900,
            color: "#0b1020",
            background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.green})`,
            borderRadius: 20,
            padding: "14px 44px",
            boxShadow: "0 16px 50px rgba(74,222,128,0.4)",
          }}
        >
          x₁ = 2，x₂ = 3
        </div>
      </div>
    </Scene>
  );
};

// Small inline fraction tuned for this scene's font size.
const Frac: React.FC<{ b: string; a: string }> = ({ b, a }) => (
  <span
    style={{
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: 40,
      lineHeight: 1.1,
      verticalAlign: "middle",
    }}
  >
    <span style={{ padding: "0 10px" }}>
      <V color={COLORS.cyan}>{b}</V>
    </span>
    <span
      style={{
        width: "100%",
        height: 3,
        background: COLORS.text,
        borderRadius: 2,
        margin: "4px 0",
      }}
    />
    <span style={{ padding: "0 10px" }}>
      <V color={COLORS.cyan}>{a}</V>
    </span>
  </span>
);
