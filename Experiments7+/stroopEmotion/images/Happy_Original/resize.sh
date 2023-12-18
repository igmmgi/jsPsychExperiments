# resize all images within directory
WIDTH=350
# HEIGHT=144

find ${FOLDER} -iname '*.jpg' -exec convert \{} -verbose -resize $WIDTH\> \{} \;
