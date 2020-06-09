<?php
function readfolder($path)
{
    return array_values(array_diff(scandir($path), array('.', '..')));
}
