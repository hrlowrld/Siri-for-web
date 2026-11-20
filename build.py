from pathlib import Path
import json, struct, zlib, zipfile, math

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "dist"
OUT.mkdir(exist_ok=True)
STAGE = OUT / "Siri27"
STAGE.mkdir(exist_ok=True)

# Generate a small 128x128 RGBA orb icon using only Python's standard library.
w = h = 128
raw = bytearray()
for y in range(h):
    raw.append(0)
    for x in range(w):
        dx, dy = x - 64, y - 64
        r = math.sqrt(dx*dx + dy*dy)
        if r > 59:
            raw.extend((0,0,0,0)); continue
        t = max(0.0, min(1.0, (x*0.55 + y*0.45) / 128))
        red = int(150 + 65*math.sin(t*math.pi))
        green = int(145 + 80*math.sin(t*math.pi*0.9))
        blue = int(235 + 20*math.sin(t*math.pi*1.2))
        # soft glossy highlight
        hi = max(0.0, 1.0 - math.sqrt((x-43)**2 + (y-31)**2)/34) * 0.38
        red = min(255, int(red + 255*hi)); green = min(255, int(green + 255*hi)); blue = min(255, int(blue + 255*hi))
        raw.extend((red,green,blue,255))
def chunk(kind, data):
    return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind+data) & 0xffffffff)
png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">2I5B", w,h,8,6,0,0,0)) + chunk(b"IDAT", zlib.compress(bytes(raw), 9)) + chunk(b"IEND", b"")
(STAGE / "icon.png").write_bytes(png)

source_files = ["manifest.json","background.js","content.js","styles.css","chatgpt-bridge.js","README.md"]
for name in source_files:
    (STAGE / name).write_bytes((ROOT / name).read_bytes())
manifest_path = STAGE / "manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
manifest["icons"] = {"128":"icon.png"}
manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
with zipfile.ZipFile(OUT / "Siri27.zip", "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for p in sorted(STAGE.iterdir()):
        z.write(p, p.name)
print("Created dist/Siri27.zip")
