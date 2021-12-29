<?php
include('config.php');
$res = array();
$conn = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass']);
$conn->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
if($conn->connect_error) {
  $res['error'] = $conn->connect_error;
} else {
	$res['error'] = false;
}
$sql = 'CREATE DATABASE IF NOT EXISTS '.$CONFIG['db'];
if($conn->query($sql) === TRUE){
	$res['db_create'] = true;
}
mysqli_close($conn);
$table = $_POST['table'];
$table_sql = "CREATE TABLE IF NOT EXISTS $table (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY)";
$db = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass'],$CONFIG['db']);
$db->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
if($db->query($table_sql) === TRUE){
	$res['table_create'] = true;
}
$db->query("CREATE TABLE IF NOT EXISTS snapshot (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,change_table VARCHAR(100) NOT NULL,change_id INT(6) NOT NULL,change_type VARCHAR(50) NOT NULL,change_index VARCHAR(1000),change_time INT(20) NOT NULL)");
$res['db'] = $CONFIG['db'];
$res['table'] = $_POST['table'];
$time = microtime(true)-20;
$result = $db->query("SELECT * FROM snapshot WHERE change_table='$table' AND change_time> $time ORDER BY id DESC LIMIT 10");
$res['snap'] = array();
$last_id = '';
if($result->num_rows>0){
	while($row = $result->fetch_assoc()){
		$row['change_index'] = json_decode($row['change_index']);
		$id = $row['change_id'];
		$last_id = $row['id'];
		$data = $db->query("SELECT * FROM $table WHERE id=$id");
		if($data->num_rows>0){
			while($d = $data->fetch_assoc()){
				$row['data'] = $d;
			}
		} else {
			$row['data'] = '';
		}
		array_push($res['snap'],$row);
	}
	$res['empty'] = false;
} else {
	$res['empty'] = true;
}
echo json_encode($res,true);
if($last_id && $last_id>2000){
	$id = $last_id-500;
	$db->query("DELETE FROM snapshot WHERE id<$id");
}
mysqli_close($db);
?>