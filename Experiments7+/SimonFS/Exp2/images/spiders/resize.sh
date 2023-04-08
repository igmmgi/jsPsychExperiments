# resize all images within directory
WIDTH=170
HEIGHT=170

find ${FOLDER} -iname '*.png' -exec convert \{} -verbose -resize $WIDTHx$HEIGHT\> \{} \;


