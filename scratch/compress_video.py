import os
from moviepy import VideoFileClip

input_path = r"videos\testimonials\sameer-babu-testimonial.mp4"
output_path = r"videos\testimonials\sameer-babu-testimonial-compressed.mp4"

def compress_video(input_file, output_file, target_size_mb=85):
    print(f"Loading {input_file}...")
    clip = VideoFileClip(input_file)
    duration = clip.duration
    
    # Calculate target bitrate in bps
    # (target_size_mb * 1024 * 1024 * 8) / duration
    target_bitrate = (target_size_mb * 1024 * 1024 * 8) / duration
    
    print(f"Duration: {duration}s")
    print(f"Target Bitrate: {target_bitrate / 1000:.2f} kbps")
    
    # Write the compressed video
    print("Starting compression...")
    clip.write_videofile(
        output_file, 
        bitrate=f"{int(target_bitrate)}",
        codec="libx264",
        audio_codec="aac"
    )
    clip.close()
    print(f"Compression complete: {output_file}")

if __name__ == "__main__":
    if os.path.exists(input_path):
        compress_video(input_path, output_path)
    else:
        print(f"Error: {input_path} not found.")
