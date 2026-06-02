// Narration script, one entry per scene (in order). The `id` is used as the
// mp3 filename under public/voiceover/lhopital/<id>.mp3.
export type VoiceLine = { id: string; text: string };

export const VOICEOVER: VoiceLine[] = [
  {
    id: "01-title",
    text: "什么是洛必达法则？它是微积分里求极限的一把利器，一分钟带你彻底搞懂。",
  },
  {
    id: "02-problem",
    text: "先看一个经典极限：当 x 趋近于 0 时，sin x 除以 x。如果直接代入 x 等于 0，分子和分母都变成 0，得到 0 比 0。这种算不出确定结果的式子，叫做未定式。除了 0 比 0，无穷比无穷也是未定式。",
  },
  {
    id: "03-rule",
    text: "洛必达法则告诉我们：当极限呈 0 比 0，或者无穷比无穷型时，可以对分子和分母分别求导，再求极限，结果不变。注意，是分子分母各自求导，而不是用除法的求导法则。",
  },
  {
    id: "04-conditions",
    text: "使用之前，要确认三个条件。第一，极限必须是 0 比 0，或无穷比无穷型；第二，分子分母在该点附近可导，并且分母的导数不为零；第三，求导之后的极限要存在，或者是无穷大。",
  },
  {
    id: "05-example",
    text: "回到刚才的例子。sin x 除以 x 是 0 比 0 型，满足条件。分子 sin x 求导，得到 cos x；分母 x 求导，得到 1。于是极限变成 cos x 除以 1。代入 x 等于 0，cos 0 等于 1，所以答案就是 1。",
  },
  {
    id: "06-outro",
    text: "记住一句话：遇到 0 比 0，或无穷比无穷，就上下分别求导，再求极限。洛必达法则，就是这么简单！",
  },
];

// Where the generated mp3 files live (relative to public/).
export const voiceoverFile = (id: string) => `voiceover/lhopital/${id}.mp3`;
