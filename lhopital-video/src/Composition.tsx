import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Background } from "./components";
import { Title } from "./scenes/Title";
import { Problem } from "./scenes/Problem";
import { Rule } from "./scenes/Rule";
import { Conditions } from "./scenes/Conditions";
import { Example } from "./scenes/Example";
import { Outro } from "./scenes/Outro";

// Scene durations (frames @ 30fps) and the transition length between scenes.
export const TRANSITION = 18;
export const SCENES = [180, 450, 510, 420, 690, 270];

// Total composition length once overlapping transitions are subtracted.
export const TOTAL_DURATION =
  SCENES.reduce((a, b) => a + b, 0) - TRANSITION * (SCENES.length - 1);

const timing = linearTiming({ durationInFrames: TRANSITION });

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES[0]}>
          <Title />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={SCENES[1]}>
          <Problem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={timing}
        />

        <TransitionSeries.Sequence durationInFrames={SCENES[2]}>
          <Rule />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={timing}
        />

        <TransitionSeries.Sequence durationInFrames={SCENES[3]}>
          <Conditions />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={timing}
        />

        <TransitionSeries.Sequence durationInFrames={SCENES[4]}>
          <Example />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />

        <TransitionSeries.Sequence durationInFrames={SCENES[5]}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
