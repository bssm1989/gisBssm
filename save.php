<?php
include('config.php');
$res = array();
$res['data'] = $_POST['data'];
$res['error'] = false;
$res['u'] = $_SESSION;
$time = microtime(true);
$conn = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass']);
$conn->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
if($conn->connect_error) {
  $res['error'] = $conn->connect_error;
}
$database = $CONFIG['db'];
$conn->query("CREATE DATABASE IF NOT EXISTS $database");
$conn->query("ALTER DATABASE $database DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");

mysqli_close($conn);
$table_create = 'id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,';
foreach($_POST['data'] as $k => $v){
	$table_create = $table_create.$k.' VARCHAR(200) NOT NULL,';
}
$table_create = rtrim($table_create, ",");
$table = $_POST['table'];
$table_sql = "CREATE TABLE IF NOT EXISTS $table ($table_create)";
$db = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass'],$CONFIG['db']);
$db->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
foreach($_POST['data'] as $k => $v){
	if($db->query("SELECT ".$k." FROM $table") === FALSE){
		$db->query("ALTER TABLE $table ADD ".$k." VARCHAR(200) NOT NULL");
	}
}
$db->query($table_sql);
if($_POST['id']){
	$id = $_POST['id'];
	if($_POST['delete']){
		$del = "DELETE FROM $table WHERE id=$id";
		if($db->query($del) === TRUE){
			$res['success'] = $_POST['id'];
		} else {
			$res['error'] = $db->error;
		}
	} else {
		$res['data']['id'] = $id;
		$update = "UPDATE $table SET last_edit=$time,";
		foreach($_POST['data'] as $k => $v){
			if(is_array($v)){
				$v = json_encode($v,true);
			}
			$update = $update.$k."='".$v."',";
		}
		$update = rtrim($update, ",");
		$update = $update." WHERE id=$id";
		if($db->query($update) === TRUE){
			$res['success'] = $id;
		} else {
			$res['error'] = $db->error;
		}
	}
} else {
	if(!$res['error']){
		if($_POST['update'] && $_POST['where']){
			$where = $_POST['where'];
			$update = "UPDATE $table SET ";
			foreach($_POST['data'] as $k => $v){
				if(is_array($v)){
					$v = json_encode($v,true);
				}
				$update = $update.$k."='".$v."',";
			}
			$update = rtrim($update, ",");
			$update = $update." WHERE $where";
			if($db->query($update) === TRUE){
				$res['success'] = $id;
			} else {
				$res['error'] = $db->error;
			}
		} else {
			if($_POST['delete'] && $_POST['where']){
				$where = $_POST['where'];
				$del = "DELETE FROM $table WHERE $where";
				if($db->query($del) === TRUE){
					$res['success'] = $where;
				} else {
					$res['error'] = $db->error;
				}
			} else {
				$keys = 'create_time';
				$values = "$time";
				foreach($_POST['data'] as $k => $v){
					if($k!='id'){
						if(is_array($v)){
							$v = json_encode($v,true);
						}
						$keys = $keys.','.$k;
						$values = $values.",'".$v."'";
					}
				}
				$insert = "INSERT INTO $table ($keys) VALUES($values)";
				if($db->query($insert) === TRUE){
					$id = $db->insert_id;
					$res['success'] = $id;
					$res['data']['id'] = $id;
				} else {
					$res['error'] = $db->error;
				}
			}
		}
	}
}
$res['db'] = $database;
$res['table'] = $_POST['table'];
mysqli_close($db);
echo json_encode($res,true);
?>