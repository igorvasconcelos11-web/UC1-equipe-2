from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path(r"C:\Users\kauaalfa\.codex\generated_images\01a02f7b-ee26-7150-bf5c-c0862a90937c")
ATLASES = {
    "chocolate": SOURCE_ROOT / "exec-6766d202-87c8-43c1-8a57-f690e4615577.png",
    "morango": SOURCE_ROOT / "exec-eb25efc6-01bb-49d0-8578-b9b17e8bf830.png",
    "baunilha": SOURCE_ROOT / "exec-76a8709e-c8ad-402e-8d26-6dbeb70f0cd5.png",
    "doce-de-leite": SOURCE_ROOT / "exec-123c206c-7e78-40c8-9c5a-4f736f6f2298.png",
}
FILLING_ATLAS = SOURCE_ROOT / "exec-04d68339-c6eb-4ecf-96cd-9c120c90bd76.png"
FILLINGS = ["chocolate", "morango", "baunilha", "doce-de-leite"]
COATS = ["chocolate", "morango", "branca", "caramelo"]
TARGETS = [
    ROOT / "assets" / "layers" / "donut-completo",
    ROOT / "public" / "assets" / "layers" / "donut-completo",
]
for target in TARGETS:
    target.mkdir(parents=True, exist_ok=True)


def save_cells(atlas_path, names):
    atlas = Image.open(atlas_path).convert("RGBA")
    for index, filename in enumerate(names):
        left = round(index * atlas.width / 4)
        right = round((index + 1) * atlas.width / 4)
        tile = atlas.crop((left, 0, right, atlas.height))
        box = tile.getchannel("A").point(lambda a: 255 if a > 16 else 0).getbbox()
        art = tile.crop(box) if box else tile
        scale = min(500 / art.width, 500 / art.height)
        art = art.resize((round(art.width * scale), round(art.height * scale)), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        canvas.alpha_composite(art, ((512 - art.width) // 2, (512 - art.height) // 2))
        for target in TARGETS:
            canvas.save(target / filename, optimize=True)


save_cells(FILLING_ATLAS, [f"donut-{filling}.png" for filling in FILLINGS])
for filling, atlas in ATLASES.items():
    save_cells(atlas, [f"donut-{filling}-{coat}.png" for coat in COATS])
