import React from "react";
import { AbsoluteFill } from "remotion";
import { BrushStroke, INK, Seal, useEnter, VerticalText } from "./ink";
import { Display, KenBurns, PaperCard, ProScene } from "./pro";

type DurProps = { dur: number };

const Caption: React.FC<{ children: React.ReactNode; anim: React.CSSProperties }> = ({
  children,
  anim,
}) => (
  <div style={{ ...anim, position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <PaperCard>
      <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: 2, color: INK.ink }}>
        {children}
      </span>
    </PaperCard>
  </div>
);

const TopHeading: React.FC<{ children: React.ReactNode; anim: React.CSSProperties }> = ({
  children,
  anim,
}) => (
  <div style={{ ...anim, position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <PaperCard>
      <span style={{ fontSize: 52, fontWeight: 900, letterSpacing: 4, color: INK.ink }}>
        {children}
      </span>
    </PaperCard>
  </div>
);

// 1 — Title -----------------------------------------------------------------
export const SPTitle: React.FC<DurProps> = ({ dur }) => {
  const title = useEnter(8, 40);
  const sub = useEnter(46);
  return (
    <ProScene>
      <KenBurns src="images/kongcheng-bg.jpg" dur={dur} from={1.04} to={1.16} panX={-30} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <div style={{ ...title }}>
            <Display fontSize={200}>
              <VerticalText fontSize={200} color={INK.ink}>空城计</VerticalText>
            </Display>
          </div>
          <div style={{ alignSelf: "flex-end", marginBottom: 26 }}>
            <Seal text="孔明" delay={26} size={120} />
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ ...sub, position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <PaperCard>
          <span style={{ fontSize: 44, letterSpacing: 8, color: INK.ink, fontWeight: 700 }}>
            三国 · 一座空城，退十万雄兵
          </span>
        </PaperCard>
      </div>
    </ProScene>
  );
};

// 2 — Crisis ----------------------------------------------------------------
export const SPCrisis: React.FC<DurProps> = ({ dur }) => (
  <ProScene>
    <KenBurns src="images/crisis.jpg" dur={dur} from={1.05} to={1.2} panX={40} />
    <TopHeading anim={useEnter(6)}>街亭失守 · 大军压境</TopHeading>
    <Caption anim={useEnter(64)}>城中只剩文官与老弱残兵</Caption>
  </ProScene>
);

// 3 — Decision --------------------------------------------------------------
const Option: React.FC<{ choice: string; result: string; anim: React.CSSProperties }> = ({
  choice,
  result,
  anim,
}) => (
  <div style={{ ...anim, display: "flex", alignItems: "center", gap: 22, fontSize: 44, fontWeight: 700 }}>
    <span style={{ color: INK.ink }}>{choice}</span>
    <span style={{ color: INK.muted, fontSize: 34 }}>→ {result}</span>
    <span style={{ color: INK.cinnabar, fontWeight: 900, fontSize: 50 }}>✕</span>
  </div>
);

export const SPDecision: React.FC<DurProps> = ({ dur }) => {
  const o1 = useEnter(20);
  const o2 = useEnter(60);
  const turn = useEnter(120, 16);
  return (
    <ProScene>
      <KenBurns src="images/decision.jpg" dur={dur} from={1.05} to={1.16} panY={-20} />
      <TopHeading anim={useEnter(6)}>进退维谷</TopHeading>
      <div style={{ position: "absolute", right: 130, top: 300, display: "flex", flexDirection: "column", gap: 26, alignItems: "flex-start" }}>
        <PaperCard style={{ ...o1 }}>
          <Option choice="弃城而逃" result="必被追上" anim={{}} />
        </PaperCard>
        <PaperCard style={{ ...o2 }}>
          <Option choice="正面迎敌" result="毫无胜算" anim={{}} />
        </PaperCard>
        <div style={{ ...turn, marginTop: 18 }}>
          <BrushStroke delay={130} width={360} height={8} color={INK.cinnabar} />
          <Display fontSize={56} style={{ marginTop: 16 }}>诸葛亮，却另有一招</Display>
        </div>
      </div>
    </ProScene>
  );
};

// 4 — Empty city ------------------------------------------------------------
export const SPEmptyCity: React.FC<DurProps> = ({ dur }) => (
  <ProScene>
    <KenBurns src="images/zhuge.jpg" dur={dur} from={1.06} to={1.2} panX={30} />
    <TopHeading anim={useEnter(4)}>大开城门 · 焚香抚琴</TopHeading>
    <Caption anim={useEnter(70)}>神态自若，琴声不乱</Caption>
  </ProScene>
);

// 5 — Retreat ---------------------------------------------------------------
export const SPRetreat: React.FC<DurProps> = ({ dur }) => {
  const think = useEnter(60);
  const cmd = useEnter(96, 16);
  return (
    <ProScene>
      <KenBurns src="images/retreat.jpg" dur={dur} from={1.05} to={1.18} panX={-40} />
      <TopHeading anim={useEnter(6)}>疑心生暗鬼</TopHeading>
      <div style={{ ...think, position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <PaperCard>
          <span style={{ fontSize: 38, color: INK.ink, fontWeight: 700 }}>
            “此人一生谨慎，城中必有埋伏！”
          </span>
        </PaperCard>
      </div>
      <div style={{ ...cmd, position: "absolute", bottom: 86, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Display fontSize={78} color={INK.cinnabar} style={{ letterSpacing: 16 }}>
          全军 · 撤退
        </Display>
      </div>
    </ProScene>
  );
};

// 6 — Outro -----------------------------------------------------------------
export const SPOutro: React.FC<DurProps> = ({ dur }) => {
  const top = useEnter(8);
  const mid = useEnter(38, 16);
  const sub = useEnter(78);
  return (
    <ProScene>
      <KenBurns src="images/outro.jpg" dur={dur} from={1.04} to={1.14} panY={20} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Display fontSize={36} color={INK.muted} style={{ ...top, fontWeight: 700, letterSpacing: 6 }}>
          城中其实空无一兵
        </Display>
        <Display fontSize={112} style={{ ...mid, margin: "26px 0 24px", letterSpacing: 14 }}>
          虚虚实实 · 攻心为上
        </Display>
        <BrushStroke delay={70} width={560} height={10} color={INK.cinnabar} />
        <div style={{ ...sub, display: "flex", alignItems: "center", gap: 30, marginTop: 36 }}>
          <PaperCard>
            <span style={{ fontSize: 40, fontWeight: 700, color: INK.ink }}>
              这，就是空城计的智慧
            </span>
          </PaperCard>
          <Seal text="空城" delay={96} size={104} />
        </div>
      </AbsoluteFill>
    </ProScene>
  );
};
