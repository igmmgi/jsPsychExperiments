<?php
function check_password($psw)
{
    return strcmp($psw, "test");
}
$result = check_password($_POST["password"]);
echo $result;
