import React from "react";
import { Scene, V, useEnter } from "../components";
import { COLORS } from "../theme";

const Item: React.FC<{
  n: number;
  delay: number;
  title: React.ReactNode;
  desc: React.ReactNode;
}> = ({ n, delay, title, desc }) => {
  const anim = useEnter(delay);
  return (
    <div
      style={{
        ...anim,
        display: "flex",
        alignItems: "center",
        gap: 30,
        background: COLORS.cardBg,
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 22,
        padding: "26px 38px",
        width: 980,
        textAlign: "left",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.amber})`,
          color: "#0b1020",
          fontSize: 40,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </div>
      <div>
        <div style={{ fontSize: 40, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 28, color: COLORS.muted, marginTop: 6 }}>
          {desc}
        </div>
      </div>
    </div>
  );
};

export const Conditions: React.FC = () => {
  const heading = useEnter(4);
  return (
    <Scene>
      <h2 style={{ ...heading, fontSize: 58, fontWeight: 900, marginBottom: 50 }}>
        使用前，先看三个条件
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <Item
          n={1}
          delay={26}
          title={<>必须是未定式</>}
          desc={
            <>
              极限要呈 <V color={COLORS.amber}>0/0</V> 或{" "}
              <V color={COLORS.amber}>∞/∞</V> 型
            </>
          }
        />
        <Item
          n={2}
          delay={56}
          title={<>函数要可导</>}
          desc={
            <>
              <V>f</V>(<V>x</V>) 与 <V>g</V>(<V>x</V>) 在该点附近可导，且{" "}
              <V>g&apos;</V>(<V>x</V>) ≠ 0
            </>
          }
        />
        <Item
          n={3}
          delay={86}
          title={<>求导后极限存在</>}
          desc={
            <>
              <V>f&apos;</V>(<V>x</V>) / <V>g&apos;</V>(<V>x</V>){" "}
              的极限存在（或为 ∞）
            </>
          }
        />
      </div>
    </Scene>
  );
};
