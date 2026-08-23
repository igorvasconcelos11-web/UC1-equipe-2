from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = Path(r"C:\Users\kauaalfa\.codex\generated_images\01a02f7b-ee26-7150-bf5c-c0862a90937c")
ATLASES = {
    "chocolate": SOURCE_ROOT / "exec-e8ff381a-854a-408d-aecc-6603e48e6f9b.png",
    "morango": SOURCE_ROOT / "exec-5aad8c40-1c2d-4fdc-af05-33e2425c6be3.png",
    "baunilha": SOURCE_ROOT / "exec-fbbfc8e4-930f-408d-b396-8169dcb68a87.png",
    "doce-de-leite": SOURCE_ROOT / "exec-7c6f060c-a8c1-4f3e-a230-27eae4189162.png",
}
COATS = ["chocolate", "morango", "branca", "caramelo"]
TARGETS = [
    ROOT / "assets" / "layers" / "bolo-completo",
    ROOT / "public" / "assets" / "layers" / "bolo-completo",
]

for target in TARGETS:
    target.mkdir(parents=True, exist_ok=True)

for filling, source in ATLASES.items():
    atlas = Image.open(source).convert("RGBA")
    for index, coat in enumerate(COATS):
        left = round(index * atlas.width / 4)
        right = round((index + 1) * atlas.width / 4)
        tile = atlas.crop((left, 0, right, atlas.height))
        bbox = tile.getchannel("A").getbbox()
        art = tile.crop(bbox) if bbox else tile
        scale = min(500 / art.width, 500 / art.height)
        art = art.resize((round(art.width * scale), round(art.height * scale)), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
        canvas.alpha_composite(art, ((512 - art.width) // 2, (512 - art.height) // 2))
        filename = f"cake-{filling}-{coat}.png"
        for target in TARGETS:
            canvas.save(target / filename, optimize=True)
