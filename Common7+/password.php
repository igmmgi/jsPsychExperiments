<?php
function check_password($psw)
{
    return strcmp($psw, "");
}
$result = check_password($_POST["password"]);
echo $result;
