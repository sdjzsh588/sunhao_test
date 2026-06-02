// 空城计 narration, one entry per scene (in order, matching the composition's
// SCENES). `text` documents the on-screen meaning; `tts` is the read-aloud
// version. Storytelling ("说书") tone. Files: voiceover/kongcheng/<id>.<ext>.
import type { VoiceLine } from "../voiceover/script";

export const KONGCHENG_VOICEOVER: VoiceLine[] = [
  {
    id: "01-title",
    text: "三国乱世，一座几乎没有守军的空城，竟吓退了十五万大军。这，就是空城计。",
    tts: "三国乱世，一座几乎没有守军的空城，竟吓退了十五万大军。这，就是空城计。",
  },
  {
    id: "02-crisis",
    text: "街亭失守，诸葛亮驻守的西城只剩文官和老弱残兵。探马来报：司马懿大军压境，铺天盖地杀来。",
    tts: "街亭失守，诸葛亮驻守的西城，只剩下文官和老弱残兵。探马来报，司马懿大军压境，铺天盖地，杀奔而来。",
  },
  {
    id: "03-decision",
    text: "弃城会被追上，迎敌又毫无胜算。千钧一发之际，诸葛亮却下了一道出人意料的命令。",
    tts: "弃城逃跑，必被追上。正面迎敌，又毫无胜算。千钧一发之际，诸葛亮，却下了一道出人意料的命令。",
  },
  {
    id: "04-emptycity",
    text: "大开城门，几名老兵在门前不慌不忙地扫地。诸葛亮端坐城楼，焚香抚琴，神态自若。",
    tts: "大开城门，几名老兵，在门前不慌不忙地扫地。诸葛亮自己，端坐城楼之上，焚香抚琴，神态自若。",
  },
  {
    id: "05-retreat",
    text: "司马懿赶到城下，见此情景心生大疑：诸葛亮一生谨慎，从不弄险，城中必有埋伏。于是下令全军撤退。",
    tts: "司马懿赶到城下，见此情景，心生大疑。诸葛亮一生谨慎，从不弄险，城中必有埋伏。于是下令，全军撤退。",
  },
  {
    id: "06-outro",
    text: "其实城中空无一兵。他赌的，正是司马懿的多疑。虚虚实实，攻心为上——这就是空城计的智慧。",
    tts: "其实，城中空无一兵。诸葛亮赌的，正是司马懿的多疑。虚虚实实，攻心为上，这，就是空城计的智慧。",
  },
];

export const kongchengVoiceoverPath = (id: string, ext: string) =>
  `voiceover/kongcheng/${id}.${ext}`;
