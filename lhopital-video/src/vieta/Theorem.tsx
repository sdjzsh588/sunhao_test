import React from "react";
import { Card, Fraction, MathRow, Scene, Sub, V, useEnter } from "../components";
import { COLORS } from "../theme";

const Row: React.FC<{
  label: string;
  children: React.ReactNode;
  anim: React.CSSProperties;
}> = ({ label, children, anim }) => (
  <div
    style={{
      ...anim,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 28,
    }}
  >
    <span style={{ fontSize: 32, color: COLORS.muted, width: 170, textAlign: "right" }}>
      {label}
    </span>
    {children}
  </div>
);

export const VTheorem: React.FC = () => {
  const heading = useEnter(4);
  const sum = useEnter(28);
  const prod = useEnter(70);
  const note = useEnter(120);

  return (
    <Scene>
      <h2 style={{ ...heading, fontSize: 58, fontWeight: 900, marginBottom: 44 }}>
        根与系数的关系
      </h2>

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <Row label="两根之和" anim={sum}>
            <MathRow fontSize={70} gap={18}>
              <V>
                x<Sub>1</Sub>
              </V>
              <span>+</span>
              <V>
                x<Sub>2</Sub>
              </V>
              <span>=</span>
              <Fraction
                num={<>−<V color={COLORS.cyan}>b</V></>}
                den={<V color={COLORS.cyan}>a</V>}
                fontSize={68}
                color={COLORS.amber}
              />
            </MathRow>
          </Row>

          <Row label="两根之积" anim={prod}>
            <MathRow fontSize={70} gap={18}>
              <V>
                x<Sub>1</Sub>
              </V>
              <span>·</span>
              <V>
                x<Sub>2</Sub>
              </V>
              <span>=</span>
              <Fraction
                num={<V color={COLORS.cyan}>c</V>}
                den={<V color={COLORS.cyan}>a</V>}
                fontSize={68}
                color={COLORS.amber}
              />
            </MathRow>
          </Row>
        </div>
      </Card>

      <p style={{ ...note, fontSize: 36, marginTop: 40, fontWeight: 700 }}>
        系数 <V color={COLORS.cyan}>a、b、c</V> 直接决定了两根的{" "}
        <span style={{ color: COLORS.amber }}>和</span> 与{" "}
        <span style={{ color: COLORS.amber }}>积</span>
      </p>
    </Scene>
  );
};
