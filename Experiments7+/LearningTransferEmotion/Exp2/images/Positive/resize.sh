# resize all images within directory
WIDTH=250
# HEIGHT=144

find ${FOLDER} -iname '*.jpg' -exec convert \{} -verbose -resize $WIDTH\> \{} \;
