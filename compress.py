import os, sys
from PIL import Image

base = "/Users/misheladnan/Desktop/Nalakath_Holdings/Oval-Palace/oval-palace/images"
files = [f for f in os.listdir(base) if f.endswith('.jpg')]

for fname in sorted(files):
    fpath = os.path.join(base, fname)
    old_size = os.path.getsize(fpath)
    
    img = Image.open(fpath).convert('RGB')
    w, h = img.size
    
    # Resize large images to max 1920px on longest side
    max_dim = 1920
    resample = Image.Resampling.LANCZOS if hasattr(Image, 'Resampling') else Image.LANCZOS
    if max(w, h) > max_dim:
        if w > h:
            new_w = max_dim
            new_h = int(h * max_dim / w)
        else:
            new_h = max_dim
            new_w = int(w * max_dim / h)
        img = img.resize((new_w, new_h), resample)
    
    # Save as WebP
    out_name = fname.rsplit('.', 1)[0] + '.webp'
    out_path = os.path.join(base, out_name)
    
    # Quality: 85 for hero images, 80 for others
    q = 85 if fname.startswith('hero') else 80
    img.save(out_path, 'WEBP', quality=q)
    
    new_size = os.path.getsize(out_path)
    reduction = (1 - new_size / old_size) * 100
    print(f"{fname:25s} {old_size/1024/1024:5.1f}MB -> {out_name:25s} {new_size/1024/1024:5.1f}MB ({reduction:.0f}% saved)")

print(f"\nTotal images converted: {len(files)}")
print(f"Total size before: {sum(os.path.getsize(os.path.join(base,f)) for f in files if f.endswith('.jpg'))/1024/1024:.0f}MB")
webps = [f for f in os.listdir(base) if f.endswith('.webp') and f != 'og-image.png']
print(f"Total size after:  {sum(os.path.getsize(os.path.join(base,f)) for f in webps)/1024/1024:.0f}MB")
