<?php
function filenames($directory)
{
    debug_to_console("test")
    $files = array_diff(scandir($directory), array('.', '..'));
    return $files;
}
$files = filenames($_POST["dir"]);
echo $files;
