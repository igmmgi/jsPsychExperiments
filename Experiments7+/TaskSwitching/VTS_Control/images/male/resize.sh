# resize all images within directory
WIDTH=700
# HEIGHT=144

find ${FOLDER} -iname '*.jpg' -exec convert \{} -verbose -resize $WIDTH\> \{} \;
