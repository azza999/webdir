<?php 

session_start();

$users = file_get_contents('users.json');

$users = json_decode($users,true)['users'];

foreach ($users as $user) {
	if ($user['id'] == $_POST['id'] && $user['pw'] == hash('sha256',$_POST['pw'].'webdirsalt')) {
		$_SESSION['__webdir'] = [];
		$_SESSION['__webdir']['id'] = $user['id'];
		$_SESSION['__webdir']['permission'] = $user['permission'];
		echo "1";
	}
}
