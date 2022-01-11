# resize all images within directory
WIDTH=250
# HEIGHT=144

find ${FOLDER} -iname '*.png' -exec convert \{} -verbose -resize $WIDTH\> \{} \;
