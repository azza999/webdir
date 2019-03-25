<?php 

include 'chk_permission.php';
if(!chk_permission('root')) {
	echo 'permission error';
	echo "your permission : ".$_SESSION['__webdir']['permission'];
	return false;
}

function delete($dir)
{
	if(is_dir($dir)) {
		$inners = scandir($dir);
		if (@count($inners > 0)) {
			foreach ($inners as $inner) {
				if ($inner == '.' || $inner == '..') continue;
				delete($dir.'/'.$inner);
			}
		}
		echo $dir.'\n';
		rmdir($dir);
	} else {
		echo $dir.'\n';
		unlink($dir);
	}
}

$dir = $_POST['dir'];
delete($dir);