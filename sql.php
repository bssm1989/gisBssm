<?php
include('config.php');
$db = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass'],'pbwatchn_volunteer');
$result = $db->query('SELECT * FROM users');
$db->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
if($result->num_rows>0){
	while($row = $result->fetch_assoc()){
		$id = $row['id'];
		$building_no = $row['building_no'];
		$db->query("UPDATE users SET building_no='$building_no' WHERE id=$id");
	}
}
mysqli_close($db);
?>