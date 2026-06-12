import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Army,
  BrushStroke,
  CityWall,
  Guqin,
  IncenseSmoke,
  INK,
  InkScene,
  Scholar,
  Seal,
  useEnter,
  VerticalText,
} from "./ink";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Headings are pinned to the top so they never collide with the silhouettes,
// which occupy the centre band of each scene.
const Heading: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 4,
}) => (
  <div
    style={{
      ...useEnter(delay),
      position: "absolute",
      top: 72,
      left: 0,
      right: 0,
      textAlign: "center",
    }}
  >
    <h2
      style={{
        fontSize: 58,
        fontWeight: 900,
        letterSpacing: 6,
        margin: 0,
        color: INK.ink,
      }}
    >
      {children}
    </h2>
  </div>
);

const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children,
  color = INK.muted,
}) => (
  <span style={{ fontSize: 40, color, letterSpacing: 2, fontWeight: 700 }}>
    {children}
  </span>
);

// 1 — Title -----------------------------------------------------------------
export const STitle: React.FC = () => {
  const title = useEnter(8, 40);
  const seal = 26;
  const sub = useEnter(46);
  return (
    <InkScene>
      {/* faint distant wall */}
      <CityWall style={{ position: "absolute", bottom: 60, opacity: 0.12 }} width={1100} />
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <div style={{ ...title }}>
          <VerticalText fontSize={210}>空城计</VerticalText>
        </div>
        <div style={{ alignSelf: "flex-end", marginBottom: 30 }}>
          <Seal text="孔明" delay={seal} size={120} />
        </div>
      </div>
      <div style={{ marginTop: 36 }}>
        <BrushStroke delay={40} width={520} height={9} />
      </div>
      <p
        style={{
          ...sub,
          marginTop: 28,
          fontSize: 46,
          color: INK.muted,
          letterSpacing: 8,
        }}
      >
        三国 · 一座空城，退十万雄兵
      </p>
    </InkScene>
  );
};

// 2 — Crisis ----------------------------------------------------------------
export const SCrisis: React.FC = () => {
  const frame = useCurrentFrame();
  const cityIn = useEnter(10, 0);
  const advance = interpolate(frame, [20, 150], [1000, 620], clamp);
  const armyFade = interpolate(frame, [20, 50], [0, 1], clamp);
  const label = useEnter(70);
  return (
    <InkScene>
      <Heading>街亭失守 · 大军压境</Heading>
      <AbsoluteFill style={{ top: 300 }}>
        {/* west city on the left */}
        <div style={{ ...cityIn, position: "absolute", left: 80, top: 250 }}>
          <CityWall width={540} />
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <Label color={INK.ink}>西城</Label>
          </div>
        </div>
        {/* Sima Yi's host advancing from the right */}
        <div
          style={{
            position: "absolute",
            left: advance,
            top: 230,
            opacity: armyFade,
          }}
        >
          <Army flip />
        </div>
      </AbsoluteFill>
      <div style={{ ...label, position: "absolute", bottom: 70 }}>
        <Label>城中只剩文官与老弱残兵</Label>
      </div>
    </InkScene>
  );
};

// 3 — Decision --------------------------------------------------------------
const Option: React.FC<{ choice: string; result: string; anim: React.CSSProperties }> = ({
  choice,
  result,
  anim,
}) => (
  <div
    style={{
      ...anim,
      display: "flex",
      alignItems: "center",
      gap: 28,
      fontSize: 48,
      fontWeight: 700,
    }}
  >
    <span style={{ color: INK.ink }}>{choice}</span>
    <span style={{ color: INK.muted, fontSize: 38 }}>→ {result}</span>
    <span style={{ color: INK.cinnabar, fontWeight: 900, fontSize: 54 }}>✕</span>
  </div>
);

export const SDecision: React.FC = () => {
  const o1 = useEnter(20);
  const o2 = useEnter(70);
  const turn = useEnter(140, 16);
  return (
    <InkScene>
      <Heading>进退维谷</Heading>
      <div style={{ display: "flex", flexDirection: "column", gap: 40, marginTop: 56 }}>
        <Option choice="弃城而逃" result="必被追上" anim={o1} />
        <Option choice="正面迎敌" result="毫无胜算" anim={o2} />
      </div>
      <div style={{ ...turn, marginTop: 70 }}>
        <BrushStroke delay={150} width={420} height={8} color={INK.cinnabar} />
        <p style={{ fontSize: 50, fontWeight: 900, marginTop: 22, color: INK.ink }}>
          诸葛亮，却另有一招
        </p>
      </div>
    </InkScene>
  );
};

// 4 — Empty city ------------------------------------------------------------
const Note: React.FC<{ x: number; delay: number }> = ({ x, delay }) => {
  const frame = useCurrentFrame();
  const t = frame - delay;
  const rise = interpolate(t, [0, 60], [0, -120], clamp);
  const op = interpolate(t, [0, 12, 48, 60], [0, 0.7, 0.7, 0], clamp);
  const sway = Math.sin(t / 10) * 12;
  return (
    <span
      style={{
        position: "absolute",
        left: x + sway,
        top: 70 + rise,
        fontSize: 40,
        color: INK.inkSoft,
        opacity: op,
      }}
    >
      ♪
    </span>
  );
};

export const SEmptyCity: React.FC = () => {
  const cityIn = useEnter(8, 0);
  const figureIn = useEnter(34, 0);
  const textIn = useEnter(70);
  return (
    <InkScene>
      <Heading delay={2}>大开城门 · 焚香抚琴</Heading>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top: 220 }}>
        <div style={{ ...cityIn, position: "relative" }}>
          <CityWall open width={820} />
          {/* Zhuge Liang seated atop the tower with a qin */}
          <div
            style={{
              ...figureIn,
              position: "absolute",
              left: "50%",
              top: -150,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative" }}>
              <Scholar height={190} />
              <IncenseSmoke style={{ position: "absolute", left: -70, bottom: 10 }} />
              <Note x={120} delay={60} />
              <Note x={150} delay={100} />
              <Note x={100} delay={140} />
            </div>
            <Guqin width={240} style={{ marginTop: -8 }} />
          </div>
          {/* two old soldiers sweeping at the gate */}
          <div style={{ position: "absolute", left: 250, bottom: -6, opacity: 0.85 }}>
            <Scholar height={70} />
          </div>
          <div style={{ position: "absolute", right: 250, bottom: -6, opacity: 0.85, transform: "scaleX(-1)" }}>
            <Scholar height={70} />
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ ...textIn, position: "absolute", bottom: 64 }}>
        <Label color={INK.ink}>神态自若，琴声不乱</Label>
      </div>
    </InkScene>
  );
};

// 5 — Retreat ---------------------------------------------------------------
const Doubt: React.FC<{ x: number; delay: number; size: number }> = ({ x, delay, size }) => {
  const frame = useCurrentFrame();
  const t = frame - delay;
  const p = interpolate(t, [0, 18], [0, 1], clamp);
  const sway = Math.sin(t / 14) * 8;
  return (
    <span
      style={{
        position: "absolute",
        left: x + sway,
        top: interpolate(t, [0, 40], [40, -10], clamp),
        fontSize: size,
        fontWeight: 900,
        color: INK.cinnabar,
        opacity: p,
      }}
    >
      ？
    </span>
  );
};

export const SRetreat: React.FC = () => {
  const frame = useCurrentFrame();
  const retreat = interpolate(frame, [30, 170], [240, 980], clamp);
  const cityIn = useEnter(8, 0);
  const cmd = useEnter(60, 14);
  const think = useEnter(95);
  return (
    <InkScene>
      <Heading>疑心生暗鬼</Heading>
      <AbsoluteFill style={{ top: 220 }}>
        <div style={{ ...cityIn, position: "absolute", left: 120, top: 250, opacity: 0.5 }}>
          <CityWall open width={520} />
        </div>
        {/* the host turns and withdraws to the right */}
        <div style={{ position: "absolute", left: retreat, top: 250 }}>
          <Army />
          <Doubt x={210} delay={20} size={70} />
          <Doubt x={300} delay={50} size={50} />
          <Doubt x={150} delay={80} size={56} />
        </div>
      </AbsoluteFill>
      <div style={{ ...think, position: "absolute", top: 150 }}>
        <Label>“此人一生谨慎，城中必有埋伏！”</Label>
      </div>
      <div
        style={{
          ...cmd,
          position: "absolute",
          bottom: 70,
          fontSize: 72,
          fontWeight: 900,
          letterSpacing: 16,
          color: INK.cinnabar,
        }}
      >
        全军 · 撤退
      </div>
    </InkScene>
  );
};

// 6 — Outro -----------------------------------------------------------------
export const SOutro: React.FC = () => {
  const top = useEnter(8);
  const mid = useEnter(40, 16);
  const sub = useEnter(78);
  return (
    <InkScene>
      <p style={{ ...top, fontSize: 40, color: INK.muted, letterSpacing: 4, margin: 0 }}>
        城中其实空无一兵
      </p>
      <h1
        style={{
          ...mid,
          fontSize: 116,
          fontWeight: 900,
          letterSpacing: 14,
          margin: "30px 0 26px",
          color: INK.ink,
        }}
      >
        虚虚实实 · 攻心为上
      </h1>
      <BrushStroke delay={70} width={560} height={10} color={INK.cinnabar} />
      <div style={{ ...sub, display: "flex", alignItems: "center", gap: 36, marginTop: 40 }}>
        <Label color={INK.ink}>这，就是空城计的智慧</Label>
        <Seal text="空城" delay={96} size={104} />
      </div>
    </InkScene>
  );
};
