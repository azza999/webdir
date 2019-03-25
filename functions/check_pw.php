<?php 

if (hash('sha256', $_POST['pw']) == 'e72c71ef8c4e8b1e5c450b809b95dda7b3a9e2f9b5f46d070dbeef72312eded2') {
	echo 1;
} else {
	echo 0;
}