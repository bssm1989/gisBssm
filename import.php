<?php
include('config.php');
$db = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass'],'pbwatchn_volunteer');
$db->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
		$keys = '';
		$values = '';
		foreach($_POST['data'] as $k => $v){
				if($keys != ''){
					$keys = $keys.','.$k;
				} else {
					$keys = $k;
				}
				if($values != ''){
					$values = $values.",'".$v."'";
				} else {
					$values = "'".$v."'";
				}
		}
		$insert = "INSERT INTO poverty ($keys) VALUES($values)";
		$db->query($insert);
		echo($db->insert_id);
mysqli_close($db);
?>