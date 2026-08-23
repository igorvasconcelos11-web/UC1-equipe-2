from pathlib import Path
from PIL import Image

SOURCE = Path(r"C:\Users\kauaalfa\.codex\generated_images\01a02f7b-ee26-7150-bf5c-c0862a90937c\exec-c0f2c388-5d4b-44a7-991f-7f28b14e429c.png")
ROOT = Path(__file__).resolve().parents[1]
TARGETS = [
    ROOT / "assets" / "layers" / "bolo-coat",
    ROOT / "public" / "assets" / "layers" / "bolo-coat",
]
NAMES = ["chocolate", "morango", "branca", "caramelo"]

atlas = Image.open(SOURCE).convert("RGBA")
for target in TARGETS:
    target.mkdir(parents=True, exist_ok=True)
    for index, name in enumerate(NAMES):
        left = round(index * atlas.width / 4)
        right = round((index + 1) * atlas.width / 4)
        tile = atlas.crop((left, 0, right, atlas.height))
        tile = tile.resize((512, 512), Image.Resampling.LANCZOS)
        tile.save(target / f"coat-{name}.png", optimize=True)
