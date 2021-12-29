<?php
require_once ("config.php");
require_once ("function.php");

$mysqli=mcon($mysql["host"], $mysql["user"], $mysql["pass"], $mysql["db"],$mysql["charset"]);

$query0="select JUN from survey_profile group by JUN order by JUN";
$result0=$mysqli->query($query0);
$json=null;
$i=0;
while($row0=$result0->fetch_object()){
	$json[$i]->province_id=$row0->JUN;
//	$json.="[\"$row0->JUN\",[";
	$query="
		select
			a.HC
			,count(a.HC) as cHC
			,a.lat
			,a.lng
		from
			(select HC ,lat,lng from survey_profile where JUN='$row0->JUN' group by HC) as a
			,survey_a as b
		where
			a.HC=b.HC
		group by
			a.HC
		order by
			a.HC
		";
	$result=$mysqli->query($query);
	$j=0;
	while($row=$result->fetch_object()){
		$json1[$j]->HC=$row->HC;
		$json1[$j]->lat=$row->lat;
		$json1[$j]->lng=$row->lng;
		$json1[$j]->member=$row->cHC;
//		print_r($json1[$i]);
		$j++;
	}
	$result->free();
	$json[$i]->position=$json1;
	$i++;
}


echo json_encode($json);
$mysqli->close();
//[["province_code",[lat,long,member,...,]],
// ["46",[lat,long,member,...,]],
// ["94",[lat,long,member,...,]]
// ]
?>
