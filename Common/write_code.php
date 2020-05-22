<?php
$name = $_SERVER['DOCUMENT_ROOT'].$_POST['filename'].".csv";
$data = $_POST['filedata'];
file_put_contents($name, $data.PHP_EOL, FILE_APPEND);
?>
