// Narration script, one entry per scene (in order).
//   - `text` documents what the scene says.
//   - `tts`  is the read-aloud version (symbols/numbers spelled out) used by
//     the TTS engines so pronunciation is clean.
// Files are looked up as voiceover/lhopital/<id>.<ext> (wav or mp3).
export type VoiceLine = { id: string; text: string; tts: string };

export const VOICEOVER: VoiceLine[] = [
  {
    id: "01-title",
    text: "什么是洛必达法则？它是微积分里求极限的一把利器。",
    tts: "什么是洛必达法则？它是微积分里，求极限的一把利器。",
  },
  {
    id: "02-problem",
    text: "经典极限：x 趋近于 0 时，sin x 除以 x。直接代入 0，分子分母都是 0，得到 0 比 0，这叫未定式。",
    tts: "看这个极限。x 趋近于零时，sin x 除以 x。直接代入零，分子分母都是零，得到零比零，这叫未定式。无穷比无穷，也是未定式。",
  },
  {
    id: "03-rule",
    text: "极限为 0 比 0 或无穷比无穷时，对分子分母分别求导，再求极限。",
    tts: "洛必达法则说，极限是零比零，或无穷比无穷时，对分子和分母分别求导，再求极限，结果不变。",
  },
  {
    id: "04-conditions",
    text: "三个条件：必须是未定式；函数可导且分母导数不为零；求导后极限存在。",
    tts: "三个条件。第一，必须是未定式。第二，分子分母可导，且分母导数不为零。第三，求导后极限存在。",
  },
  {
    id: "05-example",
    text: "sin x 除以 x 是 0 比 0。分子求导得 cos x，分母求导得 1，极限为 cos x 除以 1，代入得 1。",
    tts: "看例子。sin x 除以 x 是零比零。分子求导，得 cos x；分母求导，得一。极限变成 cos x 除以一。代入零，cos 零等于一，答案是一。",
  },
  {
    id: "06-outro",
    text: "遇到 0 比 0 或无穷比无穷，就上下分别求导，再求极限。",
    tts: "记住，遇到零比零，或无穷比无穷，就上下分别求导，再求极限。洛必达法则，就这么简单！",
  },
];

// Candidate extensions, in priority order (espeak writes wav, ElevenLabs mp3).
export const VOICEOVER_EXTS = ["wav", "mp3"] as const;

export const voiceoverPath = (id: string, ext: string) =>
  `voiceover/lhopital/${id}.${ext}`;
