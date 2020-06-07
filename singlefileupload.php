<?php

//load
session_start();

$tmp_name = $_FILES['file']['tmp_name'];
$file_name = $_FILES['file']['name'];
$file_target = setting::$writepath . $file_name;
move_uploaded_file($tmp_name, $file_target);
?>
