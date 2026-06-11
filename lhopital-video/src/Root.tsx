import "./index.css";
import "./load-fonts";
import { Composition } from "remotion";
import {
  MyComposition,
  calculateMetadata,
  defaultProps,
  FPS,
} from "./Composition";
import {
  VietaComposition,
  calculateMetadata as vietaCalculateMetadata,
  defaultProps as vietaDefaultProps,
} from "./VietaComposition";
import {
  KongchengComposition,
  calculateMetadata as kongchengCalculateMetadata,
  defaultProps as kongchengDefaultProps,
} from "./KongchengComposition";
import {
  KongchengProComposition,
  calculateMetadata as kongchengProCalculateMetadata,
  defaultProps as kongchengProDefaultProps,
} from "./KongchengProComposition";
import {
  AIToolPromo,
  calculateMetadata as aiToolCalculateMetadata,
  defaultProps as aiToolDefaultProps,
} from "./compositions/AIToolPromo/AIToolPromo";
import {
  PosterPromo,
  calculateMetadata as posterCalculateMetadata,
  defaultProps as posterDefaultProps,
} from "./compositions/AIToolPromo/PosterPromo";
import {
  CutoutPromo,
  calculateMetadata as cutoutCalculateMetadata,
  defaultProps as cutoutDefaultProps,
} from "./compositions/AIToolPromo/CutoutPromo";
import {
  ResumePromo,
  calculateMetadata as resumeCalculateMetadata,
  defaultProps as resumeDefaultProps,
} from "./compositions/AIToolPromo/ResumePromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LHopital"
        component={MyComposition}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={2430}
        defaultProps={defaultProps}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="Vieta"
        component={VietaComposition}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={2115}
        defaultProps={vietaDefaultProps}
        calculateMetadata={vietaCalculateMetadata}
      />
      <Composition
        id="Kongcheng"
        component={KongchengComposition}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={2020}
        defaultProps={kongchengDefaultProps}
        calculateMetadata={kongchengCalculateMetadata}
      />
      <Composition
        id="KongchengPro"
        component={KongchengProComposition}
        fps={30}
        width={1920}
        height={1080}
        durationInFrames={2050}
        defaultProps={kongchengProDefaultProps}
        calculateMetadata={kongchengProCalculateMetadata}
      />
      <Composition
        id="AIToolPromo"
        component={AIToolPromo}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={900}
        defaultProps={aiToolDefaultProps}
        calculateMetadata={aiToolCalculateMetadata}
      />
      <Composition
        id="PosterPromo"
        component={PosterPromo}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={900}
        defaultProps={posterDefaultProps}
        calculateMetadata={posterCalculateMetadata}
      />
      <Composition
        id="CutoutPromo"
        component={CutoutPromo}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={900}
        defaultProps={cutoutDefaultProps}
        calculateMetadata={cutoutCalculateMetadata}
      />
      <Composition
        id="ResumePromo"
        component={ResumePromo}
        fps={30}
        width={1080}
        height={1920}
        durationInFrames={900}
        defaultProps={resumeDefaultProps}
        calculateMetadata={resumeCalculateMetadata}
      />
    </>
  );
};
