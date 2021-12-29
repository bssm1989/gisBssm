<?php
header("Content-Type: text/plain");
include('config.php');
$db = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass'],$CONFIG['db']);
$db->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
$result = $db->query("SELECT * FROM `locations`");

if($result->num_rows>0){
	while($row = $result->fetch_assoc()){
		echo($row['id'].'.'.$row['name'].PHP_EOL);
	}
}
?>