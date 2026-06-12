// Vieta's-theorem narration, one entry per scene (in order, matching
// VietaComposition's SCENES). `text` documents what the scene says; `tts` is the
// read-aloud version (symbols/numbers spelled out) for clean pronunciation.
// Files are looked up as voiceover/vieta/<id>.<ext> (mp3 preferred, see
// VOICEOVER_EXTS in ../voiceover/script).
import type { VoiceLine } from "../voiceover/script";

export const VIETA_VOICEOVER: VoiceLine[] = [
  {
    id: "01-title",
    text: "韦达定理，揭示了一元二次方程的根与系数之间的关系。",
    tts: "韦达定理，揭示了一元二次方程，根与系数之间的关系。",
  },
  {
    id: "02-setup",
    text: "对于一元二次方程 a x² + b x + c = 0，其中 a、b、c 是系数，且 a≠0，设它的两个根为 x₁ 和 x₂。",
    tts: "对于一个一元二次方程，a 乘 x 的平方，加 b 乘 x，加 c，等于零。这里 a、b、c 是系数，并且 a 不等于零。设它的两个根为 x1 和 x2。",
  },
  {
    id: "03-theorem",
    text: "两根之和 x₁+x₂ = −b/a，两根之积 x₁·x₂ = c/a。系数直接决定了两根的和与积。",
    tts: "韦达定理说，两根之和，x1 加 x2，等于负 b 除以 a。两根之积，x1 乘 x2，等于 c 除以 a。系数 a、b、c，直接决定了两根的和与积。",
  },
  {
    id: "04-special",
    text: "当 a=1 时，方程写成 x² + p x + q = 0，公式更简单：x₁+x₂ = −p，x₁·x₂ = q。和等于一次项系数的相反数，积等于常数项。",
    tts: "当 a 等于一时，方程写成 x 的平方，加 p 乘 x，加 q，等于零。公式更简单。两根之和等于负 p，两根之积等于 q。也就是，和等于一次项系数的相反数，积等于常数项。",
  },
  {
    id: "05-example",
    text: "例题 x²−5x+6=0：a=1，b=−5，c=6。两根之和 −b/a=5，两根之积 c/a=6。找和为 5、积为 6 的两个数，就是 2 和 3。验证 2+3=5，2×3=6。",
    tts: "看一道例题。x 的平方，减五 x，加六，等于零。这里 a 等于一，b 等于负五，c 等于六。两根之和，等于负 b 除以 a，等于五。两根之积，等于 c 除以 a，等于六。我们找两个数，和为五，积为六，正好是二和三。验证一下，二加三等于五，二乘三等于六，完全正确。",
  },
  {
    id: "06-outro",
    text: "记住：x₁+x₂ = −b/a，x₁·x₂ = c/a。有了韦达定理，不用解方程，也能求出两根的和与积。",
    tts: "记住这两个公式，两根之和等于负 b 除以 a，两根之积等于 c 除以 a。有了韦达定理，不用解方程，也能求出两根的和与积。韦达定理，搞定！",
  },
];

// Output path for Vieta narration (parallel to the L'Hopital one).
export const vietaVoiceoverPath = (id: string, ext: string) =>
  `voiceover/vieta/${id}.${ext}`;
