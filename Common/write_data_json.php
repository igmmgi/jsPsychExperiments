<?php
$post_data = json_decode(file_get_contents('php://input'), true); 
$name = $_SERVER['DOCUMENT_ROOT'].$post_data['filename'].".json"; 
$data = $post_data['filedata'];
file_put_contents($name, $data);
