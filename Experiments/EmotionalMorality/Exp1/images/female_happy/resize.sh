# resize all images within directory
WIDTH=320
HEIGHT=400

find ${FOLDER} -iname '*.jpg' -exec convert \{} -verbose -resize $WIDTHx$HEIGHT\> \{} \;
