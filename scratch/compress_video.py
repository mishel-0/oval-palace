import os
from moviepy import VideoFileClip

def compress_video(input_file, output_file, target_size_mb=85):
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return
        
    print(f"Loading {input_file}...")
    clip = VideoFileClip(input_file)
    duration = clip.duration
    
    # Calculate target bitrate in bps
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
    # Target file for this run
    target_video = r"videos\testimonials\vg-ragunath-testimonial.mp4"
    compressed_name = r"videos\testimonials\vg-ragunath-testimonial-compressed.mp4"
    
    compress_video(target_video, compressed_name)
