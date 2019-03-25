<?php 

session_start();
function chk_permission($permission)
{
	if ($_SESSION['__webdir']['permission'] != $permission) {
		return false;
	} else {
		return true;
	}
}