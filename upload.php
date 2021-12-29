<?php
function Random(){
    $char = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $l = strlen($char)-1;
    $ran = '';
    for($i = 0; $i < 16; $i++) {
        $ran .= $char[rand(0, $l)];
    }
    return $ran;
}
$r = Random();
$res = array();
if($_FILES['file'] && $_FILES['file']){
	$filename = md5($r.'-'.$_FILES['file']['name']);
	$exts = explode(".",$_FILES['file']['name']);
	$ext = $exts[count($exts)-1];
	$filename = $filename.'.'.$ext;
	$path = 'uploads';
	$res['filename'] = $filename;
	$res['original_filename'] = $_FILES['file']['name'];
	if($_POST['path']){
		$path = $_POST['path'];
	}
	$location = $path.'/'.$filename;
	$res['path'] = $path;
	if(!file_exists($path)){
		mkdir($path, 0777, true);
	}
} else {
	$res['error'] = 'ไม่มีไฟล์';
}
if(!$res['error']){
   if(move_uploaded_file($_FILES['file']['tmp_name'], $location)){
      $res['url'] =$location;
	  $res['error'] = false;
   } else {
      $res['error'] = 'ไม่สามารถบันทึกไฟล์';
   }
}
echo json_encode($res,true);
?>