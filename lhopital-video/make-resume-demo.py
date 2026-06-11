# EP05 demo assets — a deliberately weak resume vs. the version rewritten by
# genuinely following ResumeSkills' resume-bullet-writer (X-Y-Z formula, action
# verbs, metrics), resume-quantifier and resume-ats-optimizer (single column,
# standard fonts, no tables/graphics) skills. Both written as real .docx, then
# rendered to PNG via LibreOffice for the video.
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
import os

OUT = "/home/user/sunhao_test/lhopital-video/public/aitool/resume/files"
os.makedirs(OUT, exist_ok=True)

ACCENT = RGBColor(0x1A, 0x5F, 0x9E)


def base_doc():
    d = Document()
    for s in d.sections:
        s.top_margin = s.bottom_margin = Cm(1.6)
        s.left_margin = s.right_margin = Cm(1.8)
    st = d.styles["Normal"]
    st.font.name = "WenQuanYi Zen Hei"
    st.font.size = Pt(10.5)
    return d


def heading(d, text, color=None, size=13, before=10):
    p = d.add_paragraph()
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(text)
    r.bold = True
    r.font.size = Pt(size)
    if color:
        r.font.color.rgb = color
    return p


def line(d, text, bullet=False, size=10.5, bold=False, after=2):
    p = d.add_paragraph()
    p.paragraph_format.space_after = Pt(after)
    if bullet:
        p.paragraph_format.left_indent = Cm(0.45)
        text = "• " + text
    r = p.add_run(text)
    r.font.size = Pt(size)
    r.bold = bold
    return p


# ---------- BEFORE: the typical weak resume ----------
d = base_doc()
t = d.add_paragraph()
t.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = t.add_run("张小雅")
r.bold = True
r.font.size = Pt(18)
c = d.add_paragraph()
c.alignment = WD_ALIGN_PARAGRAPH.CENTER
c.add_run("电话 138-xxxx-xxxx ｜ 邮箱 zhangxy@example.com").font.size = Pt(9.5)

heading(d, "求职意向")
line(d, "新媒体运营相关工作")
heading(d, "工作经历")
line(d, "某互联网公司 · 新媒体运营专员（2023.06 - 至今）", bold=True)
line(d, "负责公司微信公众号的日常运营", bullet=True)
line(d, "协助组织线上活动", bullet=True)
line(d, "参与撰写推文和数据整理", bullet=True)
line(d, "配合其他部门完成相关工作", bullet=True)
heading(d, "教育背景")
line(d, "某大学 · 市场营销 本科（2019 - 2023）")
heading(d, "自我评价")
line(d, "工作认真负责，有较强的学习能力和团队合作精神，能吃苦耐劳。")
d.save(f"{OUT}/before.docx")

# ---------- AFTER: rewritten with the skill ----------
d = base_doc()
t = d.add_paragraph()
t.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = t.add_run("张小雅")
r.bold = True
r.font.size = Pt(18)
r.font.color.rgb = ACCENT
c = d.add_paragraph()
c.alignment = WD_ALIGN_PARAGRAPH.CENTER
c.add_run(
    "电话 138-xxxx-xxxx ｜ 邮箱 zhangxy@example.com ｜ 求职意向：高级新媒体运营"
).font.size = Pt(9.5)

heading(d, "核心亮点", ACCENT)
line(d, "3 年新媒体运营：单号粉丝 1.2万 → 8.6万；6 篇 10w+；12 场活动最高单场拉新 9,400 人。")

heading(d, "工作经历", ACCENT)
line(d, "某互联网公司 · 新媒体运营专员（2023.06 - 至今）", bold=True)
line(d, "运营公众号 18 个月，粉丝从 1.2万 增长至 8.6万（+617%），平均打开率 8.2%，约为行业均值 2 倍", bullet=True)
line(d, "策划并执行 12 场线上活动，单场最高拉新 9,400 人，单个获客成本下降 35%", bullet=True)
line(d, "产出推文 200+ 篇，6 篇阅读 10w+；搭建选题库与排期模板，内容产出效率提升 50%", bullet=True)
line(d, "牵头搭建跨部门内容审核流程，推文上线周期由 3 天缩短至 1 天", bullet=True)

heading(d, "教育背景", ACCENT)
line(d, "某大学 · 市场营销 本科（2019 - 2023）")

heading(d, "技能", ACCENT)
line(d, "用户增长 ｜ 活动策划 ｜ 数据分析（Excel/GA）｜ 内容矩阵 ｜ 私域运营")
d.save(f"{OUT}/after.docx")
print("saved before.docx / after.docx")
