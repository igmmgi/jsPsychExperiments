<?php
function check_password($psw)
{
    return strcmp($psw, "ian");
}
$result = check_password($_POST["password"]);
echo $result;
