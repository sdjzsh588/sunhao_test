import React from "react";
import { Card, MathRow, Scene, Sub, Sup, V, useEnter } from "../components";
import { COLORS } from "../theme";

export const VSetup: React.FC = () => {
  const heading = useEnter(4);
  const eq = useEnter(24);
  const cond = useEnter(58);
  const roots = useEnter(90);

  return (
    <Scene>
      <h2 style={{ ...heading, fontSize: 56, fontWeight: 700, marginBottom: 46 }}>
        对于一个一元二次方程
      </h2>

      <Card style={{ ...eq }}>
        <MathRow fontSize={92} gap={6}>
          <V color={COLORS.cyan}>a</V>
          <V>
            x<Sup>2</Sup>
          </V>
          <span>+</span>
          <V color={COLORS.cyan}>b</V>
          <V>x</V>
          <span>+</span>
          <V color={COLORS.cyan}>c</V>
          <span>=</span>
          <span>0</span>
        </MathRow>
      </Card>

      <p style={{ ...cond, fontSize: 36, color: COLORS.muted, marginTop: 30 }}>
        其中 <V color={COLORS.cyan}>a</V>、<V color={COLORS.cyan}>b</V>、
        <V color={COLORS.cyan}>c</V> 是系数，且{" "}
        <V color={COLORS.amber}>a ≠ 0</V>
      </p>

      <p style={{ ...roots, fontSize: 42, marginTop: 30, fontWeight: 700 }}>
        设它的两个根为{" "}
        <V color={COLORS.amber}>
          x<Sub>1</Sub>
        </V>{" "}
        和{" "}
        <V color={COLORS.amber}>
          x<Sub>2</Sub>
        </V>
      </p>
    </Scene>
  );
};
