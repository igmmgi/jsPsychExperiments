import glob
from moviepy.editor import VideoFileClip

mp4_files = glob.glob("*.mp4")

for mp4_file in mp4_files:
    clip = VideoFileClip(mp4_file)
    print(f"Reding file: {mp4_file}")
    new_clip = clip.without_audio()
    new_clip.write_videofile(f"{mp4_file[0:-4]}_no_sound.mp4")
    print(f"Writing file: {mp4_file[0:-4]}_no_sound.mp4")
