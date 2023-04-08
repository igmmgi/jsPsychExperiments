# resize all images within directory
WIDTH=130
HEIGHT=130

find ${FOLDER} -iname '*.png' -exec convert \{} -verbose -resize $WIDTHx$HEIGHT\> \{} \;


