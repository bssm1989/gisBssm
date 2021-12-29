<?php
include('config.php');
?>
<!DOCTYPE html>
<html lang="th">
<head>
<meta http-equiv='Content-Type' content='Type=text/html; charset=utf-8'>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="mobile-web-app-capable" content="yes">
<meta name="description" content="">
<title><?php echo $CONFIG['title']; ?></title>
<link href="https://cesiumjs.org/releases/1.77/Build/Cesium/Widgets/widgets.css" rel="stylesheet">
<link rel="stylesheet" href="css/bootstrap.min.css">
<link rel="stylesheet" href="css/bootstrap-extend.min.css">
<link rel="stylesheet" href="css/dataTables.bootstrap.min.css">
<link rel="stylesheet" href="css/dataTables.fixedHeader.min.css">
<link rel="stylesheet" href="css/dataTables.responsive.min.css">
<link rel="stylesheet" href="css/buttons.dataTables.min.css">
<link rel="stylesheet" href="css/select.dataTables.min.css">
<link rel="stylesheet" href="css/responsive.dataTables.min.css">
<link rel="stylesheet" href="css/responsive.bootstrap.min.css">
<link rel="stylesheet" href="css/select.bootstrap.min.css">
<link rel="stylesheet" href="css/editor.bootstrap.min.css">
<link rel="stylesheet" href="css/fixedHeader.bootstrap.min.css">
<link rel="stylesheet" href="css/buttons.bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.min.css">
<style media="screen">
body {
  font-family: sans-serif;
  margin:0;
}
textarea {
	resize: none;
}
red{
	color:red;
}
.table-responsive{
	font-size:0.9em;
}
.TableTool{
	position: fixed;
	z-index: 1;
	top: 42px;
	width: 100%;
	padding: 3px;
	background-color: #fff3f3;
	margin:0;
	padding-right:12px;
}
.dataTables_paginate{
	float: right;
}
.dataTables_info{
	float: left;
	display: inline;
}
.DTE{
	background: #e7e6ff;
	margin-top: 10px;
}
ul.dt-button-collection.dropdown-menu.two-column {
    width: auto;
}
#menu_button{
	float:left;
	margin:2px;
}
.circle {
	height: 32px;
	width: 32px;
	border-radius: 50%;
	display: inline-block;
	margin-left: 4px;
	margin-right: 4px;
	vertical-align: middle;
}
</style>
</head>
<body>
<div id="menu_bar" style="user-select: none;height:42px;background-color: #042f52;z-index:100;position: fixed;top:0;width:100%;"></div>
<script src="https://cesiumjs.org/releases/1.77/Build/Cesium/Cesium.js" crossorigin="anonymous"></script>
<script src="js/jquery-2.2.4.js"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" crossorigin="anonymous"></script>
<script src="js/bootstrap.min.js"></script>
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

<?php
echo('<script src="function.js?v='.time().'"></script>'.PHP_EOL);
echo('<script src="gis.js?v='.time().'"></script>'.PHP_EOL);
echo('<script src="database.js?v='.time().'"></script>'.PHP_EOL);
echo('<script src="storage.js?v='.time().'"></script>'.PHP_EOL);
echo('<script src="dataTables.js?v='.time().'"></script>'.PHP_EOL);
?>
<script>
if (location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
var USER = {}
var PAGES = {}
var TABLES = {}
var CONFIG = {}
var GIS;
var DB = new database();
var STORAGE = new storage();
var Provinces,Districts,SubDistricts;

var dbProvinces = function(c){
	if(Provinces){
		if(c){
			c(Provinces);
		}
		return Provinces;
	}
	DB.db({table:'province'}).get(function(r){
		Provinces = {};
		$.each(r.data,function(){
			this.id = this.province_id;
			this.name = this.province_name_thai;
			Provinces[this.id] = this;
		});
		if(c){
			c(Provinces);
		}
		return Provinces;
	});
}
var dbDistricts = function(pid,c){
	if(!Districts){
		Districts = {};
	}
	if(Districts[pid]){
		if(c){
			c(Districts[pid]);
		}
		return Districts[pid];
	}
	DB.db({table:'district',where:'province_id='+pid}).get(function(r){
		$.each(r.data,function(){
			this.id = this.district_id;
			var name = this.district_name_thai;
			if(name.startsWith('เขต')){
				name = name.replace('เขต','');
			} else if(name.startsWith('อำเภอ')){
				name = name.replace('อำเภอ','');
			}
			this.name = name;
		});
		Districts[pid] = r.data;
		if(c){
			c(Districts[pid]);
		}
		return Districts[pid];
	});
}
var dbSubDistricts = function(did,c){
	if(!SubDistricts){
		SubDistricts = {};
	}
	if(SubDistricts[did]){
		if(c){
			c(SubDistricts[did]);
		}
		return SubDistricts[did];
	}
	DB.db({table:'tambon',where:'district_id='+did}).get(function(r){
		$.each(r.data,function(){
			this.id = this.tambon_id;
			var name = this.tambon_name_thai;
			if(name.startsWith('แขวง')){
				name = name.replace('แขวง','');
			}
			this.name = name;
		});
		SubDistricts[did] = r.data;
		if(c){
			c(SubDistricts[did]);
		}
		return SubDistricts[did];
	});
}
Provinces = dbProvinces();
function Auth(){
	if(!$('#profile_button')[0]){
		var p= [
			{title:'โปรไฟล์',icon:'zmdi zmdi-account-box',href:'#profile'},
			{title:'ออกจากระบบ',icon:'zmdi zmdi-power',href:'../survey/logout.php'}
		]
		var pf = '<div class="dropdown" id="profile_button" title="โปรไฟล์" style="float:right;right: 4px;"><span class="zmdi zmdi-account" id="ProfileButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="color: #EEE;font-size: 32px;padding:3px;cursor: pointer;"></span>';
		pf = pf+'<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="ProfileButton">';
		$.each(p,function(){
			pf=pf+'<li class="dropdown-item" style="padding: 8px;font-size:16px;" title="'+this.title+'"><a class="'+this.icon+'" style="text-decoration: none;" href="'+this.href+'"><span style="padding: 10px;">'+this.title+'</span></a></li>';
		});
		pf = pf+ '</ul></div>';
		$('#menu_bar').append(pf);
	}
	$.get('../survey/cookie.php',function(r){
		var cookie = JSON.parse(r);
		USER.username = cookie.username_log;
		if(!USER.username){
			window.location.href = '../survey/?curr=login';
		}
		DB.db({table:'volunteer',where:"username='"+USER.username+"'"}).get(function(d){
			if(d.data && d.data[0]){
				var u = d.data[0];
				USER.id = u.id;
				USER.level = u.level;
				USER.email = u.email;
				if(u.JUN){
					USER.Province = Provinces[u.JUN];
				}
				setTimeout(function(){console.log(USER)},5000);
			}
		});
	});
	setTimeout(Auth,30*60*1000);
}
Auth();
var Modules= [
	{title:'สมาชิกอาสาสมัคร',icon:'zmdi zmdi-accounts-list',href:'#volunteer',table:true,name:'volunteer',script:'modules/volunteer.js'},
	//{title:'ข้อมูลครัวเรือน (จปฐ.)',icon:'zmdi zmdi-pin',href:'#poverty_pattani',map:true,table:true,name:'poverty_pattani',script:'modules/poverty_pattani.js'},
	{title:'โปรไฟล์',icon:'zmdi zmdi-account',name:'profile',href:'#profile',script:'modules/profile.js'},
	{title:'ข้อมูลครัวเรือน',icon:'zmdi zmdi-pin',href:'#survey_profile',map:true,table:true,name:'survey_profile',script:'modules/survey_profile.js'}
];
var menu = '<div class="dropdown" id="menu_button" title="เมนู">'+
		'<span class="zmdi zmdi-menu" title="เมนู" id="MenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="color: #EEE;font-size: 32px;padding:3px;cursor: pointer;"></span>'+
		'<ul id="menu_items" class="dropdown-menu" aria-labelledby="MenuButton">'+
		'<li class="dropdown-item" style="padding: 8px;font-size:16px;" title="แผนที่"><a class="zmdi zmdi-map" style="text-decoration: none;" href="#map"><span style="padding: 10px;">แผนที่</span></a></li>'+
		'<li class="dropdown-item" style="padding: 8px;font-size:16px;" title="แบบสำรวจ"><a class="zmdi zmdi-view-comfy" style="text-decoration: none;" href="/survey"><span style="padding: 10px;">แบบสำรวจ</span></a></li>'+
		'</ul></div>';
$('#menu_bar').append(menu).show();
$.each(Modules,function(){
	var m='<li class="dropdown-item" style="padding: 8px;font-size:16px;" title="'+this.title+'"><a class="'+this.icon+'" style="text-decoration: none;" href="'+this.href+'"><span id="'+this.name+'_menu" style="padding: 10px;">'+this.title+'</span></a></li>';
	$('#menu_items').append(m);
});

var page_title = '<div style="font-size: 1.2em;text-align: center;width: 80%;position: fixed;top: 6px;line-height: 15px;left: 36px;padding: 0;color: #edffff;text-shadow: 1px 2px #160767;;"><?php echo $CONFIG['title']; ?></div>';
$('#menu_bar').append(page_title);
menuChange();
window.addEventListener('popstate', function(){
	pageHash();
});
setTimeout(function(){
	pageHash();
},1000);
function menuChange(){
	if ($('#menu_button').hasClass('open')){
		$('#MenuButton').attr('class','zmdi zmdi-close');
	} else {
		$('#MenuButton').attr('class','zmdi zmdi-menu');
	}
	setTimeout(menuChange, 500);
}
function pageHash(){
	if(GIS){
		GIS.hide();
	}
	if(window.location.hash){
		var hash = window.location.hash;
		if(hash == '#map'){
			LoadMap(function(map){
				map.show();
			});
		} else {
			if(Cesium.Fullscreen.fullscreen){
				Cesium.Fullscreen.exitFullscreen();
			}
		}
		$.each(Modules,function(){
			$(this.href+'_table').hide();
			if(this.href == hash){
				if(this.table){
					openTable(this);
				} else {
					if(!this.map){
						loadPage(this);
					}
				}
			}
		});
	} else {
		window.location.hash = '#map';
	}
}
function loadPage(m){
	if(!$('#'+m.name+'_table')[0]){
		$('body').append('<div id="'+m.name+'_table" style="padding:10px;width:98%;margin-top:50px;"></div>');
	}
	if(!PAGES[m.name]){
		Require(m.script,function(mod){
			PAGES[m.name] = mod('#'+m.name+'_table');
			PAGES[m.name].show();
		});	
	} else {
		PAGES[m.name].show();
	}
}
function openTable(m){
	var table = m.name;
	$.each(Modules,function(){
		if(window.location.hash != this.href && this.name){
			$('#'+this.name+'_table').css('top','-100px');
			$('#'+this.name+'_table').hide();
			if(TABLES[this.name] && TABLES[this.name].dataTables){
				TABLES[this.name].dataTables.fixedHeader.headerOffset(-100);
			}
		}
	});
	if(!TABLES[table]){
		var script = m.script;
		var h = 84;
		$('body').append('<div id="'+table+'_table" style="top:'+h+'px;padding:0 10px;width:100%;position:relative;"><table id="'+table+'_datatables" class="table table-hover table-striped table-responsive" cellspacing="0" width="100%"></table></div>');
		TABLES[table] = true;
		if(window.location.hash == m.href){
			$('#'+table+'_table').show();
		} else {
			$('#'+table+'_table').hide();
		}
		Require(script,function(mod){
			TABLES[table] = mod();
			if(TABLES[table]){
				TABLES[table].Table.headerOffset = h;
				TABLES[table].Table.TableID = table+'_datatables';
				var db = TABLES[table].Table.db?TABLES[table].Table.db:{table:table}
				TABLES[table].Connect = DB.db(db).Snapshot(function(s){
					if(!TABLES[table].dataTables){
						TABLES[table].Snapshot = s;
						SnapData(TABLES[table]);
					} else {
						TABLES[table].newSnapshot = s;
						processItem(TABLES[table]);
					}
				});
			}
		});
	} else {
		$('#'+table+'_table').show();
		$('#'+ table+'_table').css('top',getTop()+'px');
		if(TABLES[table].dataTables){
			TABLES[table].dataTables.search('').draw();
			TABLES[table].dataTables.fixedHeader.headerOffset(getTop()+6);
			setTimeout(function(){
				$(window).trigger('resize');
				TABLES[table].dataTables.responsive.recalc();
			},200);
		}
	}
}

function LoadMap(c){
	if(GIS){
		if(c){
			c(GIS);
		}
		return GIS;
	}
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
	GIS.init();
	GIS.addLegend({id:'Terrain',title:'ภูมิประเทศ',checked:false,change:function(){
		$('#Terrain').change(function(){
			GIS.viewer.baseLayerPicker.viewModel.selectedTerrain = GIS.viewer.baseLayerPicker.viewModel.terrainProviderViewModels[0];
			if($(this).prop('checked')){
				GIS.viewer.terrainProvider = GIS.viewer.baseLayerPicker.viewModel.terrainProviderViewModels[1].creationCommand();
			} else {
				GIS.viewer.terrainProvider = GIS.viewer.baseLayerPicker.viewModel.terrainProviderViewModels[0].creationCommand();
			}
		});
	},icon:'https://cesiumjs.org/releases/1.77/Build/Cesium/Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'});
	$.each(Modules,function(){
		if(this.map && !TABLES[this.name]){
			openTable(this);
		}
	});
	if(!window.location.hash || window.location.hash!='#map'){
		GIS.hide();
	}
	if(c){
		c(GIS);
	}
	return GIS;
}
//remove modal after closed;
$('body').on('hidden.bs.modal', '.modal', function(){
	$(this).remove();
	$('.modal').css("overflow-x", "hidden");
	$('.modal').css("overflow-y", "auto");
});

//dblclick for iOS
var dbltap = false;
window.addEventListener("touchstart", function(e){
    if(!dbltap){
        dbltap=true;
        setTimeout(function(){
			dbltap=false;
		},300);
        return false;
    }
	$(e.target).dblclick();
});

function panToLocation(id){
	LoadMap().panToEntityId(id);
	window.location.hash = '#map';
}
function getProvince(id){
	if(!id){
		return '';
	}
	if(Provinces && Provinces[id]){
		return Provinces[id].name;
	}
}
function getDistrict(id){
	if(!id || id.length!=4){
		return '';
	}
	dbDistricts(id.substring(0,2),function(ds){
		$.each(ds,function(){
			if(id == this.id){
				return this.name;
			}
		});
	});
}
function getAdrress(d){
	if(d.district && d.sub_district && d.province){
		return d;
	}
	if(d.province_id && !d.province){
		if(Provinces){
			d.province = Provinces[d.province_id].name;
		}
	}
	if(d.district_id && d.province_id && !d.district){
		if(Districts && Districts[d.province_id]){
			$.each(Districts[d.province_id],function(){
				if(d.district_id == this.id){
					d.district = this.name;					
				}
			});
		} else {
			dbDistricts(d.province_id,function(ds){
				$.each(ds,function(){
					if(d.district_id == this.id){
						d.district = this.name;				
					}
				});
			});
		}
	}
	if(d.sub_district_id && d.district_id && !d.sub_district){
		if(SubDistricts && SubDistricts[d.district_id]){
			$.each(Districts[d.district_id],function(){
				if(d.sub_district_id == this.id){
					d.sub_district = this.name;	
				}
			});
		} else {
			dbSubDistricts(d.district_id,function(ds){
				$.each(ds,function(){
					if(d.sub_district_id == this.id){
						d.sub_district = this.name;
					}
				});
			});
		}
	}
	return d;
}
</script>
<script src="modules/geolocation.js"></script>
<script src="modules/administrative.js"></script>
<script src="modules/report.js"></script>
<script src="modules/marker.js"></script>
<script src="modules/covid_volunteer.js"></script>
<script src="modules/poverty_pattani.js"></script>
</body>
</html>