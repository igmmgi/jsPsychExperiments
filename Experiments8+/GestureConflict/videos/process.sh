#!/bin/bash

# Delete all files that already have _processed in the name
find . -type f -name "*_processed.mp4" -exec rm -f {} +

find . -type f -name "*.mp4" | while read -r file; do
	dir=$(dirname "$file")
	base=$(basename "$file")
	name="${base%.*}"

	output="${dir}/${name}_processed.mp4"

	ffmpeg -ss 1 -i "$file" \
		-vf "scale=iw/2:-2" \
		-map 0:v:0 -map 0:a:0 \
		-c:v libx264 -profile:v baseline -level 3.1 -crf 23 -preset slow \
		-c:a aac \
		-metadata:s:v:0 timecode= \
		-movflags +faststart "$output"
done



