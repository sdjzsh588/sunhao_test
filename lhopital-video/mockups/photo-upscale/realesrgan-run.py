import sys
import torch
import numpy as np
from PIL import Image, ImageFilter
from spandrel import ModelLoader

SRC = "/home/user/sunhao_test/lhopital-video/public/aitool/photo-upscale/source.jpg"
OUTDIR = "/home/user/sunhao_test/lhopital-video/public/aitool/photo-upscale"

# 1) Build a believable degraded "before": downscale 4x + slight blur + heavy JPEG.
src = Image.open(SRC).convert("RGB")
W, H = src.size
small = src.resize((W // 4, H // 4), Image.BICUBIC).filter(
    ImageFilter.GaussianBlur(0.6)
)
small.save(f"{OUTDIR}/before.jpg", quality=28)
before = Image.open(f"{OUTDIR}/before.jpg").convert("RGB")
print(f"before {before.size}")

# 2) Real-ESRGAN x4 on the degraded input (CPU).
model = ModelLoader().load_from_file("/tmp/realesr/RealESRGAN_x4plus.pth")
model.eval().cpu()
arr = np.array(before).astype(np.float32) / 255.0
t = torch.from_numpy(arr).permute(2, 0, 1).unsqueeze(0)
with torch.no_grad():
    out = model(t)
out = out.squeeze(0).permute(1, 2, 0).clamp(0, 1).numpy()
after = Image.fromarray((out * 255).round().astype(np.uint8))
after.save(f"{OUTDIR}/after.png")
print(f"after {after.size}")
