import os
from rembg import remove, new_session
from PIL import Image

BASE = "/home/user/sunhao_test/lhopital-video/public/aitool/rembg"
SRC = f"{BASE}/src"
os.makedirs(f"{BASE}/cut", f"{BASE}/out".__class__ and f"{BASE}/out", exist_ok=True) if False else None
os.makedirs(f"{BASE}/cut", exist_ok=True)
os.makedirs(f"{BASE}/out", exist_ok=True)

session = new_session("u2net")

def cut(name):
    img = Image.open(f"{SRC}/{name}.jpg").convert("RGBA")
    out = remove(img, session=session)  # RGBA with alpha
    out.save(f"{BASE}/cut/{name}.png")
    return out

def on_bg(cutout, bg):
    canvas = Image.new("RGBA", cutout.size, bg)
    canvas.alpha_composite(cutout)
    return canvas.convert("RGB")

# 1) portrait -> ID-photo blue background
p = cut("portrait")
on_bg(p, (37, 99, 235, 255)).save(f"{BASE}/out/portrait.jpg", quality=92)

# 2) product -> clean white (e-commerce main image)
s = cut("product")
on_bg(s, (245, 245, 245, 255)).save(f"{BASE}/out/product.jpg", quality=92)

# 3) pet -> soft solid color
c = cut("pet")
on_bg(c, (255, 214, 165, 255)).save(f"{BASE}/out/pet.jpg", quality=92)

print("done", [name for name in ("portrait", "product", "pet")])
