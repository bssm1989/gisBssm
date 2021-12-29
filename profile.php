<?php
error_reporting(E_ALL & ~E_NOTICE);
$res = array();
if(!$_POST){
	$res['error'] = 'ข้อมูลผิดพลาด';
}
if($_POST['pwd'] && $_POST['inp_pwd']){
	if(md5($_POST['inp_pwd']) != $_POST['pwd']){
		$res['error'] = 'รหัสผ่านเก่าไม่ถูกต้อง';
	} else {
		$res['error'] = false;
	}
} else {
	if($_POST['new_pwd'] && $_POST['id']){
		$md5 = md5($_POST['new_pwd']);
		$id = $_POST['id'];
		include('config.php');
		$db = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass'],$CONFIG['db']);
		$db->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
		if($db->query("UPDATE volunteer SET password='$md5' WHERE id=$id")===TRUE){
			$res['error'] = false;
			$res['update'] = true;
		}
	}
}
echo json_encode($res);
?>