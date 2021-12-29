(function(){
var map =	LoadMap();
var collection = {database:'pbwatchn_poverty',table:'poverty'};
var entities = map.viewer.entities;
function incomeRender(o){
	var s = 'รายได้ครัวเรือน'+'<br>';
	s = s+'อาชีพหลัก '+commaNumber(o.income_primary)+' บาท/ปี</br>';
	s = s+'อาชีพรอง '+commaNumber(o.income_secondary)+' บาท/ปี</br>';
	s = s+'รายได้อื่น '+commaNumber(o.income_other)+' บาท/ปี</br>';
	s = s+'ทำ-หาเอง '+commaNumber(o.income_self)+' บาท/ปี</br>';
	var t = parseInt(o.income_primary)+parseInt(o.income_secondary)+parseInt(o.income_other)+parseInt(o.income_self);
	s = s+'รายได้รวม '+commaNumber(t)+' บาท/ปี</br>';
	s = s+'รายได้เฉลี่ย '+commaNumber(incomeAvg(o))+' บาท/คน/ปี';
	return s;
}
function incomeAvg(o){
	var t = parseInt(o.income_primary)+parseInt(o.income_secondary)+parseInt(o.income_other)+parseInt(o.income_self);
	return parseInt(t/(parseInt(o.members_m)+parseInt(o.members_f)));
}
var poverty = {
	title:'ครัวเรือนรายได้ต่ำ (จปฐ.)',
	module:'poverty',
	GIS:{
		addMarkers:function(d){
			var t=2000;
			var $$ = this;
			map.addLegend({id:'poverty',title:'ครัวเรือนที่มีรายได้ต่ำ (จปฐ.)',checked:false,icon:'icons/home-2.png'});
			map.addLegend({id:'poverty_h',title:'รายได้มากกว่า 38,000 บาท/คน/ปี',checked:false,icon:'icons/home-yellow.png',parent:'poverty'});
			map.addLegend({id:'poverty_l',title:'รายได้ต่ำกว่า 38,000 บาท/คน/ปี',checked:false,icon:'icons/home-brown.png',parent:'poverty'});
			$.each(poverty.Snapshot.data,function(i,x){
				t=t+5;
				setTimeout(function(){
					$$.addMarker(x);
				},t);
			});
		},
		getLatLng:function(p,c){
			var $$ = this;
			map.getLatLngAdmin(p,function(r){
				p.lat = r.latLng.lat;
				p.lng =  r.latLng.lng;
				c(p);
			});
		},
		createIcon:function(d){
			return 'icons/home-2.png';
		},
		addMarker:function(o){
			var $$ = this;
			if(!o.lat || !o.lng){
				$$.getLatLng(o,function(p){
					$$.addMarker(p)
				});
				return false;
			}
			var id = 'poverty_'+o.id;
			map.removeEntityById(id);
			var name = o.house_no?o.house_no:'';
			var vn = o.village_no?'ม.'+o.village_no:'';
			var tam = o.sub_district?'ต.'+o.sub_district:'';
			if(vn){
				name = name+' '+vn;
			}
			if(tam){
				name = name+' '+tam;
			}
			var search = o.h_title+''+o.h_first_name+' '+o.h_last_name;
			search = search+' '+name+' อ.'+o.district+' จ.'+o.province;
			var ent;
			var extentDescription = '';
			if(o.images){
				extentDescription = extentDescription+'<div style="display:inline-block;">';
				$.each(o.images,function(){
					extentDescription = extentDescription+'<img style="cursor:pointer;margin:2px;" src="'+this.thumb+'" onclick="viewImage(\''+this.path+'\')">';
				});
				extentDescription = extentDescription+'</div>';
			}
			var icon = $$.createIcon(o);
			
				extentDescription=extentDescription+'<div style="padding: 5px;">'+
				'<span id="marker_undo" class="zmdi zmdi-undo" style="font-size:24px;cursor:pointer;float: right;padding:16px;display:none;" aria-hidden="true" title="เลิกย้ายพิกัด"></span>'+
				'<span id="marker_save" class="zmdi zmdi-floppy" style="font-size:24px;cursor:pointer;float: right;padding:16px;display:none;" aria-hidden="true" title="บันทึกพิกัดใหม่"></span>'+
				'<span id="marker_move" class="zmdi zmdi-arrows" style="font-size:24px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="ย้ายจุดพิกัด"></span>'+
				'<span id="marker_edit" class="zmdi zmdi-edit" style="font-size:24px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="แก้ไขข้อมูล"></span>';
				if(o.createBy == USER.id || USER.level=='admin'){
					extentDescription=extentDescription+'<span id="marker_delete" class="zmdi zmdi-delete" style="font-size:24px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="ลบจุดพิกัด"></span>';
				}
				extentDescription=extentDescription+'<a href="https://www.livingonnewpace.com/survey_p2/" target="_blank" style="text-decoration:none;color:wheat;font-size:16px;cursor:pointer;float: right;padding:16px;" aria-hidden="true" title="แบบสอบถาม">แบบสอบถาม</a></div>';
			var show = false;
			var layer = 'poverty';
			if($('#poverty').prop('checked')){
				show = true;
			}
			if(incomeAvg(o)>38000){
				layer = 'poverty_h';
				icon = 'icons/home-yellow.png';
			} else {
				layer = 'poverty_l';
				icon = 'icons/home-brown.png';
			}
			if(!map.Layers[layer]){
				map.Layers[layer] = entities.add(new Cesium.Entity());
				map.Layers[layer].show = show;
			}
			var p={
				id:id,
				parent:map.Layers[layer],
				name:name,
				search:search,
				description:{
					getValue:function(){
						var s = '';
						$.each(poverty.Snapshot.data,function(){
							if(parseInt(this.id) == parseInt(o.id)){
								s=s+'<div>ที่อยู่ : '+addressRender(this)+'</div>';
								s = s+'หัวหน้าครัวเรือน : '+o.h_title+o.h_first_name+' '+o.h_last_name;
								s = s+'<br>'+'อาชีพหัวหน้าครัวเรือน : '+o.h_occupation;
								s = s+'<br><br>'+'จำนวนสมาชิกครัวเรือน : '+'<br>'+'ชาย : '+o.members_m+'<br>'+'หญิง : '+o.members_f;
								s = s+'<br>'+'รวม : '+(parseInt(o.members_m)+parseInt(o.members_f));
								s = s+'<br><br>'+incomeRender(o);
							}
						});
						return s;
					}
				},
				extentDescription:extentDescription,
				position:map.setPosition(o),
				originalPosition:map.setPosition(o),
				dynamicLabel:{
					name:name,
					position:map.setPosition(o),
					text:'',
					scale:0.5,
					style:Cesium.LabelStyle.FILL_AND_OUTLINE,
					horizontalOrigin:Cesium.HorizontalOrigin.LEFT,
					outlineWidth:2,
					verticalOrigin:Cesium.VerticalOrigin.TOP
				},
				billboard:{
					image:icon,
					verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
					scaleByDistance:new Cesium.NearFarScalar(2000,1,2e6,0)
				},
				move:function(){
					map.pinMoving(ent,function(x){
						$('#marker_save').show();
						$('#marker_undo').show();
					});
				},
				save:function(){
					var d = {id:ent.id.replace('poverty_',''),lat:ent.lat,lng:ent.lng}
					DB.db(collection).update(d,function(out){
						$('#marker_save').hide();
						$('#marker_undo').hide();
						setTimeout(function(){
							map.viewer.selectedEntity = undefined;
							ent.draggable = false;
						},1000);
					});
				},
				edit:function(){
					var editor = poverty.dataTables.editor();
					var id = ent.id.replace('poverty_','');
					poverty.dataTables.search(id).draw();
					editor.editRow(id,ent);
				},
				delete:function(){
					var editor = poverty.dataTables.editor();
					var id = ent.id.replace('poverty_','');
					poverty.dataTables.search(id).draw();
					editor.removeRow(id,ent.name,function(){
						map.viewer.selectedEntity = undefined;
					});
				}
			}
			ent = entities.add(p);
		},
		editMarker:function(d){
			var $$ = this;
			//map.removeEntityById('poverty_'+d.id);
			setTimeout(function(){
				$$.addMarker(d);
			},20);
		},
		layerChange:function(d,t){
			var $$ = this;
			if(t=='update'){
				$$.editMarker(d);
			}
			if(t=='removed'){
				map.removeEntityById('poverty_'+d.id);
				map.removeEntityById('poverty_'+d.id+'label');
			}
			if(t=='create'){
				$$.addMarker(d);
			}
		}
	},
	Table:{
		title:"ครัวเรือนรายได้ต่ำ (จปฐ.)",
		module:'poverty',
		db:collection,
		columns:[{data:null},{data:null},{data:null},{data:null},{data:'id',title:'ID',visible:false}],
		columnDefs: [
			{targets:0,title:'ที่อยู่',width:'140px',
				render:function(d){
					var lo = '';
					var id = 'poverty_'+d.id;
					if(d.lat&&d.lng){
						lo = '<br><a style="font-size: 0.8em;text-decoration: none;cursor: pointer;" title="คลิกเพื่อดูแผนที่" onclick="panToLocation(\''+id+'\')">'+d.lat+','+d.lng+'</a>';
					}
					return addressRender(d)+lo;
			
				}
			},
			{targets:1,title:'รายละเอียดครัวเรือน',width:'180px',
				render:function(d){
					var r = '';
					r = r+'หัวหน้าครัวเรือน : ';
					r = r+d.h_title+d.h_first_name+' '+d.h_last_name;
					r = r+'<br>'+'อาชีพหัวหน้าครัวเรือน : '+d.h_occupation;
					r = r+'<br>'+'จำนวนสมาชิกครัวเรือน : '+'<br>'+'ชาย : '+d.members_m+'<br>'+'หญิง : '+d.members_f;
					r = r+'<br>'+'รวม : '+(parseInt(d.members_m)+parseInt(d.members_f));
					return r;
				}
			},
			{targets:2,title:'รายได้ครัวเรือน',width:'120px',
				render:function(d){
					return incomeRender(d);
				}
			},
			{targets:3,title:'รูป',width:'100px',
				render:function(d){
					var r = '';
					if(d.images){
						$.each(d.images,function(){
							if(this.thumb && this.path){
								r=r+'<img style="margin:2px;cursor:pointer;" src="'+this.thumb+'" onclick="viewImage(\''+this.path+'\')" width="80px"/>';
							}
						});
					}
					return r;
				}
			}
		],
		fields: [
			{type:'hidden',name:'id'},{type:'hidden',name:'createBy',def:USER.id},{type:'hidden',name:'lat'},{type:'hidden',name:'lng'},
			{label:'รหัสบ้าน',name:'house_code',attr:{pattern:'[0-9]{4}-[0-9]{6}-[0-9]{1}',placeholder:'xxxx-xxxxxx-x'}},
			{label:'บ้านเลขที่',name:'house_no'},{label:'หมู่',name:'village_no',attr:{type:"number",min:1,max:35,pattern:"[0-9]{1,2}"}},
			{label:'ชื่อหมู่บ้าน',name:'village_name'},
			provinceField(true),districtField(true),subDistrictField(true),
			{
				label:'คำนำหน้าชื่อหัวหน้าครัวเรือน',
				name:'h_title',
				attr:{placeholder:'นาย นาง นางสาว...'}
			},
			{
				label:'ชื่อหัวหน้าครัวเรือน',
				name:'h_first_name'
			},
			{
				label:'นามสกุลหัวหน้าครัวเรือน',
				name:'h_last_name'
			},
			{
				label:'อาชีพหัวหน้าครัวเรือน',
				name:'h_occupation'
			},			
			{label:'จำนวนสมาชิกในครัวเรือน (ชาย)',name:'members_m',attr:{type:"number",min:0,max:30,pattern:"[0-9]{1,2}"}},
			{label:'จำนวนสมาชิกในครัวเรือน (หญิง)',name:'members_f',attr:{type:"number",min:0,max:30,pattern:"[0-9]{1,2}"}},
			{label:'รายได้ครัวเรือน บาท/ปี (อาชีพหลัก)',name:'income_primary',attr:{type:"number",min:0,max:1000000,pattern:"[0-9]{1,5}"}},
			{label:'รายได้ครัวเรือน บาท/ปี (อาชีพรอง)',name:'income_secondary',attr:{type:"number",min:0,max:1000000,pattern:"[0-9]{1,5}"}},
			{label:'รายได้ครัวเรือน บาท/ปี (รายได้อื่น)',name:'income_other',attr:{type:"number",min:0,max:1000000,pattern:"[0-9]{1,5}"}},
			{label:'รายได้ครัวเรือน บาท/ปี (ทำ-หาเอง)',name:'income_self',attr:{type:"number",min:0,max:1000000,pattern:"[0-9]{1,5}"}},
			{label:'รูป',name: "images",type: "uploadMany",uploadText:'เลือกรูป',clearText:'ลบรูป',noFileText:'ยังไม่มีรูป',dragDrop:true,dragDropText:'หรือลากรูปมาวางในกรอบนี้',
				display: function(d){
					return '<img style="cursor:pointer;" src="'+d.thumb+'" onclick="viewImage(\''+d.path+'\')" width="80px"/>';
				},
				noImageText: '-',
				upLoadFile:function(editor, conf, files, p, c){
					conf.folder = 'photos';
					editor.upLoadFile(editor, conf, files, p, c);
				},
				multiple:true,folder:'photos',attr:{accept:"image/*"}
			},
			{label:'หมายเหตุ',name:'remark',type:'textarea'},
		],
		fnTable:function(t){if(!USER.level || USER.level!='admin'){t.hideEditorButton()}},
		canEdit:function(d){if(USER.id == d.createBy || (USER.level && USER.level=='admin')){return true}else{return true}
		}
	}
}
return poverty;
});