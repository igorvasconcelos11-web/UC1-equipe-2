from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
GROUPS = {
    "bolo-topping": ROOT / "assets" / "layers" / "sorvete",
    "bolo-decor-normalized": ROOT / "assets" / "layers" / "bolo-decor",
}

for output_name, source_dir in GROUPS.items():
    targets = [
        ROOT / "assets" / "layers" / output_name,
        ROOT / "public" / "assets" / "layers" / output_name,
    ]
    for target in targets:
        target.mkdir(parents=True, exist_ok=True)

    prefix = "topping-" if output_name == "bolo-topping" else "decor-"
    for source in source_dir.glob(f"{prefix}*.png"):
        image = Image.open(source).convert("RGBA")
        solid = image.getchannel("A").point(lambda alpha: 255 if alpha > 32 else 0)
        box = solid.getbbox()
        if not box:
            continue
        left, top, right, bottom = box
        padding = 3
        box = (
            max(0, left - padding), max(0, top - padding),
            min(image.width, right + padding), min(image.height, bottom + padding),
        )
        trimmed = image.crop(box)
        for target in targets:
            trimmed.save(target / source.name, optimize=True)
