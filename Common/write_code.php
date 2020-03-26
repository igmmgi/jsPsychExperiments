<?php
$name = "data/".$_POST['filename'].".csv";
$data = $_SERVER['DOCUMENT_ROOT'].$_POST['filedata'];
file_put_contents($name, $data.PHP_EOL, FILE_APPEND);
?>
