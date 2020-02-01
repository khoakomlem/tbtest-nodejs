<?php
if (isset($_COOKIE['taocauhoi']))
foreach ($_COOKIE['taocauhoi'] as $name => $value) {
    setcookie("taocauhoi[".$name."]", null, -1);
}
setcookie('num', null, -1);
?>