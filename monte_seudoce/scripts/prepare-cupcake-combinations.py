from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path(r"C:\Users\kauaalfa\.codex\generated_images\01a02f7b-ee26-7150-bf5c-c0862a90937c")
ATLASES = {
    "chocolate": SOURCE_ROOT / "exec-75c54a31-aceb-43cc-bd5b-d1b8daa97038.png",
    "morango": SOURCE_ROOT / "exec-f0f495c6-20da-439a-912b-5bd8f1aa1fe3.png",
    "baunilha": SOURCE_ROOT / "exec-81b3afd8-17b2-4926-8f23-9714ea1050e1.png",
    "doce-de-leite": SOURCE_ROOT / "exec-62929e57-ec7a-46c0-9827-68c3a0791965.png",
}
FILLING_ATLAS = SOURCE_ROOT / "exec-ae2e374d-dbe9-457a-ad77-befbbf34f666.png"
FILLINGS = ["chocolate", "morango", "baunilha", "doce-de-leite"]
COATS = ["chocolate", "morango", "branca", "caramelo"]
TARGETS = [
    ROOT / "assets" / "layers" / "cupcake-completo",
    ROOT / "public" / "assets" / "layers" / "cupcake-completo",
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


save_cells(FILLING_ATLAS, [f"cupcake-{filling}.png" for filling in FILLINGS])
for filling, atlas in ATLASES.items():
    save_cells(atlas, [f"cupcake-{filling}-{coat}.png" for coat in COATS])
