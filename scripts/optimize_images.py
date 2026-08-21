from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / "public" / "images"
for source in root.glob("*.jpg"):
    if source.name in {"og.jpg", "project-01.jpg", "project-02.jpg"}:
        continue
    target = source.with_suffix(".webp")
    with Image.open(source) as image:
        image = image.convert("RGB")
        image.thumbnail((2200, 2200), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=84, method=6)
        print(f"{source.name} -> {target.name} ({image.width}x{image.height})")
