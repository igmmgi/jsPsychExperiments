# resize all images within directory
WIDTH=500
# HEIGHT=144

find ${FOLDER} -iname '*.png' -exec convert \{} -verbose -resize $WIDTH\> \{} \;
