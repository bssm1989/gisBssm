<?php
if(!$_POST || !$_POST['email'] || !$_POST['pwd']){
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
	$level = 'user';
	if($row['level']){
		$level = $row['level'];
	}
	$res['email'] = $row['email'];
	if($row['pwd'] == md5($_POST['pwd'])){
		$res['pwd'] = true;
		$sid = session_id();
		$res['sid'] = $sid;
		$time = time();
		$update = "UPDATE users SET sid='$sid',last_login=$time WHERE email = '$email'";
		if($db->query($update) === TRUE){
			$res['login'] = true;
			$_SESSION['email'] = $email;
			$_SESSION['login'] = $time;
			$_SESSION['sid'] = $sid;
			$_SESSION['pwd'] = true;
			$_SESSION['level'] = $level;
			$_SESSION['id'] = $row['id'];
			$_SESSION['db'] = $CONFIG['db'];
			$res['error'] = false;
		}
	} else {
		$res['pwd'] = false;
		$res['error'] = 'รหัสผ่านไม่ถูกต้อง';
	}
} else {
	$res['email'] = false;
	$res['error'] = 'ไม่มี email นี้ในระบบ';
}
echo json_encode($res,true);
mysqli_close($db);
?>