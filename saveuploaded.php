<?php

function saveuploaded($tmp_name, $filetarget, $index, $targetsize, $filecount)
{
    $source = fopen($tmp_name, 'rb');
    $destination = fopen($filetarget, 'a');
    stream_copy_to_stream($source, $destination);
    fclose($source);
    fclose($destination);

    $uploadedsize = filesize($filetarget);
    $targetsize_unfinished = ($index + 1) * 10485760;
    if ($uploadedsize == $targetsize_unfinished) {
        file_put_contents($filetarget . "log.txt", 'uploaded :' . $uploadedsize . ' out of :' . $targetsize .  ' in ' . ($index + 1) . ' pieces' . PHP_EOL, FILE_APPEND);
    } else {
        if ($uploadedsize == $targetsize and $index == $filecount - 1) {
            file_put_contents($filetarget . "log.txt", 'successfully uploaded ' . $uploadedsize . ' out of ' . $targetsize, FILE_APPEND);
        } else {
            if ($uploadedsize <  $targetsize){
            saveuploaded($tmp_name, $filetarget, $index, $targetsize, $filecount);
            file_put_contents($filetarget . "log.txt", 'error was during update of ' . ($index +1) . 'piece. Trying again' . PHP_EOL);
            }else {
                die; 
            }
        }
    }
}
