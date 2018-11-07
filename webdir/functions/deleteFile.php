<?php 

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