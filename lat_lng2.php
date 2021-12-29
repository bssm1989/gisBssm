<!DOCTYPE HTML>
<script src="../Cesium-1.77/Build/Cesium/Cesium.js" crossorigin="anonymous"></script>
<script src="js/jquery-2.2.4.js"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" crossorigin="anonymous"></script>
<script src="js/bootstrap.js"></script>
<script src="js/jquery.dataTables.min.js"></script>
<script src="js/dataTables.bootstrap.min.js"></script>
<script src="js/dataTables.responsive.min.js"></script>
<script src="js/dataTables.fixedHeader.min.js"></script>
<script src="js/dataTables.editor.min.js"></script>
<script src="js/editor.bootstrap.js"></script>
<script src="js/dataTables.buttons.min.js"></script>
<script src="js/dataTables.select.min.js"></script>
<script src="js/responsive.bootstrap.min.js"></script>
<script src="js/buttons.bootstrap.min.js"></script>
<script src="js/buttons.colVis.min.js"></script>
<script src="//js.arcgis.com/4.10/dojo/dojo.js" crossorigin="anonymous"></script>
  <html>
    <head>
        <meta charset="UTF-8">
        <title>Create Map Sample | Longdo Map</title>
        <style type="text/css">
          html{
            height:100%; 
          }
          body{ 
            margin:0px;
            height:100%; 
          }
          #map {
            height: 100%;
          }
        </style>

        <script type="text/javascript" src="../survey_p2/script.js"></script>

<table border='1'>
    <thead>
		<tr>
			<td rowspan='2'>HC</td>
			<td rowspan='2'>TMP</td>
			<td rowspan='2'>AMP</td>
			<td rowspan='2'>mm</td>
			<td colspan='2'>ตำบล</td>
			<td colspan='2'>GIS</td>
			<td rowspan='2'>d</td>
			<td rowspan='2'>flage</td>
			<td colspan='2'>พิกัดใหม่</td>
			<td colspan='2'>ตอนที่ 2</td>
			<td rowspan='2'>text</td>
		</tr>
		<tr>
			<td>lat</td>
			<td>lng</td>
			<td>lat</td>
			<td>lng</td>
			<td>lat</td>
			<td>lng</td>
			<td>lat</td>
			<td>lng</td>
		</tr>
    </thead>
<?php

require_once ("../survey_p2/config.php");
require_once ("../survey_p2/function.php");

$mysqli=mcon($mysql["host"], $mysql["user"], $mysql["pass"], $mysql["dbname"],$mysql["charset"]);
        
//$JUN=94;
$query="
	select
		HC
		,lat
		,lng
		,AMP
		,TMP
		,mm
	from
		survey_profile
	where
		JUN like '$JUN%'
		and (
			lat=''
			or lng=''
			or lat is NULL
			or lng is NULL
		)
	group by
		HC
	order by
		AMP
		,TMP
		,mm
";
$result=$mysqli->query($query);
/*
$arg="";

	$row=$result->fetch_object();

	$qu_amp="select district_name_thai from district where district_id='$row->AMP'";
	$re_amp=$mysqli->query($qu_amp);
	$ro_amp=$re_amp->fetch_object();

	$qu_tmp="select tambon_name_thai from tambon where tambon_id='$row->TMP'";
	$re_tmp=$mysqli->query($qu_tmp);
	$ro_tmp=$re_tmp->fetch_object();
	$HC1=str_replace("-","_",$row->HC);


	echo"
		<tr>
			<td>$row->HC</td>
			<td>$ro_amp->district_name_thai</td>
			<td>$ro_tmp->tambon_name_thai</td>
			<td>$row->mm</td>
			<td>$row->ch2_lat</td>
			<td>$row->ch2_lng</td>
			<td>$row->gis_lat</td>
			<td>$row->gis_lng</td>
			<td>$row->d</td>
			<td>$row->glag</td>
			<td>$row->n_lat</td>
			<td>$row->n_lng</td>
			<td><div id='showLocation_$HC1'></div></td>
		</tr>
	";
	$arg.="lon[]=$row->ch2_lng&lat[]=$row->ch2_lat";
*/
while($row=$result->fetch_object()){
	$qu_amp="select district_name_thai from district where district_id='$row->AMP'";
	$re_amp=$mysqli->query($qu_amp);
	$ro_amp=$re_amp->fetch_object();

	$qu_tmp="select tambon_name_thai,lat,lng from tambon where tambon_id='$row->TMP'";
	$re_tmp=$mysqli->query($qu_tmp);
	$ro_tmp=$re_tmp->fetch_object();
//	echo$qu_tmp."<br>";

	$qu_local="select b1_1,b1_2 from survey_b where HC='$row->HC'";
	$re_local=$mysqli->query($qu_local);
	$ro_local=$re_local->fetch_object();

	if(empty($ro_local->b1_1) || empty($ro_local->b1_2)){

		$qu_tmp="select tambon_name_thai,lat,lng from tambon where tambon_id='$row->TMP'";
		$re_tmp=$mysqli->query($qu_tmp);
		$ro_tmp=$re_tmp->fetch_object();

		$rand1=rand(-100,100);
		$rand2=rand(-100,100);
		$lat2=$rand1/1000000;
		$lng2=$rand2/1000000;
		$lat2=$ro_tmp->lat+$lat2;
		$lng2=$ro_tmp->lng+$lng2;
	//	$qu_up="update survey_profile set lat='$lat2',lng='$lng2' where HC='$row->HC';";
		$qu_up="update survey_profile set lat='$lat2',lng='$lng2' where HC='$row->HC';";
		echo$qu_up."<br>";
	}else{
		$qu_up="update survey_profile set lat='$ro_local->b1_1',lng='$ro_local->b1_2' where HC='$row->HC';";
		echo$qu_up."<br>";
	}

	$HC1=str_replace("-","_",$row->HC);
	echo"
		<tr>
			<td>$row->HC</td>
			<td>$ro_amp->district_name_thai</td>
			<td>$ro_tmp->tambon_name_thai</td>
			<td>$row->mm</td>
			<td>$ro_tmp->lat</td>
			<td>$ro_tmp->lng</td>
			<td>$lat2</td>
			<td>$lng2</td>
			<td>$row->d</td>
			<td>$row->glag</td>
			<td>$row->n_lat</td>
			<td>$row->n_lng</td>
			<td>$ro_local->b1_1</td>
			<td>$ro_local->b1_2</td>
			<td><div id='showLocation_$HC1'></div></td>
		</tr>
	";
	$arg.="&lon[]=$row->ch2_lng&lat[]=$row->ch2_lat";
//	echo$query2."<br>";
//	$mysqli->query($query2);

}

$result->free();

?>
</table>
		<script>
//			startRequest_re("GET","https://api.longdo.com/map/services/addresses?<?php echo$arg?>&noaoi=0&noelevation=0&key=f345b230be43a3b81aac5586f251249a","showLocation");
//			startRequest_re("GET","https://api.longdo.com/map/services/addresses?lon[]=101.2885625&lat[]=6.855313&lon[]=101.2944375&lat[]=6.860188&noelevation=0&nowater=0&key=f345b230be43a3b81aac5586f251249a","showLocation");
//			startRequest_re("GET","https://api.longdo.com/map/services/address?lon=101.2718125&lat=6.8353125&noaoi=0&noelevation=0&key=f345b230be43a3b81aac5586f251249a","showLocation");
//			startRequest_re("GET","https://go.gistda.or.th/map2/services/address?lon=100.5&lat=13.7&key=f345b230be43a3b81aac5586f251249a","showLocation");
//			startRequest_re("GET","https://api.longdo.com/map/services/address?lon=101.2718125&lat=6.8353125&noaoi=0&noelevation=0&key=f345b230be43a3b81aac5586f251249a","showLocation");



//			var myAddress = JSON.parse(document.map_api.address.value);
//			alert(ReturnAddress);
//			alert(myAddress.province)
			
        </script>
<?php
//echo$arg;
$mysqli->close();
?>
	<td><div id='showLocation'></div></td>
    </head>
    <body>
    </body>
  </html>
<form name='LatLng'>  
Lat Lng To Address
Lat : <input type='text'  name='lat' value='6.68587914553'> Lng : <input type='text' name='lng' value='101.1246094'> <input type='button' value='ค้นหา' onclick='LatLngToAddress(this.form)'>
<br>
<br>
<div id='ShowAddress'>
HC : <br>
lat : <br>
lng : <br>
ตำบล : <br>
อำเภอ : <br>
จังหวัด : <br>
</div>
</form>

<!--form name='Address'>  
Lat Lng To Address
Lat : <input type='text'  name='address' value='6.68587914553'> Lng : <input type='text' name='lng' value='101.1246094'> <input type='button' value='ค้นหา' onclick='LatLngToAddress(this.form)'>
<div id='ShowLatLng'></div>
</form-->

<?php
//[{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940106","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.คลองมานิง","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"},{"geocode":"940104","country":"ประเทศไทย","province":"จ.ปัตตานี","district":"อ.เมืองปัตตานี","subdistrict":"ต.บานา","postcode":"94000"}]
echo('<script src="gis.js?v='.time().'"></script>'.PHP_EOL);
?>
<script>
function LatLngToAddress(obj){
	var div_name=document.getElementById('ShowAddress')
	var pin = 'HC : <br>' +
					'lat : <br>' +
					'lng : <br>' +
					'ตำบล : <br>' +
					'อำเภอ : <br>' +
					'จังหวัด : <br>'

	div_name.innerHTML=pin
	var gis_option = {
		title:'',
		clock:true,
		home:{x:100,y:12,z:100000},
		containerID:'MapViewer',
		top:42,
		markable:true,
		Imagery:'ESRI World Imagery',
		//kmlLayer:true,
		//Terrain:'Cesium World Terrain'
	}	
	GIS = new ALGIS(gis_option);
	var HC='1111-111111-1'
	var lat=obj.lat.value
	var lng=obj.lng.value
	GIS.getAdmin1(HC,lng,lat,function(a){
		if(a){
			var pin = 'HC : ' + a.HC +'<br>\n'+
							'lat : ' + a.lat + '<br>\n'+
							'lng : ' + a.lng + '<br>\n'+
							'ตำบล : '+a.sub_district+'<br>\n'+
							'อำเภอ : '+a.district+'<br>\n'+
							'จังหวัด : '+a.province+'<br>\n';
		}

		div_name.innerHTML=pin
		//alert(pin)
	});
}

function AddressToLatLng(obj){
	var div_name=document.getElementById('ShowAddress')
	div_name.innerHTML=''
	var gis_option = {
		title:'',
		clock:true,
		home:{x:100,y:12,z:100000},
		containerID:'MapViewer',
		top:42,
		markable:true,
		Imagery:'ESRI World Imagery',
		//kmlLayer:true,
		//Terrain:'Cesium World Terrain'
	}	
	GIS = new ALGIS(gis_option);
	var HC='1111-111111-1'
	var lat=obj.lat.value
	var lng=obj.lng.value
	GIS.getAdmin22(HC,lng,lat,function(a){
		if(a){
			var pin = 'HC : ' + a.HC +'<br>\n'+
							'lat : ' + a.lat + '<br>\n'+
							'lng : ' + a.lng + '<br>\n'+
							'ตำบล : '+a.sub_district+'<br>\n'+
							'อำเภอ : '+a.district+'<br>\n'+
							'จังหวัด : '+a.province+'<br>\n';
		}

		div_name.innerHTML=pin
		//alert(pin)
	});
}
</script>