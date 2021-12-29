<?php
file_put_contents($_POST['path'], file_get_contents($_FILES['data']['tmp_name']));
//move_uploaded_file($_FILES['data']['tmp_name'], $_POST['path']);
echo json_encode($_POST,true);
?>