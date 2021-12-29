<?php
include('../config.php');
if($_GET && $_GET['logout'] && $_SESSION && $_SESSION['email'] && $_SESSION['pwd'] && $_SESSION['sid']){
	session_destroy();
}
if($_SESSION && $_SESSION['email'] && $_SESSION['pwd'] && $_SESSION['sid']){
	header("Location: ../");
}
$conn = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass']);
$conn->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
$database = $CONFIG['db'];
$conn->query("CREATE DATABASE IF NOT EXISTS $database");
$conn->query("ALTER DATABASE $database DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci");
mysqli_close($conn);
$table_sql = "CREATE TABLE IF NOT EXISTS users (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,email VARCHAR(200),pwd VARCHAR(200),level VARCHAR(100),sid VARCHAR(100),last_login INT(13))";
$db = new mysqli($CONFIG['host'], $CONFIG['user'], $CONFIG['pass'],$CONFIG['db']);
$db->query("SET NAMES 'utf8' COLLATE 'utf8_general_ci'");
$db->query($table_sql);
$result = $db->query("SELECT * FROM users WHERE email = '".$CONFIG['admin_email']."'");
if($result->num_rows==0){
	$db->query("INSERT INTO users (email,pwd) VALUES('".$CONFIG['admin_email']."','".md5($CONFIG['admin_pwd'])."')");
}
mysqli_close($db);
?>
<!DOCTYPE html>
<html>
<head>
<title><?php echo $CONFIG['title']; ?></title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
button {
	transition-duration: 0.4s;cursor: pointer;border-radius: 4px;border: solid 2px #1c32a5;background: #1c32a5;color: #daff9e;margin:12px;padding:12px;width: 260px;font-size: 1.5em;
}
input{
	border-radius: 4px;border: solid 1px #aaacfb;margin:12px;padding:20px;width: 220px;
}
button:hover {
	background-color: #091865;
}
</style>
</head>
<body style="background-color: #4c5a35;margin: 0;">
<center>
	<div style="margin:40px 0;background-color:#c9fbe2;width:300px;border-radius: 4px;">
		<div style="width:260px;padding:20px;"><img src="../logo.png" width="100"></div>
		<div style="width:280px;padding:2px;">
			<form id="login_form">
				<input type="email" id="email" placeholder="Email" required>
				<input type="password" id="pwd" placeholder="Password" required>
				<div id="check" style="width:280px;padding:2px;font-size: 1.1em;color: #f1251b;"></div>
				<button id="login">Login</button>
			</form>
		</div>
	</div>
</center>
<script src="../js/jquery-2.2.4.min.js"></script>
<script>
function parse(r){try {return JSON.parse(r);} catch(e){return {error:'ระบบผิดพลาด'}}}
$("#login_form").submit(function(e){
	e.preventDefault();
	var data = {
		email:$('#email').val(),
		pwd:$('#pwd').val()
	}
	if(data.email && data.pwd){
		$.ajax({
			type:'POST',
			url:'login.php',
			data:data,
			success:function(r){
				r = parse(r);
				if(r.error){
					$('#check').html(r.error);
				} else {
					setTimeout(function(){
						window.location = '../';
					},500);					
				}
			}
		});
	}
	return false;
});
</script>
</body>
</html>
