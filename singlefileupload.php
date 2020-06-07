<?php
// error_reporting('E_ALL');
// // error_reporting(-1);
// ini_set('display_errors', 'On');


//load
require_once('C:/inetpub/wwwroot/Cloud/settings.php');
require_once('C:/inetpub/wwwroot/Cloud/clean_folder.php');
require_once('C:/inetpub/wwwroot/Cloud/writable_check.php');

session_start();

//vars
$tmp_name = $_FILES['file']['tmp_name'];
$file_name = $_FILES['file']['name'];
$file_target = setting::$writepath . $file_name;
move_uploaded_file($tmp_name, $file_target);
?>