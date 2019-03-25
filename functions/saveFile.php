<?php

include 'chk_permission.php';
if(!chk_permission('root')) {
	echo 'permission error';
	echo "your permission : ".$_SESSION['__webdir']['permission'];
	return false;
}

$dir = $_POST['dir'];
$content = $_POST['content'];
echo file_put_contents($dir, $content);
echo "$dir\n$content";