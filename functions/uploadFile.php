<?php 

include 'chk_permission.php';
if(chk_permission('guest')) {
	echo 'permission error';
	echo "your permission : ".$_SESSION['__webdir']['permission'];
	return false;
}

print_r($_FILES);
$dir = $_POST['dir'];
foreach ($_FILES as $file) {
	move_uploaded_file($file['tmp_name'], $dir.'/'.$file['name']);
}