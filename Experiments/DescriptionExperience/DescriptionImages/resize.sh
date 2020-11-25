# resize all images within directory
WIDTH=144
HEIGHT=144

find ${FOLDER} -iname '*.png' -exec convert \{} -verbose -resize $WIDTHx$HEIGHT\> \{} \;


