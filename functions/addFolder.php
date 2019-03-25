<?php 

include 'chk_permission.php';
if(chk_permission('guest')) {
	echo 'permission error';
	echo "your permission : ".$_SESSION['__webdir']['permission'];
	return false;
}

$dir = $_POST['dir'];

echo mkdir($dir);