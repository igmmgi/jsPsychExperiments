# resize all images within directory
WIDTH=300
# HEIGHT=144

find ${FOLDER} -iname '*.png' -exec convert \{} -verbose -resize $WIDTH\> \{} \;
