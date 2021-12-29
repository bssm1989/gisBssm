<?php
session_start();
$CONFIG = array();
error_reporting(E_ALL & ~E_NOTICE);
$CONFIG['host'] = "localhost";
$CONFIG['user'] = "livingon";
$CONFIG['pass'] = "8BjF3FgAf@1-2u";
$CONFIG['db'] = "livingon_thaipov";
$CONFIG['title'] = "โครงการพัฒนาระบบสนับสนุนการทำงานเชิงพื้นที่เพื่อการแก้ไขปัญหาความยากจนแบบเบ็ดเสร็จและแม่นยำ";
$CONFIG['admin_email'] = "wongsuwan4@gmail.com";
$CONFIG['admin_pwd'] = "nawusgnow";
function randomPassword(){
    $alpha = 'abcdefghijklmnopqrstuvwxyz1234567890';
    $pass = array();
    $len = strlen($alpha) - 1;
    for($i = 0; $i < 8; $i++){
        $n = rand(0, $len);
        $pass[] = $alpha[$n];
    }
    return implode($pass);
}
?>