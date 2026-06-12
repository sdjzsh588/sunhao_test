import { loadFont as loadSans } from "@remotion/google-fonts/NotoSansSC";
import { loadFont as loadSerif } from "@remotion/google-fonts/NotoSerifSC";

// Body / UI text (Chinese + Latin)
export const { fontFamily: sansFamily } = loadSans("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin", "chinese-simplified"],
});

// Used for math formulas — a serif gives variables a clean "mathy" look
export const { fontFamily: serifFamily } = loadSerif("normal", {
  weights: ["400", "700"],
  subsets: ["latin", "chinese-simplified"],
});
