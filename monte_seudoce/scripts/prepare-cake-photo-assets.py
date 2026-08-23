from pathlib import Path
from PIL import Image

SOURCE = Path(r"C:\Users\kauaalfa\.codex\generated_images\01a02f7b-ee26-7150-bf5c-c0862a90937c")
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "layers" / "bolo-photo"
PUBLIC = ROOT / "public" / "assets" / "layers" / "bolo-photo"

ATLAS = {
    "base": SOURCE / "exec-94cc55f3-3f0f-457f-adac-2d8bfa4bdebc.png",
    "coat": SOURCE / "exec-98a977e7-4161-4a22-af53-38d8490fedde.png",
    "top": SOURCE / "exec-f932e2ff-c5b1-44b0-b701-2ac498dbe1a6.png",
    "decor": SOURCE / "exec-1f159b55-a255-402d-ba97-da45150ab5dd.png",
}

NAMES = {
    "base": ["chocolate", "morango", "baunilha", "doce-de-leite"],
    "coat": ["chocolate", "morango", "branca", "caramelo"],
    "top": ["granulado", "confetes", "frutas", "chocolate"],
    "decor": ["cereja", "estrela", "coracao", "vela"],
}


def fit_alpha(tile, max_width, max_height):
    alpha = tile.getchannel("A")
    box = alpha.getbbox()
    if not box:
        return tile
    item = tile.crop(box)
    scale = min(max_width / item.width, max_height / item.height)
    return item.resize((round(item.width * scale), round(item.height * scale)), Image.Resampling.LANCZOS)


def prepare(kind, source):
    atlas = Image.open(source).convert("RGBA")
    for index, name in enumerate(NAMES[kind]):
        left = round(index * atlas.width / 4)
        right = round((index + 1) * atlas.width / 4)
        tile = atlas.crop((left, 0, right, atlas.height))
        canvas = Image.new("RGBA", (512, 768), (0, 0, 0, 0))
        if kind == "base":
            tile = tile.resize((512, 768), Image.Resampling.LANCZOS)
            canvas.alpha_composite(tile)
        elif kind == "coat":
            item = fit_alpha(tile, 492, 515)
            canvas.alpha_composite(item, ((512 - item.width) // 2, 145 + (515 - item.height) // 2))
        elif kind == "top":
            item = fit_alpha(tile, 245, 125)
            canvas.alpha_composite(item, ((512 - item.width) // 2, 105))
        else:
            item = fit_alpha(tile, 125, 165)
            canvas.alpha_composite(item, ((512 - item.width) // 2, 48))
        filename = f"{kind}-{name}.png"
        canvas.save(OUT / filename, optimize=True)
        canvas.save(PUBLIC / filename, optimize=True)


OUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)
for asset_kind, asset_source in ATLAS.items():
    prepare(asset_kind, asset_source)
