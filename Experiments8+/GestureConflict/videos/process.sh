#!/bin/bash

# Delete all files that already have _processed in the name
find . -type f -name "*_processed.mp4" -exec rm -f {} +

find . -type f -name "*.mp4" | while read -r file; do
	dir=$(dirname "$file")
	base=$(basename "$file")
	name="${base%.*}"

	output="${dir}/${name}_processed.mp4"

	ffmpeg -ss 1 -i "$file" \
		-vf "scale=iw/2:-1" \
		-c:v libx264 -crf 23 -preset slow \
		-c:a aac \
		-movflags +faststart "$output"
done



