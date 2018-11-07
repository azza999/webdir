<?php 

spl_autoload_register(function ($str)
{
	$str = str_replace("\\", "/", $str);
	if(file_exists($path = __DIR__."/${str}.php")) {
		require($path);
	}
});

function view($page, $data = [])
{
	extract($data);
	include __DIR__."/Views/header.php";
	include __DIR__."/Views/${page}.php";
	include __DIR__."/Views/footer.php";
}

function pr($arr)
{
	echo "<pre>";
	print_r($arr);
	echo "</pre>";
}
function js($script)
{
	echo "<script>";
	echo "${script}";
	echo "</script>";
}

function alert($msg)
{
	js('alert(`${msg}`)');
}

function go($page)
{
	js('location.href=`${page}`');
}

function __error($c,$y,$w,$l,$arr)
{
	echo "$y<br>";
	echo "$w at line $l";
	pr($arr);
}

function strfix($str,$num)
{
	if (strlen($str) > $num) {
		return substr($str, 0,$num-3).'...';
	}
	return $str;
}

function __main($url)
{
	session_start();
	$param = explode("/", $url);
	$service = ucfirst(array_shift($param) ?: 'main');
	$method = array_shift($param) ?: 'main';
	try {
		$controller = (new ReflectionClass("Controllers\\${service}Controller"))->newInstance();
		if (method_exists($controller, $method)) {
			return call_user_func_array([$controller,$method], $param);
		} else {
			return view('404');
		}
	} catch (Exception $e) {
		return view('404',$e);
	}
}

set_error_handler('__error');
return __main($_GET['url'] ?? '');