<?php 
$name = $_POST['name'];
$dir = $_POST['dir'];

header("Pragma: public");
header("Expires: 0");
header("Content-Type: application/octet-stream");
header("Content-Disposition: attachment; filename=".$name);
header("Content-Transfer-Encoding: binary");
header("ContentLength:".filesize($dir));
readfile($dir);