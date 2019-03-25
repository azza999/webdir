<?php 

include 'chk_permission.php';
if(!chk_permission('root')) {
	echo 'permission error';
	echo "your permission : ".$_SESSION['__webdir']['permission'];
	return false;
}

$dir = $_POST['dir'];
if (is_dir($dir)) {
	$inners = scandir($dir);
	if (count($inners) > 2) {
		echo false;
	} else {
		rmdir($dir);
		echo true;
	}
} else {
	echo unlink($dir);
}