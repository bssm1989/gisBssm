<?php
if(!$_POST || !$_POST['table']){
	exit();
}
include('config.php');
$res = array();
$res['data'] = array();
$res['empty'] = true;
$res['session_id'] = session_id();
$db = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass'],$CONFIG['db']);
$db->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
$table = $_POST['table'];
$limit=100;
if($_POST['id']){
	$id = $_POST['id'];
	$result = $db->query("SELECT * FROM `$table` WHERE id = $id");
} else {
	if($_POST['where']){
		$where = $_POST['where'];
		$result = $db->query("SELECT * FROM `$table` WHERE $where limit 100");
		$res['where'] = $where;
	} else {
		$result = $db->query("SELECT * FROM `$table` limit 100");
		$res['where'] = '';
	}
}
if($result->num_rows>0){
	$res['empty'] = false;
	while($row = $result->fetch_assoc()){
		if($row['pwd'] || $row['pwd']==""){
			unset($row['pwd']);
		}
		if($row['pre_pwd'] || $row['pre_pwd']==""){
			unset($row['pre_pwd']);
		}
		if($row['pre_password'] || $row['pre_password']==""){
			unset($row['pre_password']);
		}
		array_push($res['data'],$row);
	}
}
echo json_encode($res,true);
mysqli_close($db);
?>