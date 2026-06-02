import React from "react";
import { Card, MathRow, Scene, Sub, Sup, V, useEnter } from "../components";
import { COLORS } from "../theme";

export const VSpecial: React.FC = () => {
  const heading = useEnter(4);
  const eq = useEnter(26);
  const formulas = useEnter(64);
  const note = useEnter(110);

  return (
    <Scene>
      <h2 style={{ ...heading, fontSize: 56, fontWeight: 900, marginBottom: 18 }}>
        当 <V color={COLORS.amber}>a = 1</V> 时更简单
      </h2>
      <p style={{ ...eq, fontSize: 34, color: COLORS.muted, marginBottom: 36 }}>
        方程写成{" "}
        <V>
          x<Sup>2</Sup>
        </V>{" "}
        + <V color={COLORS.cyan}>p</V>
        <V>x</V> + <V color={COLORS.cyan}>q</V> = 0
      </p>

      <Card style={{ ...formulas }}>
        <MathRow fontSize={66} gap={60}>
          <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <V>
              x<Sub>1</Sub>
            </V>
            <span>+</span>
            <V>
              x<Sub>2</Sub>
            </V>
            <span>=</span>
            <span style={{ color: COLORS.amber }}>
              −<V color={COLORS.cyan}>p</V>
            </span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <V>
              x<Sub>1</Sub>
            </V>
            <span>·</span>
            <V>
              x<Sub>2</Sub>
            </V>
            <span>=</span>
            <span style={{ color: COLORS.amber }}>
              <V color={COLORS.cyan}>q</V>
            </span>
          </span>
        </MathRow>
      </Card>

      <p style={{ ...note, fontSize: 38, marginTop: 40, fontWeight: 700 }}>
        和 = 一次项系数的<span style={{ color: COLORS.amber }}>相反数</span>，积 ={" "}
        <span style={{ color: COLORS.amber }}>常数项</span>
      </p>
    </Scene>
  );
};
