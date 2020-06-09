<?php
//load
require_once('settings.php');
require_once('clean_folder.php');
require_once('writable_check.php');
require_once('readfolder.php');
require_once('saveuploaded.php');

session_start();


if (isset($_POST['name'])) {

    $tmp_name = $_FILES['file']['tmp_name'];
    $file_name = $_POST['name'];
    $index = $_POST['index'];
    $targetsize = $_POST['size'];
    $file_ext = explode('.', $file_name);
    $file_ext = end($file_ext);
    $chunkname = $_POST['chunkname'];
    $filecount = $_POST['chunkammount'];

    $filetarget = setting::$writepath . $file_name;

    saveuploaded($tmp_name, $filetarget, $index, $targetsize, $filecount);
}
