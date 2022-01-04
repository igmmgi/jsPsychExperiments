<?php
function numFilesInDir($directory) {
    $numFiles = count(glob($_SERVER['DOCUMENT_ROOT'].$directory . "*"));
    return $numFiles;
}
$numFiles = numFilesInDir($_POST["dir"]);
echo $numFiles;
?>
