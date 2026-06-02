import "./index.css";
import { Composition } from "remotion";
import {
  MyComposition,
  calculateMetadata,
  defaultProps,
  FPS,
} from "./Composition";

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
    </>
  );
};
