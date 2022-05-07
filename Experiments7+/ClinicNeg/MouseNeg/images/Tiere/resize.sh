# resize all images within directory
WIDTH=250
HEIGHT=250

find ${FOLDER} -iname '*.png' -exec convert \{} -verbose -resize $WIDTHx$HEIGHT\> \{} \;


