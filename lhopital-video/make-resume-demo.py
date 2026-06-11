# EP05 demo assets — a deliberately weak resume vs. the version rewritten by
# genuinely following ResumeSkills' resume-bullet-writer (X-Y-Z formula, action
# verbs, metrics), resume-quantifier and resume-ats-optimizer (single column,
# standard fonts, no tables/graphics) skills. Both written as real .docx,
# rendered docx -> pdf (LibreOffice) -> png (pypdfium2), then cropped to the
# content area for the video.
import os
import subprocess

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

OUT = "/home/user/sunhao_test/lhopital-video/public/aitool/resume/files"
os.makedirs(OUT, exist_ok=True)

ACCENT = RGBColor(0x1A, 0x5F, 0x9E)
GREY = RGBColor(0x66, 0x6E, 0x76)


def base_doc():
    d = Document()
    for s in d.sections:
        s.top_margin = s.bottom_margin = Cm(1.5)
        s.left_margin = s.right_margin = Cm(1.9)
    st = d.styles["Normal"]
    st.font.name = "WenQuanYi Zen Hei"
    st.element.rPr.rFonts.set(qn("w:eastAsia"), "WenQuanYi Zen Hei")
    st.font.size = Pt(10.5)
    return d


def bottom_border(p, color="1A5F9E", size=8, space=4):
    pPr = p._p.get_or_add_pPr()
    pBdr = pPr.makeelement(qn("w:pBdr"), {})
    bottom = pPr.makeelement(
        qn("w:bottom"),
        {
            qn("w:val"): "single",
            qn("w:sz"): str(size),
            qn("w:space"): str(space),
            qn("w:color"): color,
        },
    )
    pBdr.append(bottom)
    pPr.append(pBdr)


def line(d, text, bullet=False, size=10.5, bold=False, after=3, color=None):
    p = d.add_paragraph()
    p.paragraph_format.space_after = Pt(after)
    if bullet:
        p.paragraph_format.left_indent = Cm(0.45)
        text = "• " + text
    r = p.add_run(text)
    r.font.size = Pt(size)
    r.bold = bold
    if color:
        r.font.color.rgb = color
    return p


# ---------- BEFORE: the typical weak resume (plain on purpose) ----------
d = base_doc()
t = d.add_paragraph()
t.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = t.add_run("张小雅")
r.bold = True
r.font.size = Pt(18)
c = d.add_paragraph()
c.alignment = WD_ALIGN_PARAGRAPH.CENTER
c.add_run("电话 138-xxxx-xxxx ｜ 邮箱 zhangxy@example.com").font.size = Pt(9.5)


def plain_heading(text):
    p = d.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run(text)
    r.bold = True
    r.font.size = Pt(13)


plain_heading("求职意向")
line(d, "新媒体运营相关工作")
plain_heading("工作经历")
line(d, "某互联网公司 · 新媒体运营专员（2023.06 - 至今）", bold=True)
line(d, "负责公司微信公众号的日常运营", bullet=True)
line(d, "协助组织线上活动", bullet=True)
line(d, "参与撰写推文和数据整理", bullet=True)
line(d, "配合其他部门完成相关工作", bullet=True)
plain_heading("教育背景")
line(d, "某大学 · 市场营销 本科（2019 - 2023）")
plain_heading("自我评价")
line(d, "工作认真负责，有较强的学习能力和团队合作精神，能吃苦耐劳。")
d.save(f"{OUT}/before.docx")

# ---------- AFTER: rewritten with the skill, properly typeset ----------
d = base_doc()

# Name block: name left, intent right of it, thin accent rule underneath.
p = d.add_paragraph()
p.paragraph_format.space_after = Pt(2)
r = p.add_run("张小雅")
r.bold = True
r.font.size = Pt(24)
r.font.color.rgb = RGBColor(0x20, 0x26, 0x2C)
r2 = p.add_run("　　高级新媒体运营")
r2.font.size = Pt(13)
r2.font.color.rgb = ACCENT
r2.bold = True

c = d.add_paragraph()
c.paragraph_format.space_after = Pt(8)
c.add_run(
    "电话 138-xxxx-xxxx ｜ 邮箱 zhangxy@example.com ｜ 微信 zxy-yunying"
).font.size = Pt(9.5)
c.runs[0].font.color.rgb = GREY
bottom_border(c, size=14, space=6)


def heading(text):
    p = d.add_paragraph()
    p.paragraph_format.space_before = Pt(13)
    p.paragraph_format.space_after = Pt(5)
    r = p.add_run(text)
    r.bold = True
    r.font.size = Pt(13.5)
    r.font.color.rgb = ACCENT
    bottom_border(p, color="D8E2EC", size=6, space=3)


heading("核心亮点")
line(d, "3 年新媒体运营，擅长用户增长与内容转化：", after=2)
line(d, "单号粉丝 1.2万 → 8.6万（+617%）｜ 6 篇 10w+ ｜ 单场活动拉新 9,400 人", bullet=True, bold=True)

heading("工作经历")
p = line(d, "某互联网公司 · 新媒体运营专员", bold=True, after=1)
p.add_run("　2023.06 - 至今").font.color.rgb = GREY
line(d, "运营公众号 18 个月，粉丝从 1.2万 增长至 8.6万（+617%），平均打开率 8.2%，约为行业均值 2 倍", bullet=True)
line(d, "策划并执行 12 场线上活动，单场最高拉新 9,400 人，单个获客成本下降 35%", bullet=True)
line(d, "产出推文 200+ 篇，6 篇阅读 10w+；搭建选题库与排期模板，内容产出效率提升 50%", bullet=True)
line(d, "牵头搭建跨部门内容审核流程，推文上线周期由 3 天缩短至 1 天", bullet=True)

heading("项目经历")
p = line(d, "私域增长项目 · 负责人", bold=True, after=1)
p.add_run("　2024.03 - 2024.09").font.color.rgb = GREY
line(d, "从 0 搭建企业微信私域，6 个月沉淀用户 2.3万，复购率提升 18%", bullet=True)
line(d, "设计 3 套自动化欢迎/召回流程，人工客服量减少 40%", bullet=True)

heading("教育背景")
p = line(d, "某大学 · 市场营销 本科", bold=True, after=1)
p.add_run("　2019 - 2023").font.color.rgb = GREY

heading("技能")
line(d, "用户增长 ｜ 活动策划 ｜ 数据分析（Excel / GA）｜ 内容矩阵 ｜ 私域运营")
d.save(f"{OUT}/after.docx")
print("saved before.docx / after.docx")

# ---------- render to png and crop to the content area ----------
subprocess.run(
    ["soffice", "--headless", "--convert-to", "pdf", "--outdir", OUT,
     f"{OUT}/before.docx", f"{OUT}/after.docx"],
    check=True, capture_output=True,
)
import pypdfium2 as pdfium

CROP_H_FRAC = 0.72  # keep the top 72% of the A4 page — content area
# 2x the 880px display width in the video (integer-ish downscale = crisp text)
SCALE = 2.9
for n in ("before", "after"):
    page = pdfium.PdfDocument(f"{OUT}/{n}.pdf")[0]
    img = page.render(scale=SCALE).to_pil()
    w, h = img.size
    img.crop((0, 0, w, int(h * CROP_H_FRAC))).save(f"{OUT}/{n}.png")
    print(n, "cropped", (w, int(h * CROP_H_FRAC)))
