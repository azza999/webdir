<?php 

print_r($_FILES);
$dir = $_POST['dir'];
foreach ($_FILES as $file) {
	move_uploaded_file($file['tmp_name'], $dir.'/'.$file['name']);
}