import os, sys
from PIL import Image

base = "/Users/misheladnan/Desktop/Nalakath_Holdings/Oval-Palace/oval-palace/images"

# Convert construction phase images
for root, dirs, files in os.walk(os.path.join(base, 'construction')):
    for fname in files:
        if fname.lower().endswith('.jpg'):
            fpath = os.path.join(root, fname)
            old_size = os.path.getsize(fpath)
            
            img = Image.open(fpath).convert('RGB')
            w, h = img.size
            
            # Resize to max 1920px
            max_dim = 1920
            if max(w, h) > max_dim:
                resample = Image.Resampling.LANCZOS if hasattr(Image, 'Resampling') else Image.LANCZOS
                if w > h:
                    new_w = max_dim
                    new_h = int(h * max_dim / w)
                else:
                    new_h = max_dim
                    new_w = int(w * max_dim / h)
                img = img.resize((new_w, new_h), resample)
            
            out_name = fname.rsplit('.', 1)[0] + '.webp'
            out_path = os.path.join(root, out_name)
            img.save(out_path, 'WEBP', quality=80)
            
            new_size = os.path.getsize(out_path)
            reduction = (1 - new_size / old_size) * 100
            print(f"{fname:25s} {old_size/1024:6.1f}KB -> {out_name:25s} {new_size/1024:6.1f}KB ({reduction:.0f}% saved)")

print("\nDone converting construction phase images.")
