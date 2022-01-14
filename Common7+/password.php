<?php
function check_password($psw)
{
    $result = ($psw == "ian");
    return $result;
}
$result = check_password($_POST["password"]);
echo $result;
