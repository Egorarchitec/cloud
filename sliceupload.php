<?php
//load
require_once('settings.php');
require_once('clean_folder.php');
require_once('writable_check.php');

session_start();
$tmp_dir = setting::$writepath . $_POST['name'] . "_" . $_SESSION['username'] . '/'; //creates unique file dependent folder to upload chunksif (isset($_FILES['file'])) {
    if (!file_exists($tmp_dir)) {
        mkdir($tmp_dir);
    }

    $tmp_name = $_FILES['file']['tmp_name'];
    $file_name = $_POST['name'];
    $chunkname = $_POST['chunkname'];
    $filecount = $_POST['chunkammount'];
    $chunk_target = $tmp_dir . $chunkname;
    $file_target = setting::$writepath . $file_name;

    $chunkname = explode('_', $chunkname);
    $chunkindex = end($chunkname);

    move_uploaded_file($tmp_name, $chunk_target);


    $index = 0;

    if ($chunkindex == 0) {
        while ($index <= $filecount - 1) {

            $file_name_i = $tmp_dir . $file_name . '_' . $index;
            $range = filesize($file_name_i);
            $tmpfile = fopen($file_name_i, 'rb');
            $buffer = fread($tmpfile, $range);
            fclose($tmpfile);
            unlink($file_name_i);

            $mergedhandler = fopen($file_target, 'ab');
            $merged_file = fwrite($mergedhandler, $buffer);
            fclose($mergedhandler);

            $index++;
        }
        rmdir($tmp_dir);
    }
}
