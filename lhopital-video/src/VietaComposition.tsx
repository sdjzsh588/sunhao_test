import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Background } from "./components";
import { VTitle } from "./vieta/Title";
import { VSetup } from "./vieta/Setup";
import { VTheorem } from "./vieta/Theorem";
import { VSpecial } from "./vieta/Special";
import { VExample } from "./vieta/Example";
import { VOutro } from "./vieta/Outro";

const TRANSITION = 18;
const SCENES = [VTitle, VSetup, VTheorem, VSpecial, VExample, VOutro];
const DURATIONS = [165, 360, 480, 360, 600, 240];
const PRESENTATIONS = [
  fade(),
  slide({ direction: "from-right" }),
  slide({ direction: "from-right" }),
  slide({ direction: "from-right" }),
  fade(),
];

export const VIETA_TOTAL =
  DURATIONS.reduce((a, b) => a + b, 0) - TRANSITION * (SCENES.length - 1);

const timing = linearTiming({ durationInFrames: TRANSITION });

export const VietaComposition: React.FC = () => {
  const children: React.ReactNode[] = [];
  SCENES.forEach((SceneComp, i) => {
    children.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={DURATIONS[i]}>
        <SceneComp />
      </TransitionSeries.Sequence>,
    );
    if (i < SCENES.length - 1) {
      children.push(
        <TransitionSeries.Transition
          key={`t${i}`}
          presentation={PRESENTATIONS[i]}
          timing={timing}
        />,
      );
    }
  });

  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
