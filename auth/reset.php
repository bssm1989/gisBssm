<?php
if(!$_POST || !$_POST['email'] || !$_POST['reset']){
	exit();
}
include('../config.php');
$res = array();
$db = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass'],$CONFIG['db']);
$db->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
$email = trim($_POST['email']);
$result = $db->query("SELECT * FROM users WHERE email = '$email'");
if($result->num_rows==1){
	$row = $result->fetch_assoc();
	if($row['level']){
		$level = $row['level'];
	}
	$res['email'] = $row['email'];
} else {
	$res['email'] = false;
	$res['error'] = 'ไม่มี email นี้ในระบบ';
}
echo json_encode($res,true);
mysqli_close($db);
?>