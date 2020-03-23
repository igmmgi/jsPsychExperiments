<?php
$name = "data/".$_POST['filename'].".csv";
$data = $_POST['filedata'];
file_put_contents($name, $data.PHP_EOL, FILE_APPEND);
$number = 1;
?>
