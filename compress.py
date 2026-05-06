import os
import glob
from PIL import Image

def compress_images():
    print("Starting compression...")
    image_dir = "images"
    pattern = os.path.join(image_dir, "ig-*.jpg")
    files = glob.glob(pattern)
    
    if not files:
        print("No images found matching ig-*.jpg")
        return

    for file_path in files:
        filename = os.path.basename(file_path)
        name, _ = os.path.splitext(filename)
        webp_path = os.path.join(image_dir, f"{name}.webp")
        
        print(f"Compressing {filename}...")
        try:
            with Image.open(file_path) as img:
                # Convert to RGB if necessary
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Resize if the image is too large (e.g. max width 1080px for IG)
                max_width = 1080
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Save as webp with high compression
                img.save(webp_path, "webp", quality=60, method=6)
                
            orig_size = os.path.getsize(file_path) / (1024 * 1024)
            new_size = os.path.getsize(webp_path) / 1024
            print(f"  ✓ Saved as {name}.webp (was {orig_size:.2f}MB, now {new_size:.2f}KB)")
            
            # Optionally remove the original to save space
            # os.remove(file_path)
            
        except Exception as e:
            print(f"Error compressing {filename}: {e}")
            
if __name__ == "__main__":
    compress_images()
